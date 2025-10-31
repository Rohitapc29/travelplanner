const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authenticate = require('../middleware/auth');
const User = require('../models/User');

router.post('/create-checkout-session', authenticate, async (req, res) => {
  try {
    const { subscriptionType } = req.body;
    
    let priceAmount, productName;
    
    if (subscriptionType === 'monthly') {
      priceAmount = 49900;
      productName = 'TravelMate Premium - Monthly';
    } else if (subscriptionType === 'yearly') {
      priceAmount = 499900;
      productName = 'TravelMate Premium - Yearly';
    } else {
      return res.status(400).json({ error: 'Invalid subscription type' });
    }


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: productName,
            description: 'Unlimited itinerary planning, all destinations, premium features',
          },
          unit_amount: priceAmount,
        },
        quantity: 1,
      }],

      success_url: `${req.headers.origin || 'http://localhost:3000'}/#premium-success?session_id={CHECKOUT_SESSION_ID}&type=${subscriptionType}`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}/#premium?cancelled=true`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user._id.toString(),
        subscriptionType: subscriptionType,
        userEmail: req.user.email,
        productType: 'premium_subscription'
      },
    });

    res.json({ url: session.url });
  } catch (error) {

    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/payment-success', async (req, res) => {
  try {
    const { session_id, subscriptionType, userId } = req.body;
    
    console.log('Processing premium payment success:', { session_id, subscriptionType, userId });
    
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
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
        stripeCustomerId: session.customer || null
      });
      
      console.log(`Premium activated for user ${userId} - ${subscriptionType}`);
      res.json({ success: true, message: 'Premium activated successfully!' });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to activate premium' });
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

module.exports = router;