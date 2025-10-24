const amadeus = require('../config/amadeus');

async function searchHotels(cityCode, checkInDate, checkOutDate, adults = 1) {
  try {
    console.log(`Searching hotels in ${cityCode} from ${checkInDate} to ${checkOutDate} for ${adults} adults`);
    
    const response = await amadeus.shopping.hotelOffers.get({
      cityCode: cityCode,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      adults: adults,
      radius: 50,
      radiusUnit: 'KM',
      paymentPolicy: 'NONE',
      includeClosed: false,
      bestRateOnly: true,
      view: 'FULL'
    });
    
    if (response.data && response.data.length > 0) {
      console.log(`Found ${response.data.length} hotels from Amadeus API`);
      return response.data;
    }
    
    console.log('No hotels found from Amadeus API, using mock data');
    return [];
  } catch (error) {
    console.error('Amadeus API error:', error);
    return [];
  }
}

module.exports = {
  searchHotels
};

const amadeusService = require('../../services/amadeusService');

router.get('/search', async (req, res) => {
  try {
    const { location, checkIn, checkOut, guests } = req.query;
    
    console.log('Hotel search request:', { location, checkIn, checkOut, guests });
    
    
    const cityCode = getCityCode(location); 
    const realHotels = await amadeusService.searchHotels(cityCode, checkIn, checkOut, guests);
    
    if (realHotels && realHotels.length > 0) {
      console.log('Using real hotel data from Amadeus');
      return res.json(realHotels);
    }

    console.log('Falling back to mock data generation');
    const hotelPromises = generateHotels(location, checkIn, checkOut, guests);
    const hotels = await Promise.all(hotelPromises);
    
    console.log('Successfully generated mock hotels:', hotels.length);
    res.json(hotels);
  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


function getCityCode(cityName) {
  const cityMap = {
    'Mumbai': 'BOM',
    'Delhi': 'DEL',
    'Bangalore': 'BLR',
    'Chennai': 'MAA',
    'Hyderabad': 'HYD',
    'Kolkata': 'CCU',
    'Goa': 'GOI'
  };
  
  return cityMap[cityName] || 'BOM'; 
}


{hotel.weather && Array.isArray(hotel.weather) && hotel.weather.length > 0 && (
  <div style={{
    backgroundColor: '#e0f2fe',
    border: '2px solid #0284c7',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '30px'
  }}>
    <h4 style={{
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '15px',
      color: '#0369a1'
    }}>
      🌤️ Weather Forecast
    </h4>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px'
    }}>
      {hotel.weather.slice(0, 5).map((day, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}
        >
          <p style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#0369a1'
          }}>
            {day.date}
          </p>
          <p style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: '5px 0',
            color: '#333'
          }}>
            {typeof day.temp === 'number' ? Math.round(day.temp) : 'N/A'}°C
          </p>
          <p style={{
            fontSize: '12px',
            color: '#666',
            textTransform: 'capitalize'
          }}>
            {day.description || 'No data'}
          </p>
        </div>
      ))}
    </div>
  </div>
)}