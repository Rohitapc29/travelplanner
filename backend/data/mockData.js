const airlines = require('./airlines');

const generateEnhancedMockFlights = (origin, destination, date, travelClass, airline) => {
  const baseFlights = [
    {
      airline: airline || "AI",
      departureTime: "08:00",
      arrivalTime: "10:30",
      duration: "2h 30m",
      basePrice: 5000,
      aircraft: "Boeing 737-800",
      terminal: { departure: "3", arrival: "1" },
      stops: 0
    },
    {
      airline: airline || "6E",
      departureTime: "12:00", 
      arrivalTime: "14:45",
      duration: "2h 45m",
      basePrice: 6500,
      aircraft: "Airbus A320",
      terminal: { departure: "2", arrival: "1" },
      stops: 0
    },
    {
      airline: airline || "SG",
      departureTime: "15:30",
      arrivalTime: "18:15",
      duration: "2h 45m", 
      basePrice: 4800,
      aircraft: "Boeing 737-900",
      terminal: { departure: "1", arrival: "2" },
      stops: 0
    },
    {
      airline: airline || "UK",
      departureTime: "19:00",
      arrivalTime: "21:45",
      duration: "2h 45m",
      basePrice: 7200,
      aircraft: "Airbus A321",
      terminal: { departure: "3", arrival: "1" },
      stops: 0
    }
  ];

  return baseFlights.map((flight, index) => ({
    id: `mock-${index + 1}`,
    originalOffer: null,
    airline: flight.airline,
    airlineName: airlines.getAirlineName(flight.airline),
    departure: {
      iataCode: origin,
      time: flight.departureTime,
      date: date,
      terminal: flight.terminal.departure
    },
    arrival: {
      iataCode: destination,
      time: flight.arrivalTime,
      date: date,
      terminal: flight.terminal.arrival
    },
    duration: flight.duration,
    stops: flight.stops,
    aircraft: flight.aircraft,
    basePrice: flight.basePrice.toString(),
    inflatedPrice: (flight.basePrice * 1.12).toFixed(2),
    currency: "INR",
    cabinClass: travelClass || "ECONOMY",
    baggage: getBaggageAllowance(flight.airline, travelClass),
    fareType: "PUBLISHED",
    amenities: getAmenities(flight.airline, travelClass),
    mealService: getMealService(flight.departureTime),
    seatCount: getSeatCount(flight.aircraft)
  }));
};

const getBaggageAllowance = (airline, travelClass) => {
  const allowances = {
    'ECONOMY': '15kg',
    'BUSINESS': '25kg', 
    'FIRST': '35kg'
  };
  return allowances[travelClass] || '15kg';
};

const getAmenities = (airline, travelClass) => {
  const baseAmenities = ['In-flight entertainment', 'Meal service'];
  
  if (travelClass === 'BUSINESS') {
    baseAmenities.push('Priority boarding', 'Lounge access');
  }
  
  if (travelClass === 'FIRST') {
    baseAmenities.push('Priority boarding', 'Lounge access', 'Lie-flat seats');
  }
  
  return baseAmenities;
};

const getMealService = (departureTime) => {
  const hour = parseInt(departureTime.split(':')[0]);
  
  if (hour >= 6 && hour < 11) return 'Breakfast';
  if (hour >= 11 && hour < 16) return 'Lunch';
  if (hour >= 16 && hour < 21) return 'Dinner';
  return 'Snacks';
};

const getSeatCount = (aircraft) => {
  const seatCounts = {
    'Boeing 737-800': '162 seats',
    'Airbus A320': '150 seats',
    'Boeing 737-900': '177 seats',
    'Airbus A321': '185 seats'
  };
  return seatCounts[aircraft] || '150 seats';
};

module.exports = {
  generateEnhancedMockFlights,
  getBaggageAllowance,
  getAmenities,
  getMealService,
  getSeatCount
};