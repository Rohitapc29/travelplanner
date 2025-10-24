const airlineData = {
  'AI': { name: 'Air India', logo: 'ai-logo.png' },
  '6E': { name: 'IndiGo', logo: 'indigo-logo.png' },
  'SG': { name: 'SpiceJet', logo: 'spicejet-logo.png' },
  'UK': { name: 'Vistara', logo: 'vistara-logo.png' },
  'G8': { name: 'Go First', logo: 'gofirst-logo.png' },
  '9W': { name: 'Jet Airways', logo: 'jet-logo.png' },
  'AA': { name: 'American Airlines', logo: 'aa-logo.png' },
  'BA': { name: 'British Airways', logo: 'ba-logo.png' },
  'EK': { name: 'Emirates', logo: 'emirates-logo.png' },
  'QR': { name: 'Qatar Airways', logo: 'qatar-logo.png' },
  'LH': { name: 'Lufthansa', logo: 'lufthansa-logo.png' },
  'AF': { name: 'Air France', logo: 'airfrance-logo.png' },
  'KL': { name: 'KLM', logo: 'klm-logo.png' },
  'TK': { name: 'Turkish Airlines', logo: 'turkish-logo.png' },
  'SQ': { name: 'Singapore Airlines', logo: 'singapore-logo.png' }
};

const getAirlineName = (code) => {
  return airlineData[code]?.name || code;
};

const getAirlineLogo = (code) => {
  return airlineData[code]?.logo || 'default-airline.png';
};

const getAllAirlines = () => {
  return airlineData;
};

module.exports = {
  getAirlineName,
  getAirlineLogo,
  getAllAirlines,
  airlineData
};