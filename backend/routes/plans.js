const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const authenticate = require('../middleware/auth');


router.post('/', authenticate, async (req, res) => {
  try {
    const plan = new Plan({
      destination: req.body.destination,
      numDays: req.body.numDays,
      schedule: req.body.schedule,
      thumbnail: req.body.thumbnail,
      userId: req.user._id 
    });
    
    const savedPlan = await plan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/', authenticate, async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.user._id })
                          .sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;