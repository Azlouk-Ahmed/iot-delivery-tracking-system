const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: 6,
    },

    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: null,
    },

    authMethod: {
      type: String,
      enum: ["google", "email", "both"],
      default: "email",
    },

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

    resetPasswordToken: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'driver', 'user'],
      default: 'user',
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 604800,
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

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    throw new Error("No password set for this user");
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.addRefreshToken = function (token) {
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
    role: this.role,
    authMethod: this.authMethod,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
