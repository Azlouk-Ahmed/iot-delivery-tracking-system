const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUser,
  deleteUser,
  listUsers,
} = require("../controllers/user");
const { authenticateToken } = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/verifyRoles");
const ALLOWED_ROLES = require("../config/roles-list");

router.post("/", authenticateToken, authorizeRoles([ALLOWED_ROLES.SUPER_ADMIN,ALLOWED_ROLES.ADMIN]), createUser);
router.put("/:id", authenticateToken, authorizeRoles([ALLOWED_ROLES.SUPER_ADMIN,ALLOWED_ROLES.ADMIN]), updateUser);
// router.delete("/:id", authenticateToken, requireRole("admin", "super_admin"), deleteUser);
// router.get("/", authenticateToken, requireRole("admin", "super_admin"), listUsers);

module.exports = router;
