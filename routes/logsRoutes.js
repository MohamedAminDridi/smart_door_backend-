const express = require('express');
const router = express.Router();
const Log = require('../models/logs'); // Assuming your log model is in models/logModel.js
const User = require('../models/User'); // Assuming you have a user model for authorization

// Middleware to verify if the user is admin or a regular user
function verifyAdmin(req, res, next) {
  const userId = req.user.id; // This assumes that you set the user ID in the request object after authentication

  User.findById(userId).then(user => {
    if (user && user.role === 'admin') {
      next(); // Proceed if the user is an admin
    } else {
      res.status(403).json({ message: 'Permission denied. Admins only.' });
    }
  }).catch(err => res.status(500).json({ message: 'Error checking user role' }));
}

// Get all logs (for admins)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const logs = await Log.find()
      .populate('user', 'name email') // Populate user details
      .populate('doorId', 'name');   // Populate door details
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get logs for a specific user's owned doors (for regular users)
router.get('/logs/user', async (req, res) => {
  const userId = req.user.id; // This assumes you have the user ID in the request object after authentication
  
  try {
    // Find the user's owned doors
    const userLogs = await Log.find({ user: userId })
      .populate('user', 'name email')
      .populate('doorId', 'name');
    
    res.json(userLogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;