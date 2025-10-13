const { verifyAccessToken } = require("../utils/jwt-utils");
const User = require("../models/user");

/**
 * Middleware to verify JWT access token
 * Attaches user to req.user if valid
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Fetch user from database
    const user = await User.findById(decoded._id).select("-refreshTokens");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message || "Invalid token",
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Used for routes that work for both authenticated and non-authenticated users
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded._id).select("-refreshTokens");
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Continue without user
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
};