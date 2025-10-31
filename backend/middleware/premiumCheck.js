const User = require('../models/User');

const requirePremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const isValidPremium = user.isPremium && 
      (!user.premiumExpiryDate || new Date() < user.premiumExpiryDate);
    
    if (!isValidPremium) {
      return res.status(403).json({ 
        error: 'Premium subscription required',
        upgradeRequired: true 
      });
    }
    
    next();
  } catch (error) {
    console.error('Premium check error:', error);
    res.status(500).json({ error: 'Premium verification failed' });
  }
};

module.exports = { requirePremium };