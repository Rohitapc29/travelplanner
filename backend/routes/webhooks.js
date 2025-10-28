const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');

// Webhook handler for Stripe events
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  let event;
  
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle specific events
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Update payment status to completed
        await Payment.findOneAndUpdate(
          { 'metadata.stripeSessionId': session.id },
          { 
            status: 'completed',
            customerEmail: session.customer_details?.email,
            customerPhone: session.customer_details?.phone
          }
        );
        
        console.log('Payment updated to completed:', session.id);
        break;

      case 'checkout.session.expired':
        // Update payment status to failed if session expires
        await Payment.findOneAndUpdate(
          { 'metadata.stripeSessionId': session.id },
          { status: 'failed' }
        );
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error handling webhook event:', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

module.exports = router;