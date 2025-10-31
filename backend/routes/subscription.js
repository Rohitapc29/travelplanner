const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authenticate = require('../middleware/auth');
const User = require('../models/User');

router.post('/create-checkout-session', authenticate, async (req, res) => {
  try {
    const { subscriptionType } = req.body; // 'monthly' or 'yearly'
    
    let priceAmount, interval, productName;
    
    if (subscriptionType === 'monthly') {
      priceAmount = 49900; // ₹499 in paise
      interval = 'month';
      productName = 'TravelMate Premium - Monthly';
    } else if (subscriptionType === 'yearly') {
      priceAmount = 499900; // ₹4999 in paise  
      interval = 'year';
      productName = 'TravelMate Premium - Yearly';
    } else {
      return res.status(400).json({ error: 'Invalid subscription type' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: productName,
            description: 'Unlimited itinerary planning, all destinations, premium features',
          },
          unit_amount: priceAmount,
          recurring: {
            interval: interval,
          },
        },
        quantity: 1,
      }],
      success_url: `${req.headers.origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/premium`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user._id.toString(),
        subscriptionType: subscriptionType,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.get('/status', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const isValidPremium = user.isPremium && 
      (!user.premiumExpiryDate || new Date() < user.premiumExpiryDate);
    
    res.json({
      isPremium: isValidPremium,
      subscriptionType: user.subscriptionType,
      expiryDate: user.premiumExpiryDate,
    });
  } catch (error) {
    console.error('Error fetching premium status:', error);
    res.status(500).json({ error: 'Failed to fetch premium status' });
  }
});

router.post('/activate-premium', async (req, res) => {
  try {
    const { userId, subscriptionType } = req.body;
    
    let expiryDate = new Date();
    if (subscriptionType === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (subscriptionType === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }
    
    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumExpiryDate: expiryDate,
      subscriptionType: subscriptionType,
    });
    
    console.log(`Premium activated for user ${userId} - ${subscriptionType}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error activating premium:', error);
    res.status(500).json({ error: 'Failed to activate premium' });
  }
});

module.exports = router;