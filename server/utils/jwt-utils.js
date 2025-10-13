const jwt = require("jsonwebtoken");

/**
 * Generate access token (short-lived)
 * @param {string} userId - User ID
 * @returns {string} JWT access token
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { _id: userId, type: "access" },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" } // 15 minutes
  );
};

/**
 * Generate refresh token (long-lived)
 * @param {string} userId - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { _id: userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // 7 days
  );
};

/**
 * Verify access token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (decoded.type !== "access") {
      throw new Error("Invalid token type");
    }
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

/**
 * Verify refresh token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type");
    }
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};