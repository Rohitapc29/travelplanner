const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const authenticate = require('../middleware/auth');

// Get all payments (admin only)
router.get('/all', authenticate, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const payments = await Payment.find().sort({ timestamp: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get payments by type (admin only)
router.get('/by-type/:type', authenticate, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { type } = req.params;
    if (!['flight', 'hotel'].includes(type)) {
      return res.status(400).json({ error: 'Invalid payment type' });
    }

    const payments = await Payment.find({ type }).sort({ timestamp: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports = router;