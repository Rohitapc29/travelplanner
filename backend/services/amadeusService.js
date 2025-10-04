import amadeus from '../config/amadeus.js';

export const searchHotels = async (cityCode, checkInDate, checkOutDate, adults = 1) => {
    try 
    {
        console.log('Searching hotels with params:', { cityCode, checkInDate, checkOutDate, adults });

        const locationsResponse = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode
        });

        console.log(`Found ${locationsResponse.data.length} hotels in ${cityCode}`);
    
        const hotelIds = locationsResponse.data.slice(0, 10).map(hotel => hotel.hotelId);
        
        if (hotelIds.length === 0) {
            console.log('No hotels found in this city');
            return [];
        }
    
        const response = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: hotelIds.join(','),
            adults: String(adults),
            checkInDate,
            checkOutDate
        });

        console.log(`Got offers for ${response.data.length} hotels`)
        return response.data;
    } catch (error) {
        console.error('Amadeus API Error:', error.response?.data || error);
        return [];
    }
};

export const getHotelDetails = async (hotelId) => {
    try {
        const response = await amadeus.shopping.hotelOffersByHotel.get({
            hotelId: hotelId
        });
        return response.data;
    } catch (error) {
        console.error('Hotel Details Error:', error.response?.data || error);
        throw new Error('Error fetching hotel details');
    }
};