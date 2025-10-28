const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');

// Handle successful payments
router.post('/success', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      // Update payment status
      await Payment.findOneAndUpdate(
        { 'metadata.stripeSessionId': sessionId },
        { 
          status: 'completed',
          customerEmail: session.customer_details?.email,
          customerPhone: session.customer_details?.phone
        }
      );
      
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Payment success handler error:', error);
    res.status(500).json({ error: 'Failed to process payment success' });
  }
});

router.post('/create-session', async (req, res) => {
  try {
    console.log("Payment request received:", req.body);
    

    const { 
      airline, 
      inflatedPrice, 
      departure, 
      arrival, 
      pnr,
      passengerName,
      bookingId  
    } = req.body;
   
    if (!inflatedPrice) {
      return res.status(400).json({ error: 'Missing price information' });
    }
    
    const amount = parseFloat(String(inflatedPrice).replace(/,/g, ''));
    
    if (isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid price format' });
    }
    
    console.log(`Creating payment for ${amount} INR`);
    
    const flightInfo = airline ? 
      `Flight ${airline}` : 
      'Flight booking';
    
    const routeInfo = (departure && arrival) ? 
      `${departure} to ${arrival}` : 
      'Flight route';
    
    const bookingRef = pnr ? 
      `PNR: ${pnr}` : 
      '';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: flightInfo,
            description: `${routeInfo} | ${bookingRef}`.trim(),
          },
          unit_amount: Math.round(amount * 100), // Convert to paise
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?pnr=${pnr || ''}&status=confirmed&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/flights`,
      metadata: {
        type: 'flight_booking',
        airline,
        departure,
        arrival,
        pnr,
        passengerName
      }
    });

    // Save payment details - setting status as completed since it's a dummy payment
    const payment = new Payment({
      paymentId: session.id,
      type: 'flight',
      amount: amount,
      pnr: pnr,
      airline: airline,
      departure: departure,
      arrival: arrival,
      passengerName: passengerName,
      status: 'completed',  // Changed from 'pending' to 'completed'
      metadata: {
        stripeSessionId: session.id,
        bookingId: bookingId
      }
    });

    await payment.save();

    console.log("Stripe session created and payment recorded successfully");
    res.json({ 
      url: session.url,
      pnr: pnr
    });
  } catch (error) {
    console.error('Stripe payment session error:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
});

module.exports = router;