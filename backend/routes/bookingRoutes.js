const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const authenticate = require('../middleware/auth');

const emailAuth = async (req, res, next) => {
  try {
    const userEmail = req.headers['user-email'];
    
    if (!userEmail) {
      return res.status(401).json({ success: false, message: 'No user email provided' });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Email auth error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
};
const flexibleAuth = async (req, res, next) => {
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  

  return emailAuth(req, res, next);
};


router.get('/my-bookings', flexibleAuth, async (req, res) => {
  try {
    console.log(`Fetching bookings for user: ${req.user.email} (ID: ${req.user._id})`);
    
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${bookings.length} bookings for user: ${req.user.email}`);
    
    res.json({
      success: true,
      bookings: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch bookings' 
    });
  }
});

module.exports = router;