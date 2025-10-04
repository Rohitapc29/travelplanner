// filepath: c:\Users\vedan\Desktop\travelplanner\frontend\src\pages\hotels\HotelsPage.jsx
import { useState } from 'react';
import HotelSearchForm from '../../components/hotels/HotelSearchForm';
import HotelList from '../../components/hotels/HotelList';
import HotelFilters from '../../components/hotels/HotelFilters';
import { searchHotels } from '../../services/hotelService';

export default function HotelsPage() {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        priceRange: 1000,
        stars: {
            5: false,
            4: false,
            3: false,
            2: false,
            1: false
        },
        amenities: {
            WiFi: false,
            Pool: false,
            Spa: false,
            Parking: false,
            Restaurant: false
        }
    });

    const handleSearch = async (searchParams) => {
        try {
            setLoading(true);
            setError(null);
            const result = await searchHotels(searchParams);
            setHotels(result.data);
            setFilteredHotels(result.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        
        const filtered = hotels.filter(hotel => {
            if (hotel.price > newFilters.priceRange) {
                return false;
            }
            
            
            const starFilters = Object.entries(newFilters.stars).filter(([_, isChecked]) => isChecked);
            if (starFilters.length > 0 && !starFilters.some(([star, _]) => hotel.rating === parseInt(star))) {
                return false;
            }
            
            
            const amenityFilters = Object.entries(newFilters.amenities).filter(([_, isChecked]) => isChecked);
            if (amenityFilters.length > 0 && !amenityFilters.every(([amenity, _]) => 
                hotel.amenities.includes(amenity))) {
                return false;
            }
            
            return true;
        });
        
        setFilteredHotels(filtered);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Your Perfect Stay</h1>
            
            <HotelSearchForm onSearch={handleSearch} />
            
            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            
            <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                <aside className="hidden lg:block lg:col-span-3">
                    <HotelFilters filters={filters} onChange={handleFilterChange} />
                </aside>
                
                <main className="lg:col-span-9">
                    <HotelList 
                        hotels={filteredHotels} 
                        loading={loading} 
                    />
                </main>
            </div>
        </div>
    );
}