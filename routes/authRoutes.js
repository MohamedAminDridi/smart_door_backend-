const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware"); // ✅ Import middleware

// ✅ User Registration (Admin Only)
router.post("/register", authenticateToken, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Ensure only admins can register users
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can register users" });
    }

    if (!["admin", "client"].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "admin" or "client".' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const newUser = new User({ username, password, role });
    await newUser.save();

    console.log("✅ User registered:", newUser);
    res.json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ✅ User Login (POST /api/auth/login)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "default_secret", // Fallback in case .env is missing
      { expiresIn: "1h" });
    console.log("✅ Generated Token:", token); // Debugging step

    console.log("✅ User logged in:", username);
    res.json({
      message: "Login successful", token,
      user: { _id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ✅ Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "username _id"); // Fetch users
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
