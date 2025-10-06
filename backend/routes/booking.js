const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const bookings = new Map();

const generatePNR = () => {
  return 'TP' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

router.post('/create', (req, res) => {
  try {
    const { flightOffer, passengers, contactInfo } = req.body;
    
    
    if (!flightOffer || !passengers || !contactInfo) {
      return res.status(400).json({ 
        error: "Missing required booking data: flightOffer, passengers, and contactInfo are required" 
      });
    }

    if (!Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ 
        error: "At least one passenger is required" 
      });
    }

    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      if (!passenger.firstName || !passenger.lastName || !passenger.email) {
        return res.status(400).json({ 
          error: `Passenger ${i + 1}: firstName, lastName, and email are required` 
        });
      }
    }

    if (!contactInfo.email) {
      return res.status(400).json({ 
        error: "Contact email is required" 
      });
    }

    const bookingReference = generatePNR();
    const booking = {
      pnr: bookingReference,
      status: "PENDING_PAYMENT", // Changed from CONFIRMED
      bookingDate: new Date().toISOString(),
      flight: flightOffer,
      passengers: passengers,
      contact: contactInfo,
      totalPrice: flightOffer.inflatedPrice,
      currency: "INR",
      paymentStatus: "PENDING"
    };

 
    bookings.set(bookingReference, booking);
    console.log(`Booking created with PNR: ${bookingReference} - Awaiting Payment`);
    
    res.json({
      success: true,
      booking: booking,
      message: "Booking created successfully! Please proceed to payment."
    });
    
  } catch (error) {
    console.error("Booking error:", error.message);
    res.status(500).json({ error: "Booking failed" });
  }
});

router.get('/:pnr', (req, res) => {
  const { pnr } = req.params;
  const booking = bookings.get(pnr);
  
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  
  res.json(booking);
});


router.get('/lookup/:pnr', (req, res) => {
  const { pnr } = req.params;
  const booking = bookings.get(pnr);
  
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  
  res.json(booking);
});

router.post('/payment/create-session', async (req, res) => {
  try {
    const { airline, inflatedPrice, departure, arrival, pnr, passengerName } = req.body;
    
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Flight Booking - ${airline}`,
              description: `${departure} → ${arrival} | PNR: ${pnr} | Passenger: ${passengerName}`,
              metadata: {
                pnr: pnr || 'N/A',
                passenger: passengerName || 'N/A',
                flight_route: `${departure} → ${arrival}`
              }
            },
            unit_amount: Math.round(Number(inflatedPrice) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}&pnr=${pnr}`,
      cancel_url: `http://localhost:5173/flights?cancelled=true&pnr=${pnr}`,
      metadata: {
        pnr: pnr || 'N/A',
        booking_type: 'flight',
        passenger_name: passengerName || 'N/A'
      }
    });

    if (pnr && bookings.has(pnr)) {
      const booking = bookings.get(pnr);
      booking.paymentSessionId = session.id;
      booking.paymentStatus = "PROCESSING";
      booking.paymentUrl = session.url;
      bookings.set(pnr, booking);
      console.log(`💳 Payment session created for PNR: ${pnr}`);
    }

    res.json({ 
      url: session.url,
      sessionId: session.id 
    });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ 
      error: "Payment session failed",
      details: error.message 
    });
  }
});

router.post('/payment/success', (req, res) => {
  const { pnr, sessionId } = req.body;
  
  if (pnr && bookings.has(pnr)) {
    const booking = bookings.get(pnr);
    booking.status = "CONFIRMED";
    booking.paymentStatus = "COMPLETED";
    booking.paymentDate = new Date().toISOString();
    booking.confirmationDate = new Date().toISOString();
    if (sessionId) booking.paymentSessionId = sessionId;
    bookings.set(pnr, booking);
    
    console.log(`✅ Payment completed and booking confirmed for PNR: ${pnr}`);
  }
  
  res.json({ success: true, message: "Payment confirmed and booking finalized!" });
});

router.post('/payment/cancel', (req, res) => {
  const { pnr } = req.body;
  
  if (pnr && bookings.has(pnr)) {
    const booking = bookings.get(pnr);
    booking.paymentStatus = "CANCELLED";
    bookings.set(pnr, booking);
    
    console.log(`❌ Payment cancelled for PNR: ${pnr}`);
  }
  
  res.json({ success: true, message: "Payment cancelled" });
});

module.exports = router;