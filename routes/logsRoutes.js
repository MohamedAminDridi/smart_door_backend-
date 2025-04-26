const express = require('express');
const router = express.Router();
const Log = require('../models/logs'); // Assuming your log model is in models/logModel.js
const User = require('../models/User'); // Assuming you have a user model for authorization

// Middleware to verify if the user is admin or a regular user
function verifyAdmin(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const userId = req.user.id; // Assuming you set the user ID in the request object after authentication

  User.findById(userId).then(user => {
    if (user && user.role === 'admin') {
      next(); // Proceed if the user is an admin
    } else {
      res.status(403).json({ message: 'Permission denied. Admins only.' });
    }
  }).catch(err => {
    console.error('Error verifying admin:', err);
    res.status(500).json({ message: 'Error checking user role' });
  });
}

// Get all logs (for admins)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const logs = await Log.find()
      .populate({ path: 'user', select: 'username', strictPopulate: false })
      .populate({ path: 'doorId', select: 'name', strictPopulate: false })
      .lean(); // optional, faster

    res.status(200).json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err); // 👉 Show full error in console
    res.status(500).json({
      message: 'Server error while fetching logs.',
      error: err.message // 👉 Send readable error to frontend
    });
  }
});

// Get logs for a specific user's owned doors (for regular users)
router.get('/logs/user', async (req, res) => {
  const userId = req.user?.id; // Safely access user ID in case it's not defined
  
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Find the user's logs for their owned doors
    const userLogs = await Log.find({ user: userId })
      .populate('user', 'name email') // Include relevant user data
      .populate('doorId', 'name'); // Include relevant door data
    
    res.status(200).json(userLogs);
  } catch (err) {
    console.error('Error fetching user logs:', err); // Log errors for debugging
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
