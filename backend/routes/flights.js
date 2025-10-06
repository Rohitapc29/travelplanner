const express = require('express');
const router = express.Router();


const generateEnhancedFlights = (origin, destination, date, travelClass, airline) => {
  const flights = [
    {
      id: "mock-1",
      airline: airline || "AI",
      airlineName: "Air India",
      flightNumber: "AI 131",
      departure: {
        iataCode: origin,
        time: "08:00",
        date: date,
        terminal: "3",
        gate: "A12"
      },
      arrival: {
        iataCode: destination,
        time: "10:30",
        date: date,
        terminal: "1",
        gate: "B7"
      },
      duration: "2h 30m",
      stops: 0,
      aircraft: {
        type: "Boeing 737-800",
        totalSeats: 162,
        configuration: "3-3"
      },
      basePrice: "5000",
      inflatedPrice: (5000 * 1.12).toFixed(2),
      currency: "INR",
      cabinClass: travelClass || "ECONOMY",
      baggage: {
        included: "15kg",
        options: [
          { weight: "25kg", price: "1500" },
          { weight: "35kg", price: "2500" }
        ]
      },
      fareType: "PUBLISHED",
      amenities: ["Meal", "WiFi", "Entertainment"],
      seatMap: generateSeatMap("Boeing 737-800"),
      mealOptions: [
        { type: "Vegetarian", price: "0", included: true },
        { type: "Non-Vegetarian", price: "0", included: true },
        { type: "Special Dietary", price: "500", included: false }
      ]
    },
    {
      id: "mock-2",
      airline: airline || "6E",
      airlineName: "IndiGo",
      flightNumber: "6E 2131",
      departure: {
        iataCode: origin,
        time: "12:00",
        date: date,
        terminal: "2",
        gate: "C15"
      },
      arrival: {
        iataCode: destination,
        time: "14:45",
        date: date,
        terminal: "1",
        gate: "A3"
      },
      duration: "2h 45m",
      stops: 0,
      aircraft: {
        type: "Airbus A320",
        totalSeats: 150,
        configuration: "3-3"
      },
      basePrice: "6500",
      inflatedPrice: (6500 * 1.12).toFixed(2),
      currency: "INR",
      cabinClass: travelClass || "ECONOMY",
      baggage: {
        included: "15kg",
        options: [
          { weight: "25kg", price: "1200" },
          { weight: "35kg", price: "2000" }
        ]
      },
      fareType: "PUBLISHED",
      amenities: ["Snacks", "WiFi"],
      seatMap: generateSeatMap("Airbus A320"),
      mealOptions: [
        { type: "Buy on Board", price: "300", included: false }
      ]
    }
  ];
  return flights;
};

// Generate seat map
const generateSeatMap = (aircraftType) => {
  const seatMap = {
    aircraft: aircraftType,
    rows: [],
    legend: {
      available: "Available",
      occupied: "Occupied", 
      premium: "Premium (Extra legroom)",
      blocked: "Not available"
    }
  };

  const totalRows = aircraftType === "Boeing 737-800" ? 27 : 25;
  
  for (let row = 1; row <= totalRows; row++) {
    const rowData = {
      number: row,
      seats: []
    };

    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(letter => {
      const seatNumber = `${row}${letter}`;
      const isOccupied = Math.random() < 0.3; // 30% occupied
      const isPremium = row <= 5; // First 5 rows premium
      
      rowData.seats.push({
        number: seatNumber,
        type: letter === 'A' || letter === 'F' ? 'window' : 
              letter === 'C' || letter === 'D' ? 'aisle' : 'middle',
        status: isOccupied ? 'occupied' : 'available',
        premium: isPremium,
        price: isPremium ? "1000" : "500"
      });
    });

    seatMap.rows.push(rowData);
  }

  return seatMap;
};

router.get('/search', (req, res) => {
  console.log("Enhanced flight search called with:", req.query);
  const { origin, destination, date, adults = 1, travelClass, airline } = req.query;

  if (!origin || !destination || !date) {
    return res.status(400).json({ error: "origin, destination and date are required" });
  }

  try {
    const enhancedFlights = generateEnhancedFlights(origin, destination, date, travelClass, airline);
    console.log(`Returned ${enhancedFlights.length} enhanced flights with seat maps`);
    res.json(enhancedFlights);
  } catch (err) {
    console.error("Flight search error:", err);
    res.status(500).json({ error: "Flight search failed" });
  }
});

router.get('/:flightId/seatmap', (req, res) => {
  const { flightId } = req.params;
  
  const mockSeatMap = generateSeatMap("Boeing 737-800");
  
  res.json({
    flightId,
    seatMap: mockSeatMap,
    pricing: {
      standard: "500",
      premium: "1000",
      emergency: "1500"
    }
  });
});

module.exports = router;