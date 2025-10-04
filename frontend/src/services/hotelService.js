import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const searchHotels = async (params) => {
    const { destination, checkIn, checkOut, guests } = params;
    
    const response = await axios.get(`${API_URL}/hotels/search`, {
        params: {
            cityCode: destination,
            checkIn: checkIn.toISOString().split('T')[0],
            checkOut: checkOut.toISOString().split('T')[0],
            guests
        }
    });

    return response.data;
};

export const getHotelDetails = async (hotelId) => {
    const response = await axios.get(`${API_URL}/hotels/${hotelId}`);
    return response.data;
};