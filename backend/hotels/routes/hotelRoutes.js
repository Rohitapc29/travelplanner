const express = require('express');
const router = express.Router();
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const amadeus = require('../../config/amadeus');
const { getAmadeusToken } = require('../../utils/amadeus');
const Payment = require('../../models/Payment');
const Booking = require('../../models/Booking');
const User = require('../../models/User');


const hotelImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1560200353-ce0a76b1d438?w=800&q=80&auto=format"
];


const generateHotels = (location, checkIn, checkOut, guests) => {
  const hotelData = [
    {
      id: 'HOTEL_001',
      name: `Grand Plaza Hotel ${location}`,
      rating: 4.5,
      basePrice: 8500,
      description: 'Luxurious hotel in the heart of the city with modern amenities, spa facilities, and exceptional service. Experience comfort and elegance in our beautifully appointed rooms.',
      amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness Center', 'Fine Dining Restaurant', 'Fitness Center', '24/7 Room Service', 'Business Center', 'Valet Parking'],
      category: 'luxury',
      address: {
        lines: ['123 Grand Plaza Street'],
        cityName: location,
        countryCode: 'IN'
      }
    },
    {
      id: 'HOTEL_002',
      name: `City Center Business Hotel ${location}`,
      rating: 4.2,
      basePrice: 6500,
      description: 'Perfect for business travelers with state-of-the-art conference facilities, executive lounges, and modern business amenities.',
      amenities: ['Free WiFi', 'Business Center', 'Conference Rooms', 'Executive Lounge', 'Restaurant', 'Bar', 'Fitness Center', 'Airport Shuttle'],
      category: 'business',
      address: {
        lines: ['456 Business District Avenue'],
        cityName: location,
        countryCode: 'IN'
      }
    },
    {
      id: 'HOTEL_003',
      name: `Heritage Palace Hotel ${location}`,
      rating: 4.8,
      basePrice: 12000,
      description: 'Experience royal hospitality in this beautifully restored heritage property. Rich history meets modern luxury in an unforgettable setting.',
      amenities: ['Free WiFi', 'Heritage Tours', 'Royal Restaurant', 'Palace Gardens', 'Spa & Ayurveda', 'Cultural Performances', 'Antique Library'],
      category: 'heritage',
      address: {
        lines: ['789 Heritage Lane'],
        cityName: location,
        countryCode: 'IN'
      }
    },
    {
      id: 'HOTEL_004',
      name: `Budget Comfort Inn ${location}`,
      rating: 3.8,
      basePrice: 3500,
      description: 'Clean, comfortable accommodation at an affordable price. Perfect for budget-conscious travelers without compromising on essential amenities.',
      amenities: ['Free WiFi', 'Restaurant', 'Room Service', '24/7 Front Desk', 'Laundry Service', 'Travel Desk'],
      category: 'budget',
      address: {
        lines: ['321 Budget Street'],
        cityName: location,
        countryCode: 'IN'
      }
    },
    {
      id: 'HOTEL_005',
      name: `Boutique Design Hotel ${location}`,
      rating: 4.4,
      basePrice: 9500,
      description: 'Contemporary design meets personalized service in this stylish boutique hotel. Each room is uniquely designed with modern art and premium amenities.',
      amenities: ['Free WiFi', 'Designer Interiors', 'Rooftop Bar', 'Art Gallery', 'Premium Restaurant', 'Concierge Service', 'Yoga Studio'],
      category: 'boutique',
      address: {
        lines: ['567 Design District'],
        cityName: location,
        countryCode: 'IN'
      }
    },
    {
      id: 'HOTEL_006',
      name: `Eco Resort & Spa ${location}`,
      rating: 4.6,
      basePrice: 11000,
      description: 'Sustainable luxury in harmony with nature. Solar-powered eco-friendly resort with organic gardens and natural wellness experiences.',
      amenities: ['Free WiFi', 'Organic Restaurant', 'Natural Spa', 'Solar Power', 'Organic Gardens', 'Nature Walks', 'Yoga Pavilion', 'Meditation Center'],
      category: 'eco',
      address: {
        lines: ['890 Green Valley Road'],
        cityName: location,
        countryCode: 'IN'
      }
    }
  ];


  const nightsDiff = new Date(checkOut) - new Date(checkIn);
  const nights = Math.ceil(nightsDiff / (1000 * 60 * 60 * 24));
  const seasonMultiplier = Math.random() * 0.3 + 0.9; // 0.9 to 1.2
  
  return hotelData.map(async (hotel, index) => {
    try {

      const imageUrl = await getUnsplashImage(`${hotel.category} hotel ${location}`, 'luxury hotel');
      
      return {
        ...hotel,
        price: Math.round(hotel.basePrice * seasonMultiplier),
        image: imageUrl,
        totalNights: nights,
        location: location 
      };
    } catch (error) {
      console.error(`Error processing hotel ${hotel.id}:`, error);
      return {
        ...hotel,
        price: Math.round(hotel.basePrice * seasonMultiplier),
        image: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80&auto=format&fit=crop`,
        totalNights: nights,
        location: location
      };
    }
  });
};

// Mapping function to convert city names to IATA codes
function getCityCode(cityName) {
  const cityMap = {
    // India
    'Mumbai': 'BOM',
    'Delhi': 'DEL',
    'New Delhi': 'DEL',
    'Bangalore': 'BLR',
    'Bengaluru': 'BLR',
    'Chennai': 'MAA',
    'Hyderabad': 'HYD',
    'Kolkata': 'CCU',
    'Goa': 'GOI',
    'Jaipur': 'JAI',
    'Ahmedabad': 'AMD',
    'Pune': 'PNQ',
    'Kochi': 'COK',
    'Lucknow': 'LKO',
    'Thiruvananthapuram': 'TRV',
    'Chandigarh': 'IXC',
    'Guwahati': 'GAU',
    'Bhubaneswar': 'BBI',
    'Visakhapatnam': 'VTZ',
    'Nagpur': 'NAG',
    'Coimbatore': 'CJB',
    'Indore': 'IDR',
    'Varanasi': 'VNS',
    'Udaipur': 'UDR',
    'Agra': 'AGR',
    // International cities
    'London': 'LON',
    'New York': 'NYC',
    'Dubai': 'DXB',
    'Singapore': 'SIN',
    'Bangkok': 'BKK',
    'Paris': 'PAR',
    'Tokyo': 'TYO',
    'Hong Kong': 'HKG',
    'Sydney': 'SYD',
    'Los Angeles': 'LAX',
    'Barcelona': 'BCN',
    'Berlin': 'BER',
    'Rome': 'ROM',
    'Amsterdam': 'AMS',
    'Istanbul': 'IST',
    'Kuala Lumpur': 'KUL',
    'Cairo': 'CAI',
    'Beijing': 'BJS',
    'Shanghai': 'SHA',
    'Seoul': 'SEL',
    'Toronto': 'YTO',
    'Cape Town': 'CPT',
    'Madrid': 'MAD',
    'Vienna': 'VIE',
    'Zurich': 'ZRH',
    'Munich': 'MUC',
    'Prague': 'PRG',
    'Athens': 'ATH',
    'Moscow': 'MOW',
    'Stockholm': 'STO'
  };
  
  return cityMap[cityName] || cityName.substring(0, 3).toUpperCase();
}

router.get('/search', async (req, res) => {
  try {
    const { location, checkIn, checkOut, guests } = req.query;
    
    console.log('Hotel search request:', { location, checkIn, checkOut, guests });
    
    try {
      console.log('Attempting to use Amadeus API for real hotel data');
      const cityCode = getCityCode(location);
      console.log(`Mapped ${location} to city code: ${cityCode}`);
      
      const token = await getAmadeusToken();
      console.log('Successfully obtained Amadeus token');
      
      console.log(`Making request to Amadeus for hotels in ${cityCode}`);
      
      console.log('Making Amadeus API request with:', {
        cityCode,
        token: token.substring(0, 10) + '...'
      });
      
      const response = await axios.get(
        'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', 
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { cityCode: cityCode }
        }
      );
      
      console.log('Amadeus API response:', {
        status: response.status,
        dataLength: response.data?.data?.length || 0
      });
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        console.log(`✅ Found ${response.data.data.length} hotels from Amadeus API`);
       
        const displayLimit = 25; // Show up to 25 hotels
        const hotelsToDisplay = response.data.data.slice(0, displayLimit);
        
        console.log(`Processing ${hotelsToDisplay.length} hotels for display`);
        

        const processedHotels = hotelsToDisplay.map(hotel => {
          // Generate random price based on hotel name length (just for variety)
          const basePrice = 3000 + (hotel.name.length * 200);
          
          return {
            id: hotel.hotelId,
            name: hotel.name,
            rating: ((Math.random() * 1.5) + 3.5).toFixed(1), // Random rating between 3.5-5.0
            basePrice: basePrice,
            price: basePrice,
            description: "Modern hotel with comfortable accommodations in a convenient location.",
            amenities: ['WiFi', 'Air Conditioning', 'Restaurant', '24-hour Front Desk'],
            category: 'hotel',
            address: {
              lines: [hotel.address?.lines?.join(', ') || ''],
              cityName: cityCode === 'DEL' ? 'Delhi' : (hotel.address?.cityName || cityCode),
              countryCode: hotel.address?.countryCode || 'IN'
            },
            cityCode: cityCode,
  
            image: hotelImages[Math.floor(Math.random() * hotelImages.length)]
          };
        });
        
        console.log(`✅ SUCCESS! Returning ${processedHotels.length} hotels for display`);
        return res.json(processedHotels);
      }
    } catch (amadeusError) {
      console.error('Amadeus API error:', amadeusError.message);
      if (amadeusError.response && amadeusError.response.data) {
        console.error('Error details:', amadeusError.response.data);
      }
    }
    
    // Fall back to mock data if Amadeus API fails
    console.log('⚠️ ');
    const hotelPromises = generateHotels(location, checkIn, checkOut, guests);
    const hotels = await Promise.all(hotelPromises);
    
    console.log('Generated mock hotels:', hotels.length);
    res.json(hotels);
  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/:hotelId', async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { checkIn, checkOut, guests, location } = req.query;

    console.log('Hotel details request:', { hotelId, checkIn, checkOut, guests, location });

    try {
      const token = await getAmadeusToken();
      
      const response = await axios.get(
        'https://test.api.amadeus.com/v3/shopping/hotel-offers',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            hotelIds: hotelId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            adults: guests || '1',
            roomQuantity: '1',
            currency: 'INR'
          }
        }
      );
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        console.log('Found hotel details from Amadeus API');
        
        const hotelData = response.data.data[0];
        const hotel = hotelData.hotel;
        
        
        const cityName = hotel.address?.cityName || location || getCityNameFromCode(hotelId.substring(2, 5));
        console.log(`Using city name for attractions: ${cityName}`);
        
    
        const hotelDetails = {
          hotel: {
            hotelId: hotel.hotelId,
            name: hotel.name,
            rating: hotel.rating || 4.2,
            description: { text: hotel.description?.text || "Luxury hotel with modern amenities and convenient location." },
            address: hotel.address || { cityName: cityName, countryCode: 'IN' },
            amenities: hotel.amenities || ['Free WiFi', 'Swimming Pool', 'Restaurant']
          },
          offers: hotelData.offers.map(offer => ({
            id: offer.id,
            room: offer.room,
            price: offer.price,
            policies: offer.policies
          })),
          id: hotel.hotelId,
          name: hotel.name,
          rating: hotel.rating,
          description: hotel.description?.text || "Luxury hotel with modern amenities and convenient location.",
          amenities: hotel.amenities || ['Free WiFi', 'Swimming Pool', 'Restaurant'],
          category: 'hotel',
          address: hotel.address || { cityName: cityName, countryCode: 'IN' },
          image: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80&auto=format&fit=crop`,
          images: [
            `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80&auto=format&fit=crop`,
            `https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80&auto=format&fit=crop`,
            `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80&auto=format&fit=crop`,
            `https://images.unsplash.com/photo-1562133567-b6a0a9c7e6eb?w=400&q=80&auto=format&fit=crop`
          ]
        };

        hotelDetails.offers = [
          {
            type: 'Standard Room',
            price: parseInt(hotelData.offers[0]?.price?.total) || 5000,
            amenities: ['Free WiFi', 'Air Conditioning', 'Room Service', 'Daily Housekeeping']
          },
          {
            type: 'Deluxe Room',
            price: parseInt(hotelData.offers[0]?.price?.total * 1.3) || 6500,
            amenities: ['Free WiFi', 'Air Conditioning', 'Room Service', 'Daily Housekeeping', 'City View', 'Mini Bar']
          },
          {
            type: 'Executive Suite',
            price: parseInt(hotelData.offers[0]?.price?.total * 1.8) || 9000,
            amenities: ['Free WiFi', 'Air Conditioning', 'Room Service', 'Daily Housekeeping', 'City View', 'Mini Bar', 'Separate Living Area', 'Executive Lounge Access']
          }
        ];
        
        
        console.log('Getting weather for:', cityName);
        const weatherData = await getWeatherData(cityName, checkIn);
        if (weatherData) {
          hotelDetails.weather = weatherData;
          console.log('Weather data added successfully');
        }
        
        
        console.log('Getting attractions for:', cityName);
        const attractions = await getNearbyAttractions(cityName);
        if (attractions && attractions.length > 0) {
          hotelDetails.attractions = attractions;
          console.log('Attractions added:', attractions.length);
        }
        
        const countryInfo = await getCountryInfo(hotel.address?.countryCode || 'IN');
        if (countryInfo) {
          hotelDetails.countryInfo = countryInfo;
          console.log('Country info added');
        }
        
        return res.json(hotelDetails);
      }
    } catch (amadeusError) {
      console.error('Amadeus hotel details error:', amadeusError.message);
      if (amadeusError.response) {
        console.error('Amadeus error response:', {
          status: amadeusError.response.status,
          data: amadeusError.response.data,
          headers: amadeusError.response.headers
        });
      } else if (amadeusError.request) {
        console.error('No response received from Amadeus');
      }
    }
    

    console.log('Amadeus API failed for hotel details, using mock data');
    const cityName = location || getCityNameFromCode(hotelId.substring(2, 5)) || 'Delhi';
    console.log(`Using cityName: ${cityName} for  hotel`);

    const mockHotel = {
      id: hotelId,
      name: `${cityName} ${hotelId.substring(0, 4)} Hotel`,
      rating: 4.2 + (Math.random() * 0.6),
      basePrice: 4500 + (Math.floor(Math.random() * 5000)),
      price: 4500 + (Math.floor(Math.random() * 5000)),
      description: `Experience luxury and comfort at our premier hotel in ${cityName}. Featuring elegant rooms, top-notch amenities, and exceptional service, our hotel is perfectly situated to explore the city's attractions.`,
      amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness Center', 'Fine Dining Restaurant', 'Fitness Center', '24/7 Room Service', 'Business Center', 'Valet Parking'],
      category: 'luxury',
      address: {
        lines: [`${Math.floor(Math.random() * 500) + 1} ${cityName} Avenue`],
        cityName: cityName,
        countryCode: 'IN'
      },
      image: `https://source.unsplash.com/featured/?hotel,building/${hotelId}`
    };

    const hotelDetails = {
      hotel: {
        hotelId: mockHotel.id,
        name: mockHotel.name,
        rating: mockHotel.rating,
        description: { text: mockHotel.description },
        address: mockHotel.address,
        amenities: mockHotel.amenities,
        category: mockHotel.category || 'luxury'
      },
      id: mockHotel.id,
      name: mockHotel.name,
      rating: mockHotel.rating,
      description: mockHotel.description,
      amenities: mockHotel.amenities,
      category: mockHotel.category || 'luxury',
      address: mockHotel.address,
      image: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80&auto=format&fit=crop`,
      images: [
        `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1562133567-b6a0a9c7e6eb?w=400&q=80&auto=format&fit=crop`
      ],
      offers: [
        {
          type: 'Standard Room',
          price: mockHotel.price,
          amenities: ['Free WiFi', 'Air Conditioning', 'Room Service', 'Daily Housekeeping']
        },
        {
          type: 'Deluxe Room',
          price: Math.round(mockHotel.price * 1.3),
          amenities: ['Free WiFi', 'Air Conditioning', 'Room Service', 'Daily Housekeeping', 'City View', 'Mini Bar']
        },
        {
          type: 'Executive Suite',
          price: Math.round(mockHotel.price * 1.8),
          amenities: ['Free WiFi', 'Air Conditioning', 'Room Service', 'Daily Housekeeping', 'City View', 'Mini Bar', 'Separate Living Area', 'Executive Lounge Access']
        }
      ]
    };

    console.log('Getting weather for:', cityName);
    const weatherData = await getWeatherData(cityName, checkIn);
    if (weatherData) {
      hotelDetails.weather = weatherData;
      console.log('Weather data added successfully');
    }

    console.log('Getting attractions for:', cityName);
    const attractions = await getNearbyAttractions(cityName);
    if (attractions && attractions.length > 0) {
      hotelDetails.attractions = attractions;
      console.log('Attractions added:', attractions.length);
    }

    const countryInfo = await getCountryInfo(mockHotel.address.countryCode);
    if (countryInfo) {
      hotelDetails.countryInfo = countryInfo;
      console.log('Country info added');
    }

    res.json(hotelDetails);
  } catch (error) {
    console.error('Hotel details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function getWikipediaAttractions(cityName) {
  try {
    console.log('Fetching Wikipedia attractions for:', cityName);
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`);
    
    if (response.data && response.data.extract) {
      return [{
        title: `About ${cityName}`,
        description: response.data.extract.substring(0, 150) + '...',
        rating: 4.2,
        type: 'City Information'
      }];
    }
  } catch (error) {
    console.log('Wikipedia API failed:', error.message);
  }
  return [];
}

async function getNearbyAttractions(cityName) {
  try {
    console.log('Getting nearby attractions for:', cityName);
    
    
    const staticAttractions = getStaticAttractions(cityName);
    
    const wikiAttractions = await getWikipediaAttractions(cityName);
    
    const allAttractions = [...staticAttractions, ...wikiAttractions];
    
    const uniqueAttractions = allAttractions.filter((attraction, index, self) => 
      index === self.findIndex(a => a.title === attraction.title)
    ).slice(0, 10);
    
    console.log('Total unique attractions found:', uniqueAttractions.length);
    return uniqueAttractions;
  } catch (error) {
    console.error('Error getting attractions:', error);
    return getStaticAttractions(cityName);
  }
}

async function getUnsplashImage(query, fallback = 'hotel') {
  try {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      throw new Error('Unsplash API key not configured');
    }
    
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: query,
        per_page: 1,
        orientation: 'landscape'
      },
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      },
      timeout: 5000
    });
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].urls.regular;
    }
  } catch (error) {
    console.log('Unsplash API failed, using fallback image');
  }
  
  return `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80&auto=format&fit=crop`;
}

async function getWeatherData(cityName, checkInDate) {
  try {
    if (!process.env.OPENWEATHER_API_KEY) {
      console.log('OpenWeather API key not configured');
      return null;
    }

    const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        q: cityName,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
        cnt: 5
      },
      timeout: 5000
    });

    if (response.data && response.data.list) {
      return response.data.list.map((item, index) => {
        const date = new Date(checkInDate);
        date.setDate(date.getDate() + index);
        
        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          temp: item.main.temp,
          description: item.weather[0].description,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed
        };
      });
    }
  } catch (error) {
    console.error('Weather API error:', error.message);
    return null;
  }
}

async function getCountryInfo(countryCode) {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}`, {
      timeout: 5000
    });

    if (response.data && response.data.length > 0) {
      const country = response.data[0];
      return {
        name: country.name.common,
        capital: country.capital ? country.capital[0] : 'N/A',
        currency: country.currencies ? Object.values(country.currencies)[0].name : 'N/A',
        flag: country.flags.svg || country.flags.png
      };
    }
  } catch (error) {
    console.error('Country API error:', error.message);
    return null;
  }
}

function getStaticAttractions(cityName) {
  const attractionsMap = {
    'Mumbai': [
      { title: 'Gateway of India', description: 'Iconic arch monument overlooking the Arabian Sea', rating: 4.5 },
      { title: 'Marine Drive', description: 'Beautiful seafront promenade perfect for evening walks', rating: 4.3 },
      { title: 'Chhatrapati Shivaji Terminus', description: 'UNESCO World Heritage railway station with Victorian architecture', rating: 4.4 },
      { title: 'Elephanta Caves', description: 'Ancient rock-cut caves dedicated to Lord Shiva', rating: 4.2 },
      { title: 'Juhu Beach', description: 'Popular beach destination with street food and entertainment', rating: 4.0 }
    ],
    'Delhi': [
      { title: 'Red Fort', description: 'Historic fortified palace and UNESCO World Heritage site', rating: 4.3 },
      { title: 'India Gate', description: 'War memorial and iconic landmark of Delhi', rating: 4.4 },
      { title: 'Qutub Minar', description: 'Tallest brick minaret in the world', rating: 4.2 },
      { title: 'Lotus Temple', description: 'Stunning flower-shaped Baháí House of Worship', rating: 4.5 },
      { title: 'Humayun\'s Tomb', description: 'Beautiful Mughal architecture and garden tomb', rating: 4.3 }
    ],
    'Bangalore': [
      { title: 'Lalbagh Botanical Garden', description: 'Historic botanical garden with diverse flora', rating: 4.3 },
      { title: 'Bangalore Palace', description: 'Magnificent palace with Tudor-style architecture', rating: 4.2 },
      { title: 'Cubbon Park', description: 'Large green lung in the heart of the city', rating: 4.1 },
      { title: 'ISKCON Temple', description: 'Beautiful modern temple dedicated to Lord Krishna', rating: 4.4 },
      { title: 'UB City Mall', description: 'Luxury shopping and dining destination', rating: 4.0 }
    ]
  };

  return attractionsMap[cityName] || [
    { title: `${cityName} City Center`, description: 'Explore the vibrant heart of the city', rating: 4.0 },
    { title: `${cityName} Museum`, description: 'Learn about local history and culture', rating: 4.1 },
    { title: `${cityName} Market`, description: 'Experience local shopping and cuisine', rating: 4.2 },
    { title: `${cityName} Park`, description: 'Relax in beautiful green spaces', rating: 4.0 },
    { title: `${cityName} Temple`, description: 'Visit historic religious sites', rating: 4.3 }
  ];
}

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { hotel, roomType, amount, checkIn, checkOut, guests, firstName, lastName, email, phone } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${hotel.name} - ${roomType.type}`,
            description: `Check-in: ${checkIn}, Check-out: ${checkOut}, Guests: ${guests}`,
          },
          unit_amount: amount * 100, // Convert to paise
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/hotels`,
      customer_email: email,
      metadata: {
        type: 'hotel_booking',
        hotelId: hotel.id || hotel.hotelId,
        hotelName: hotel.name,
        roomType: roomType.type,
        checkIn,
        checkOut,
        guests,
        firstName,
        lastName,
        phone
      }
    });

    // Save payment record
    const payment = new Payment({
      paymentId: session.id,
      type: 'hotel',
      amount: amount,
      status: 'completed',  // Since it's mock data
      hotelName: hotel.name,
      roomType: roomType.type,
      checkIn: checkIn,
      checkOut: checkOut,
      guestName: `${firstName} ${lastName}`,
      customerEmail: email,
      customerPhone: phone,
      metadata: {
        stripeSessionId: session.id,
        hotelId: hotel.id || hotel.hotelId,
        guests: guests.toString()
      }
    });

    await payment.save();
    console.log('Hotel payment record created:', payment.paymentId);

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/book', async (req, res) => {
  try {
    const { hotel, roomType, checkIn, checkOut, guests, contactInfo, userEmail, totalAmount } = req.body;

    const pnr = 'HT' + Math.random().toString(36).substr(2, 6).toUpperCase();

    if (userEmail) {
      try {
        const user = await User.findOne({ email: userEmail });
        if (user) {
          const checkInDate = new Date(checkIn);
          const checkOutDate = new Date(checkOut);
          const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

          const dbBooking = new Booking({
            userId: user._id,
            bookingType: 'hotel',
            pnr: pnr,
            status: 'CONFIRMED',
            totalAmount: totalAmount,
            hotelDetails: {
              hotelName: hotel.name,
              roomType: roomType.type,
              checkIn: checkIn,
              checkOut: checkOut,
              nights: nights,
              guests: guests,
              location: hotel.address?.cityName || 'N/A'
            },
            contactInfo: contactInfo
          });

          await dbBooking.save();
          console.log('booking saved to db:', pnr);
        }
      } catch (dbError) {
        console.error('Error saving hotel booking to DB:', dbError);
      }
    }

    res.json({
      success: true,
      pnr: pnr,
      message: 'Hotel booking created successfully'
    });
  } catch (error) {
    console.error('Hotel booking error:', error);
    res.status(500).json({ error: 'Hotel booking failed' });
  }
});

module.exports = router;

function getCityNameFromCode(code) {
  const cityCodeMap = {
    'DEL': 'Delhi',
    'BOM': 'Mumbai',
    'BLR': 'Bangalore',
    'MAA': 'Chennai',
    'HYD': 'Hyderabad',
    'CCU': 'Kolkata',
    'GOI': 'Goa',
    'JAI': 'Jaipur',
    'IXC': 'Chandigarh',
  };
  
  return cityCodeMap[code] || 'Delhi'; 
}