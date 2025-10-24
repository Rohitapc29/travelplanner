import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function HotelList() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state;
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/api/hotels/search?` + 
          `location=${encodeURIComponent(searchParams.location)}` +
          `&checkIn=${searchParams.checkIn}` +
          `&checkOut=${searchParams.checkOut}` +
          `&guests=${searchParams.guests}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch hotels');
        }
        
        const data = await response.json();
        setHotels(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to load hotels. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (searchParams?.location) {
      fetchHotels();
    }
  }, [searchParams]);

  const sortedAndFilteredHotels = hotels
    .filter(hotel => {
      if (filterBy === 'all') return true;
      if (filterBy === 'luxury') return hotel.price > 10000;
      if (filterBy === 'mid-range') return hotel.price >= 5000 && hotel.price <= 10000;
      if (filterBy === 'budget') return hotel.price < 5000;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '6px solid rgba(255,255,255,0.3)',
            borderTop: '6px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 30px'
          }}></div>
          <h2 style={{ fontSize: '28px', fontWeight: '300', margin: 0 }}>
            Searching for perfect hotels...
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.8, marginTop: '10px' }}>
            Finding the best deals in {searchParams?.location}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '60px 40px',
          borderRadius: '20px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😔</div>
          <h3 style={{ color: '#e74c3c', marginBottom: '15px' }}>Search Failed</h3>
          <p style={{ color: '#666', marginBottom: '30px' }}>{error}</p>
          <button
            onClick={() => navigate('/hotels')}
            style={{
              padding: '15px 30px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            New Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/hotels')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '20px',
              fontSize: '14px'
            }}
          >
            ← New Search
          </button>
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '300', 
            margin: '0 0 10px 0' 
          }}>
            {hotels.length} Hotels in {searchParams.location}
          </h1>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            fontSize: '16px',
            opacity: 0.9
          }}>
            <span>📅 {searchParams.checkIn} - {searchParams.checkOut}</span>
            <span>👥 {searchParams.guests} guest{searchParams.guests > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Filter and Sort Section */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e5e5',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: '#333' }}>Filter by price:</span>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              style={{
                padding: '8px 15px',
                borderRadius: '8px',
                border: '2px solid #e5e5e5',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Hotels</option>
              <option value="luxury">Luxury (₹10,000+)</option>
              <option value="mid-range">Mid-range (₹5,000-₹10,000)</option>
              <option value="budget">Budget (Under ₹5,000)</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: '#333' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 15px',
                borderRadius: '8px',
                border: '2px solid #e5e5e5',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="price">Price (Low to High)</option>
              <option value="rating">Rating (High to Low)</option>
              <option value="name">Name (A to Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div style={{
        padding: '40px 20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '30px'
        }}>
          {sortedAndFilteredHotels.map(hotel => (
            <div
              key={hotel.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                border: '1px solid #f0f0f0'
              }}
              onClick={() => navigate(`/hotels/${hotel.id}`, { 
                state: { searchParams, hotelData: hotel } 
              })}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-8px)';
                e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  style={{
                    width: '100%',
                    height: '240px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {hotel.rating}★
                </div>
                {hotel.category && (
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {hotel.category}
                  </div>
                )}
              </div>
              
              <div style={{ padding: '25px' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: '0 0 10px 0',
                  color: '#333',
                  lineHeight: '1.3'
                }}>
                  {hotel.name}
                </h3>
                
                {hotel.address && (
                  <p style={{
                    fontSize: '14px',
                    color: '#888',
                    margin: '0 0 15px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    📍 {hotel.address.cityName}, {hotel.address.countryCode}
                  </p>
                )}
                
                {hotel.description && (
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.5',
                    margin: '0 0 20px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {hotel.description}
                  </p>
                )}
                
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        style={{
                          fontSize: '12px',
                          backgroundColor: '#f8f9ff',
                          color: '#667eea',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          border: '1px solid #e5e7ff'
                        }}
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span style={{
                        fontSize: '12px',
                        color: '#888'
                      }}>
                        +{hotel.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '15px',
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <div>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#333'
                    }}>
                      ₹{Math.round(hotel.price).toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#888',
                      marginLeft: '5px'
                    }}>
                      /night
                    </span>
                  </div>
                  
                  <button style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {sortedAndFilteredHotels.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>No hotels match your filters</h3>
            <p style={{ color: '#666' }}>Try adjusting your filter criteria</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}