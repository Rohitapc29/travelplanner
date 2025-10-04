import { StarIcon } from '@heroicons/react/24/solid';

export default function HotelCard({ hotel }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={hotel.image || 'https://via.placeholder.com/300x200'}
        alt={hotel.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
        
        <div className="mt-1 flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${
                i < hotel.rating ? 'text-yellow-400' : 'text-gray-200'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            ({hotel.reviewCount} reviews)
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500">{hotel.location}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ₹{hotel.price}
            </span>
            <span className="text-gray-600">/night</span>
          </div>
          
          <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}