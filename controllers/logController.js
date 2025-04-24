// controllers/doorController.js
const Log = require("../models/Log");

exports.logDoorAction = async (req, res) => {
  const { doorId, action } = req.body;
  const userId = req.user._id; // coming from authentication middleware

  try {
    const newLog = await Log.create({
      user: userId,
      doorId,
      action
    });
    res.status(201).json({ message: "Log created", log: newLog });
  } catch (err) {
    console.error("Error saving log:", err);
    res.status(500).json({ error: "Could not save log" });
  }
};