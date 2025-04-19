// controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res) => {
  console.log("🔍 Received request body:", req.body); // Log request body for debugging

  if (!req.body || Object.keys(req.body).length === 0) {
    console.log("⚠️ Error: Request body is empty!");
    return res.status(400).json({ message: "Request body is empty!" });
  }

  const { username, password, role } = req.body;

  if (!username || !role|| !password) {
    console.log("⚠️ Error: Missing required fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ user });
    if (existingUser) {
      console.log("⚠️ Error: User already exists with email:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
    
    // Create a new user
    const newUser = new User({
      username,
      
      password: hashedPassword,
      role
    });

    // Save the new user to the database
    await newUser.save();
    console.log("✅ User registered successfully:", newUser);

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const loginUser = async (req, res) => {
  console.log("🔍 Login request received:", req.body); // Log request body for debugging

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("⚠️ Error: Email and password are required");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log("⚠️ Error: User not found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("⚠️ Error: Incorrect password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ Login successful for user:", user.email);
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { registerUser, loginUser };
