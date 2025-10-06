const airlines = require('../data/airlines');

const formatDuration = (isoDuration) => {
  if (!isoDuration) return 'N/A';
  
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?/);
  let result = '';
  if (match && match[1]) result += match[1].replace('H', 'h ');
  if (match && match[2]) result += match[2].replace('M', 'm');
  return result.trim() || 'N/A';
};

const formatTime = (datetime) => {
  if (!datetime) return 'N/A';
  return datetime.split('T')[1]?.substr(0, 5) || 'N/A';
};

const formatDate = (datetime) => {
  if (!datetime) return 'N/A';
  return datetime.split('T')[0] || 'N/A';
};

const generatePNR = () => {
  return 'TP' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

const convertToINR = (usdAmount, rate = 83) => {
  return (Number(usdAmount) * rate).toFixed(2);
};

const addCommission = (amount, rate = 1.12) => {
  return (Number(amount) * rate).toFixed(2);
};

const transformFlightData = (flight, USD_TO_INR = 83) => {
  const segment = flight.itineraries[0].segments[0];
  const lastSegment = flight.itineraries[0].segments.slice(-1)[0];
  
  return {
    id: flight.id,
    originalOffer: flight,
    airline: segment.carrierCode,
    airlineName: airlines.getAirlineName(segment.carrierCode),
    departure: {
      iataCode: segment.departure.iataCode,
      time: formatTime(segment.departure.at),
      date: formatDate(segment.departure.at),
      terminal: segment.departure.terminal || "N/A"
    },
    arrival: {
      iataCode: lastSegment.arrival.iataCode,
      time: formatTime(lastSegment.arrival.at),
      date: formatDate(lastSegment.arrival.at),
      terminal: lastSegment.arrival.terminal || "N/A"
    },
    duration: formatDuration(flight.itineraries[0].duration),
    stops: flight.itineraries[0].segments.length - 1,
    aircraft: segment.aircraft?.code || "Unknown",
    basePrice: flight.price.total,
    inflatedPrice: addCommission(convertToINR(flight.price.total, USD_TO_INR)),
    currency: "INR",
    cabinClass: flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || "ECONOMY",
    baggage: flight.travelerPricings[0]?.fareDetailsBySegment[0]?.includedCheckedBags?.quantity + "kg" || "15kg",
    fareType: flight.travelerPricings[0]?.fareDetailsBySegment[0]?.fareBasis || "PUBLISHED"
  };
};

module.exports = {
  formatDuration,
  formatTime,
  formatDate,
  generatePNR,
  convertToINR,
  addCommission,
  transformFlightData
};