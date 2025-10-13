const express = require("express");
const passport = require("passport");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt-utils");
const { authenticateToken } = require("../middlewares/auth");
const {
  validateSignup,
  validateLogin,
  validateEmail,
  validatePasswordReset,
} = require("../middlewares/validations");
const User = require("../models/user");
require("dotenv").config();

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL;

// ==================== EMAIL/PASSWORD AUTHENTICATION ====================

// Register new user
router.post("/signup", validateSignup, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      // If user exists with Google, allow them to add password
      if (existingUser.googleId && !existingUser.password) {
        existingUser.password = password;
        existingUser.name = name || existingUser.name;
        existingUser.authMethod = 'both';
        await existingUser.save();

        // Generate tokens
        const accessToken = generateAccessToken(existingUser._id);
        const refreshToken = generateRefreshToken(existingUser._id);
        await existingUser.addRefreshToken(refreshToken);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          success: true,
          message: "Password added successfully",
          accessToken,
          user: existingUser.getPublicProfile(),
        });
      }

      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      authMethod: 'email',
      isEmailVerified: false,
    });

    // Generate email verification token (optional - implement later)
    // const verificationToken = crypto.randomBytes(32).toString('hex');
    // user.emailVerificationToken = verificationToken;
    // user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    // await user.save();
    // Send verification email here

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await user.addRefreshToken(refreshToken);

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});

// Login with email/password
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user registered with Google only
    if (!user.password && user.googleId) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Sign-In. Please use 'Continue with Google'",
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await user.addRefreshToken(refreshToken);

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

// ==================== GOOGLE OAUTH ====================

// Initiate Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/login?error=auth_failed`,
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      await user.addRefreshToken(refreshToken);

      // Set refresh token as HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Redirect with access token
      res.redirect(`${CLIENT_URL}/auth/callback?token=${accessToken}`);
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect(`${CLIENT_URL}/login?error=server_error`);
    }
  }
);

// ==================== TOKEN MANAGEMENT ====================

// Refresh access token
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user and verify token exists in database
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const tokenExists = user.refreshTokens.some(
      (rt) => rt.token === refreshToken
    );

    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
});

// ==================== USER INFO & LOGOUT ====================

// Get current user info
router.get("/me", authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user.getPublicProfile(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded._id);
        if (user) {
          await user.removeRefreshToken(refreshToken);
        }
      } catch (error) {
        console.log("Invalid refresh token during logout");
      }
    }

    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
});

// Logout from all devices
router.post("/logout-all", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.refreshTokens = [];
    await user.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
});

// ==================== PASSWORD RESET (Optional - implement later) ====================

// Request password reset
router.post("/forgot-password", validateEmail, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a password reset link has been sent",
      });
    }

    // Check if user has password (not Google-only)
    if (!user.password && user.googleId) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a password reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email here
    // const resetUrl = `${CLIENT_URL}/reset-password?token=${resetToken}`;
    // sendEmail(user.email, resetUrl);

    res.status(200).json({
      success: true,
      message: "If that email exists, a password reset link has been sent",
      // In development, you might want to return the token
      ...(process.env.NODE_ENV === "development" && { resetToken }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process request",
    });
  }
});

// Reset password
router.post("/reset-password", validatePasswordReset, async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    
    // If user only had Google auth, now they have both
    if (user.authMethod === 'google') {
      user.authMethod = 'both';
    }
    
    await user.save();

    // Invalidate all refresh tokens (force re-login)
    user.refreshTokens = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login with your new password",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
});

module.exports = router;