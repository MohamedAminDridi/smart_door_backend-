const express = require('express');
const router = express.Router();
const Log = require('../models/logs');

// Create a new log
router.post('/', async (req, res) => {
  try {
    const { user, doorId, action } = req.body;

    const newLog = new Log({ user, doorId, action });
    await newLog.save();

    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ message: 'Failed to create log' });
  }
});

// Optional: Get all logs
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find()
      .populate('user', 'username')
      .populate('doorId', 'name');
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error getting logs:', error);
    res.status(500).json({ message: 'Failed to get logs' });
  }
});

module.exports = router;  // ✅ correct export