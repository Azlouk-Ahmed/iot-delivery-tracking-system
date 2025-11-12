// controllers/userController.js
const User = require("../models/user");

// ✅ Create user (any role, but only by admin/super_admin)
const createUser = async (req, res) => {
  try {
    console.log(req.user)
    const { name, email, password, role, photo } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      photo: photo || null,
      role: role || "user",
      isEmailVerified: true,
    });

    res.status(201).json({
      success: true,
      message: `User with role '${user.role}' created successfully.`,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create user.", error: error.message });
  }
};

// ✅ Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, photo, role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (photo) user.photo = photo;
    if (password) user.password = password; // hashed automatically
    if (role) user.role = role; // only admin/superadmin can change role

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update user.", error: error.message });
  }
};

// ✅ Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    await user.deleteOne();

    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user.", error: error.message });
  }
};

// ✅ List all users (optionally filter by role)
const listUsers = async (req, res) => {
  try {
    const { role } = req.query; // e.g. /api/users?role=driver
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users.", error: error.message });
  }
};

module.exports = { createUser, updateUser, deleteUser, listUsers };
