export default function HotelFilters({ filters, onChange }) {
  const handlePriceChange = (e) => {
    onChange({
      ...filters,
      priceRange: parseInt(e.target.value)
    });
  };

  const handleStarChange = (rating) => {
    onChange({
      ...filters,
      stars: {
        ...filters.stars,
        [rating]: !filters.stars[rating]
      }
    });
  };

  const handleAmenityChange = (amenity) => {
    onChange({
      ...filters,
      amenities: {
        ...filters.amenities,
        [amenity]: !filters.amenities[amenity]
      }
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.priceRange}
          onChange={handlePriceChange}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>$0</span>
          <span>${filters.priceRange}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Star Rating</h3>
        {[5, 4, 3, 2, 1].map((rating) => (
          <label key={rating} className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={filters.stars[rating]}
              onChange={() => handleStarChange(rating)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              {rating} Stars
            </span>
          </label>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Amenities</h3>
        {Object.keys(filters.amenities).map((amenity) => (
          <label key={amenity} className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={filters.amenities[amenity]}
              onChange={() => handleAmenityChange(amenity)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-600">{amenity}</span>
          </label>
        ))}
      </div>
    </div>
  );
}