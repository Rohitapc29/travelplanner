// index.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const Stripe = require("stripe");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // from .env

let amadeusToken = null;
let tokenExpiry = 0;

// --- Get Amadeus Token ---
async function getAmadeusToken() {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET not configured");
  }

  if (amadeusToken && Date.now() < tokenExpiry) return amadeusToken;

  const response = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  amadeusToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;
  console.log("✅ Amadeus token fetched");
  return amadeusToken;
}

// --- Flights Route ---
app.get("/api/flights", async (req, res) => {
  console.log("DEBUG /api/flights called with:", req.query);
  const { origin, destination, date, adults = 1, travelClass, airline } = req.query;

  if (!origin || !destination || !date)
    return res.status(400).json({ error: "origin, destination and date are required" });

  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  // Fallback mock data if no credentials
  if (!clientId || !clientSecret) {
    console.warn("AMADEUS_CLIENT_* not set — returning mock flights");
    const mock = [
      {
        id: "mock-1",
        airline: airline || "AI",
        departure: `${origin} - 2025-10-10T08:00:00`,
        arrival: `${destination} - 2025-10-10T10:30:00`,
        duration: "PT2H30M",
        basePrice: "5000",
        inflatedPrice: (5000 * 1.12).toFixed(2),
      },
      {
        id: "mock-2",
        airline: airline || "6E",
        departure: `${origin} - 2025-10-10T12:00:00`,
        arrival: `${destination} - 2025-10-10T14:45:00`,
        duration: "PT2H45M",
        basePrice: "6500",
        inflatedPrice: (6500 * 1.12).toFixed(2),
      },
    ];
    return res.json(mock);
  }

  // Real Amadeus call
  try {
    const token = await getAmadeusToken();
    const params = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      adults,
      travelClass: travelClass || "ECONOMY",
      max: 20,
    };
    if (airline) params.includedAirlineCodes = airline;

    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      { headers: { Authorization: `Bearer ${token}` }, params }
    );

    const USD_TO_INR = 83;
    const offers = response.data.data.map((flight) => ({
      id: flight.id,
      airline:
        flight.validatingAirlineCodes?.[0] ||
        flight.itineraries[0].segments[0].carrierCode,
      departure:
        flight.itineraries[0].segments[0].departure.iataCode +
        " - " +
        flight.itineraries[0].segments[0].departure.at,
      arrival:
        flight.itineraries[0].segments.slice(-1)[0].arrival.iataCode +
        " - " +
        flight.itineraries[0].segments.slice(-1)[0].arrival.at,
      duration: flight.itineraries[0].duration,
      basePrice: flight.price.total,
      inflatedPrice: (Number(flight.price.total) * 1.12 * USD_TO_INR).toFixed(2),
    }));

    console.log(`✅ Returned ${offers.length} flights`);
    res.json(offers);
  } catch (err) {
    console.error("Flight search error:", err.response?.data || err.message);
    res.status(500).json({ error: "Flight search failed" });
  }
});

// --- Stripe Checkout ---
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { airline, inflatedPrice, departure, arrival } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Flight ${airline}: ${departure} → ${arrival}`,
            },
            unit_amount: Math.round(Number(inflatedPrice) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: "Payment session failed" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
