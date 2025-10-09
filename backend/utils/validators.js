const validateFlightSearch = (req, res, next) => {
  const { origin, destination, date } = req.query;
  
  if (!origin || !destination || !date) {
    return res.status(400).json({ 
      error: "Missing required parameters: origin, destination, and date are required" 
    });
  }

  if (origin.length !== 3 || destination.length !== 3) {
    return res.status(400).json({ 
      error: "Origin and destination must be 3-letter IATA codes" 
    });
  }

  const searchDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (searchDate < today) {
    return res.status(400).json({ 
      error: "Search date cannot be in the past" 
    });
  }

  next();
};

const validateBookingData = (req, res, next) => {
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

    if (!isValidEmail(passenger.email)) {
      return res.status(400).json({ 
        error: `Passenger ${i + 1}: Invalid email format` 
      });
    }
  }

  if (!contactInfo.email || !contactInfo.phone) {
    return res.status(400).json({ 
      error: "Contact email and phone are required" 
    });
  }

  next();
};

const validateAirportSearch = (req, res, next) => {
  const { keyword } = req.query;
  
  if (!keyword || keyword.length < 2) {
    return res.status(400).json({ 
      error: "Keyword must be at least 2 characters long" 
    });
  }

  next();
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateFlightSearch,
  validateBookingData,
  validateAirportSearch,
  isValidEmail
};