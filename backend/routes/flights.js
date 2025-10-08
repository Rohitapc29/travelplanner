const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getAmadeusToken } = require('../utils/amadeus');

const transformAmadeusFlights = (amadeusFlights) => {
  return amadeusFlights.map(flight => {
    
    const segment = flight.itineraries[0].segments[0];
    
    
    const carrierCode = segment.carrierCode;
    
    let airlineName = carrierCode;
    if (flight.dictionaries && flight.dictionaries.carriers) {
      airlineName = flight.dictionaries.carriers[carrierCode] || carrierCode;
    }
    

    const departure = {
      iataCode: segment.departure.iataCode,
      time: segment.departure.at.substring(11, 16), 
      date: segment.departure.at.substring(0, 10), 
      terminal: segment.departure.terminal || "-"
    };
    
    const arrival = {
      iataCode: segment.arrival.iataCode,
      time: segment.arrival.at.substring(11, 16), 
      date: segment.arrival.at.substring(0, 10), 
      terminal: segment.arrival.terminal || "-"
    };
    
   
    const price = flight.price.total;
    const inflatedPrice = (parseFloat(price) * 1.12).toFixed(2);
    
  
    const cabinClass = flight.travelerPricings[0].fareDetailsBySegment[0].cabin;
    
    
    const flightNumber = `${carrierCode} ${segment.number}`;
    
    
    const id = flight.id || `flight-${Math.random().toString(36).substring(2, 10)}`;
    
    return {
      id: id,
      airline: carrierCode,
      airlineName: airlineName,
      flightNumber: flightNumber,
      departure: {
        ...departure,
        gate: `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 30) + 1}`
      },
      arrival: {
        ...arrival,
        gate: `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 30) + 1}`
      },
      duration: formatDuration(segment.duration),
      stops: flight.itineraries[0].segments.length - 1,
      aircraft: {
        type: segment.aircraft?.code || "Boeing 737-800",
        totalSeats: 180,
        configuration: "3-3"
      },
      basePrice: price,
      inflatedPrice: inflatedPrice,
      currency: flight.price.currency,
      cabinClass: cabinClass,
      baggage: {
        included: "15kg",
        options: [
          { weight: "25kg", price: Math.round(parseFloat(price) * 0.2).toString() },
          { weight: "35kg", price: Math.round(parseFloat(price) * 0.35).toString() }
        ]
      },
      fareType: flight.pricingOptions?.fareType || "PUBLISHED",
      amenities: ["WiFi", "Entertainment"],
      seatMap: generateSeatMap(segment.aircraft?.code || "Boeing 737-800"),
      mealOptions: generateMealOptions(carrierCode)
    };
  });
};


const formatDuration = (isoDuration) => {
  let hours = 0;
  let minutes = 0;
  
  const hourMatch = isoDuration.match(/(\d+)H/);
  const minuteMatch = isoDuration.match(/(\d+)M/);
  
  if (hourMatch) hours = parseInt(hourMatch[1]);
  if (minuteMatch) minutes = parseInt(minuteMatch[1]);
  
  return `${hours}h ${minutes}m`;
}

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
}

const generateMealOptions = (airlineCode) => {
  if (['AI', 'UK', '9W', 'EK', 'QR', 'LH', 'BA', 'SQ', 'CX', 'TG'].includes(airlineCode)) {
    return [
      { type: "Vegetarian", price: "0", included: true },
      { type: "Non-Vegetarian", price: "0", included: true },
      { type: "Special Dietary", price: "500", included: false }
    ];
  } 
  else {
    return [
      { type: "Buy on Board", price: "300", included: false }
    ];
  }
}


router.get('/search', async (req, res) => {
  console.log("Flight search called with:", req.query);
  const { origin, destination, date, adults = 1, travelClass, airline } = req.query;

  if (!origin || !destination || !date) {
    return res.status(400).json({ error: "origin, destination and date are required" });
  }

  try {
    
    const token = await getAmadeusToken();
    console.log("Getting real flight data from Amadeus API");
    
    
    const travelClassMap = {
      'ECONOMY': 'ECONOMY',
      'BUSINESS': 'BUSINESS',
      'FIRST': 'FIRST',
      'PREMIUM_ECONOMY': 'PREMIUM_ECONOMY'
    };
    
    const amadeusClass = travelClassMap[travelClass] || 'ECONOMY';
    
  
    const params = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      adults: adults.toString(),
      currencyCode: 'INR',
      max: '250' // Request maximum flights
    };
    
    
    if (travelClass) {
      params.travelClass = amadeusClass;
    }
    
    
    if (airline) {
      params.includedAirlineCodes = airline;
    }
    
    
    const response = await axios.get(
      'https://test.api.amadeus.com/v2/shopping/flight-offers',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: params
      }
    );
    
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      const amadeusFlights = response.data.data;
      console.log(`✅ SUCCESS! Found ${amadeusFlights.length} REAL flights from Amadeus API`);
      
      
      const transformedFlights = transformAmadeusFlights(amadeusFlights);
      console.log(`Transformed ${transformedFlights.length} flights to app format`);
      
      return res.json(transformedFlights);
    } else {
      console.log("No flights found in Amadeus API response");
      throw new Error("No flights found");
    }
  } catch (err) {
    console.error("Amadeus API error:", err.message);
    console.error("Falling back to mock data");
    

    const mockFlights = [];
    
    const airlines = [
      { code: "AI", name: "Air India" },
      { code: "6E", name: "IndiGo" },
      { code: "UK", name: "Vistara" },
      { code: "SG", name: "SpiceJet" },
      { code: "G8", name: "Go First" }
    ];
    
    for (let i = 0; i < 15; i++) {
      const airlineIdx = i % airlines.length;
      const hourOffset = 7 + (i * 1); // Spread flights throughout the day
      
      mockFlights.push({
        id: `mock-${i+1}`,
        airline: airlines[airlineIdx].code,
        airlineName: airlines[airlineIdx].name,
        flightNumber: `${airlines[airlineIdx].code} ${1000 + i}`,
        departure: {
          iataCode: origin,
          time: `${String(hourOffset).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          date: date,
          terminal: ["1", "2", "3"][Math.floor(Math.random() * 3)],
          gate: `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 30) + 1}`
        },
        arrival: {
          iataCode: destination,
          time: `${String(hourOffset + 2).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          date: date,
          terminal: ["1", "2", "3"][Math.floor(Math.random() * 3)],
          gate: `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 30) + 1}`
        },
        duration: "2h 15m",
        stops: 0,
        aircraft: {
          type: "Boeing 737-800",
          totalSeats: 162,
          configuration: "3-3"
        },
        basePrice: String(4500 + Math.floor(Math.random() * 3000)),
        inflatedPrice: String((4500 + Math.floor(Math.random() * 3000)) * 1.12),
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
        amenities: ["WiFi", "Entertainment"],
        seatMap: generateSeatMap("Boeing 737-800"),
        mealOptions: generateMealOptions(airlines[airlineIdx].code)
      });
    }
    
    res.json(mockFlights);
  }
});

module.exports = router;