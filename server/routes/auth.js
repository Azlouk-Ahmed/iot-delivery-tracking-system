const express = require("express");
const passport = require("passport");
const { authenticateToken } = require("../middlewares/auth");
const {
  validateSignup,
  validateLogin,
  validateEmail,
  validatePasswordReset,
} = require("../middlewares/validations");
const authController = require("../controllers/auth");
const authorizeRoles = require("../middlewares/verifyRoles");
const ALLOWED_ROLES = require("../config/roles-list");
require("dotenv").config();

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL;

router.post("/signup", validateSignup, authController.signup);

router.post("/login", validateLogin, authController.login);
router.get("/stats", authController.getUserRegistrationStats);
router.get("/all", authController.getAll);
router.get("/admins", authController.getAdmins);
router.get("/drivers", authController.getDrivers);
router.get("/sup-admins", authController.getSupAdmins);
router.post("/staff", authController.createStaff);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/login?error=auth_failed`,
    session: false,
  }),
  authController.googleCallback
);

router.get("/refresh", authController.refreshAccessToken);
router.get("/admin-data",authenticateToken,authorizeRoles([ALLOWED_ROLES.ADMIN]), authController.getAdminData);

router.get("/redirect", authenticateToken, authController.redirect);

router.get("/me", authenticateToken, authController.getMe);

router.post("/logout", authController.logout);

router.post("/logout-all", authenticateToken, authController.logoutAll);

router.post("/forgot-password", validateEmail, authController.forgotPassword);

router.post(
  "/reset-password",
  validatePasswordReset,
  authController.resetPassword
);

module.exports = router;
