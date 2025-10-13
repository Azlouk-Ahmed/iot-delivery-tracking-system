const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Google OAuth fields
    googleId: {
      type: String,
      sparse: true, // Allows null values, unique only when present
      unique: true,
    },
    
    // Email/Password fields
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId;
      },
      minlength: 6,
    },
    
    // Common fields
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: null,
    },
    
    // Authentication method tracking
    authMethod: {
      type: String,
      enum: ['google', 'email', 'both'],
      default: 'email',
    },
    
    // Email verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    
    // Password reset
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    
    // Refresh tokens
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 604800, // 7 days in seconds
        },
      },
    ],
    
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  // Only hash if password is modified or new
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    throw new Error("No password set for this user");
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add refresh token
userSchema.methods.addRefreshToken = function (token) {
  // Keep only last 5 refresh tokens per user (multiple device support)
  if (this.refreshTokens.length >= 5) {
    this.refreshTokens.shift();
  }
  this.refreshTokens.push({ token });
  return this.save();
};

userSchema.methods.removeRefreshToken = function (token) {
  this.refreshTokens = this.refreshTokens.filter((rt) => rt.token !== token);
  return this.save();
};

userSchema.methods.getPublicProfile = function () {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    photo: this.photo,
    authMethod: this.authMethod,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);