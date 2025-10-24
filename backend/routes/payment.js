const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
      success_url: `${req.headers.origin}/success?pnr=${pnr || ''}&status=confirmed`,
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

    console.log("Stripe session created successfully");
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