import asyncHandler from 'express-async-handler';
import * as amadeusService from '../services/amadeusService.js';

const CITY_CODES = {
    'paris': 'PAR',
    'london': 'LON',
    'new york': 'NYC',
    'tokyo': 'TYO',
    'dubai': 'DXB'
};

const transformHotelData = (hotelOffer) => {
    try {
        const hotel = hotelOffer.hotel;
        const offer = hotelOffer.offers?.[0] || {};
        
        return {
            id: hotel.hotelId,
            name: hotel.name,
            rating: parseInt(hotel.rating) || Math.floor(Math.random() * 2) + 3,
            reviewCount: Math.floor(Math.random() * 1000), // Amadeus doesn't provide reviews
            location: `${hotel.address?.cityName || ''}, ${hotel.address?.countryCode || ''}`,
            price: offer.price?.total || 0,
            currency: offer.price?.currency || 'EUR',
            image: hotel.media?.[0]?.uri || 'https://source.unsplash.com/800x600/?hotel',
            amenities: hotel.amenities || ['WiFi', 'Restaurant'],
            description: hotel.description?.text || 'A wonderful hotel in a great location.',
            coordinates: {
                latitude: hotel.latitude,
                longitude: hotel.longitude
            }
        };
    } catch (error) {
        console.error('Transform Error:', error);
        return null;
    }
};

const searchHotels = asyncHandler(async (req, res) => {
    const { cityCode, checkIn, checkOut, guests } = req.query;

    if (!cityCode || !checkIn || !checkOut) {
        res.status(400);
        throw new Error('Please provide cityCode, checkIn and checkOut dates');
    }

    try {
        const iataCode = CITY_CODES[cityCode.toLowerCase()] || cityCode.toUpperCase();
        const hotels = await amadeusService.searchHotels(
            iataCode,
            checkIn,
            checkOut,
            parseInt(guests) || 1
        );

        let transformedHotels = [];
        
        if (hotels.length > 0) {
            transformedHotels = hotels
                .map(transformHotelData)
                .filter(hotel => hotel !== null);
        }

        if (transformedHotels.length === 0) {
            console.log('No hotels found or API error');
            return res.json({
                success: true,
                data: generateMockHotels(5),
                source: 'mock'
            });
        }

        res.json({
            success: true,
            data: transformedHotels,
            source: 'api'
        });
    } catch (error) {
        console.error('Controller Error:', error);
        res.json({
            success: true,
            data: generateMockHotels(5),
            source: 'mock'
        });
    }
});

const generateMockHotels = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `MOCK_${i + 1}`,
        name: `Hotel ${i + 1}`,
        rating: Math.floor(Math.random() * 2) + 3,
        reviewCount: Math.floor(Math.random() * 1000),
        location: 'Paris, France',
        price: Math.floor(Math.random() * 200) + 100,
        currency: 'EUR',
        image: `https://source.unsplash.com/800x600/?hotel,room&sig=${i}`,
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'].slice(0, Math.floor(Math.random() * 4) + 1),
        description: 'A wonderful hotel in the heart of the city.',
        coordinates: {
            latitude: 48.8566,
            longitude: 2.3522
        }
    }));
};

const getHotelDetails = asyncHandler(async (req, res) => {
    const { hotelId } = req.params;
    
    try {
        const hotelData = await amadeusService.getHotelDetails(hotelId);
        res.json({
            success: true,
            data: transformHotelData(hotelData)
        });
    } catch (error) {
        console.error('Hotel Details Error:', error);
        res.json({
            success: true,
            data: generateMockHotels(1)[0]
        });
    }
});

export { searchHotels, getHotelDetails };