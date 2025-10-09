import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = location.state?.searchParams;
  
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/api/hotels/${id}?` +
          `checkIn=${searchParams?.checkIn || ''}&` +
          `checkOut=${searchParams?.checkOut || ''}&` +
          `guests=${searchParams?.guests || 1}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch hotel details');
        }
        
        const data = await response.json();
        setHotel(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching hotel details:', err);
        setError('Failed to load hotel details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotelDetails();
    }
  }, [id, searchParams]);

  const handleBooking = (room) => {
    if (!searchParams) {
      alert('Please search for dates first');
      return;
    }
    
    navigate(`/hotels/${id}/booking`, {
      state: {
        hotel: hotel,
        roomType: room,
        searchParams: searchParams
      }
    });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '18px', color: '#666' }}>Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          color: '#dc3545'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😔</div>
          <h3>Unable to load hotel details</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate('/hotels')}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const hotelName = hotel.hotel?.name || hotel.name || "Hotel";
  const offers = hotel.offers || [];
  const images = hotel.images || [hotel.image];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Back Button */}
      <div style={{
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            color: '#667eea',
            padding: '12px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          ← Back to Results
        </button>
      </div>

      {/* Hotel Header */}
      <div style={{
        backgroundColor: 'white',
        margin: '0 20px',
        maxWidth: '1360px',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        {/* Image Gallery */}
        <div style={{
          height: '400px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <img
            src={images[selectedImage]}
            alt={hotelName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          
          {images.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '10px'
            }}>
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    width: '80px',
                    height: '60px',
                    border: selectedImage === index ? '3px solid #667eea' : '2px solid white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    opacity: selectedImage === index ? 1 : 0.7
                  }}
                >
                  <img
                    src={img}
                    alt={`${hotelName} ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hotel Info */}
        <div style={{ padding: '40px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#333',
                margin: '0 0 15px 0',
                lineHeight: '1.2'
              }}>
                {hotelName}
              </h1>
              
              {hotel.rating && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {hotel.rating}★
                  </div>
                  <span style={{ color: '#666', fontSize: '16px' }}>
                    Excellent Rating
                  </span>
                </div>
              )}
              
              {hotel.address && (
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  margin: '0 0 20px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📍 {hotel.address.lines?.join(', ')}<br/>
                  {hotel.address.cityName}, {hotel.address.countryCode}
                </p>
              )}
            </div>
            
            {offers.length > 0 && (
              <div style={{
                backgroundColor: '#f8f9ff',
                padding: '25px',
                borderRadius: '15px',
                border: '2px solid #e5e7ff',
                minWidth: '280px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 15px 0',
                  color: '#667eea'
                }}>
                  Starting from
                </h3>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#333',
                  marginBottom: '10px'
                }}>
                  ₹{Math.round(offers[0].price).toLocaleString()}
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  margin: '0 0 20px 0'
                }}>
                  per night • {offers[0].type}
                </p>
                <button
                  onClick={() => handleBooking(offers[0])}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  Book Now
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{
            borderBottom: '2px solid #f0f0f0',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              gap: '40px'
            }}>
              {['overview', 'rooms', 'amenities', 'location'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '15px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: activeTab === tab ? '#667eea' : '#666',
                    cursor: 'pointer',
                    borderBottom: activeTab === tab ? '3px solid #667eea' : '3px solid transparent',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '40px',
                alignItems: 'start'
              }}>
                <div>
                  {hotel.description && (
                    <div style={{ marginBottom: '30px' }}>
                      <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        marginBottom: '15px',
                        color: '#333'
                      }}>
                        About This Hotel
                      </h3>
                      <p style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#666'
                      }}>
                        {hotel.description}
                      </p>
                    </div>
                  )}

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
                              {Math.round(day.temp)}°C
                            </p>
                            <p style={{
                              fontSize: '12px',
                              color: '#666',
                              textTransform: 'capitalize'
                            }}>
                              {day.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hotel.attractions && Array.isArray(hotel.attractions) && hotel.attractions.length > 0 && (
                    <div style={{
                      backgroundColor: '#f0fdf4',
                      border: '2px solid #16a34a',
                      borderRadius: '15px',
                      padding: '20px'
                    }}>
                      <h4 style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        marginBottom: '15px',
                        color: '#15803d'
                      }}>
                        🏛️ Nearby Attractions
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '15px'
                      }}>
                        {hotel.attractions.slice(0, 6).map((attraction, index) => (
                          <div
                            key={index}
                            style={{
                              backgroundColor: 'white',
                              padding: '15px',
                              borderRadius: '10px',
                              border: '1px solid #dcfce7'
                            }}
                          >
                            <h5 style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              marginBottom: '8px',
                              color: '#15803d'
                            }}>
                              {attraction.title}
                            </h5>
                            <p style={{
                              fontSize: '14px',
                              color: '#666',
                              lineHeight: '1.4',
                              marginBottom: '8px'
                            }}>
                              {attraction.description}
                            </p>
                            {attraction.rating && (
                              <div style={{
                                fontSize: '12px',
                                color: '#16a34a',
                                fontWeight: '600'
                              }}>
                                ⭐ {attraction.rating}/5
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {hotel.address && (
                    <div style={{
                      backgroundColor: '#fef3c7',
                      border: '2px solid #f59e0b',
                      borderRadius: '15px',
                      padding: '20px',
                      marginBottom: '20px'
                    }}>
                      <h4 style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        marginBottom: '15px',
                        color: '#d97706'
                      }}>
                        📍 Location
                      </h4>
                      <p style={{
                        fontSize: '16px',
                        color: '#6b7280'
                      }}>
                        {hotel.address.lines?.join(', ')}<br/>
                        {hotel.address.cityName}, {hotel.address.countryCode}
                      </p>
                    </div>
                  )}

                  {hotel.countryInfo && (
                    <div style={{
                      backgroundColor: '#fef7ff',
                      border: '2px solid #d946ef',
                      borderRadius: '15px',
                      padding: '20px'
                    }}>
                      <h4 style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        marginBottom: '15px',
                        color: '#86198f'
                      }}>
                        🌍 Country Information
                      </h4>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                      }}>
                        <img
                          src={hotel.countryInfo.flag}
                          alt={hotel.countryInfo.name}
                          style={{
                            width: '60px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '5px'
                          }}
                        />
                        <div>
                          <p style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '5px'
                          }}>
                            {hotel.countryInfo.name}
                          </p>
                          <p style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginBottom: '5px'
                          }}>
                            Capital: {hotel.countryInfo.capital}
                          </p>
                          <p style={{
                            fontSize: '14px',
                            color: '#6b7280'
                          }}>
                            Currency: {hotel.countryInfo.currency}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'rooms' && (
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '25px',
                  color: '#333'
                }}>
                  Available Rooms
                </h3>
                
                {offers.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gap: '20px'
                  }}>
                    {offers.map((offer, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: '#f8f9ff',
                          border: '2px solid #e5e7ff',
                          borderRadius: '15px',
                          padding: '25px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '20px'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '10px',
                            color: '#333'
                          }}>
                            {offer.type || 'Standard Room'}
                          </h4>
                          
                          {offer.amenities && Array.isArray(offer.amenities) && (
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px',
                              marginBottom: '15px'
                            }}>
                              {offer.amenities.slice(0, 4).map((amenity, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: '12px',
                                    backgroundColor: 'white',
                                    color: '#667eea',
                                    padding: '4px 10px',
                                    borderRadius: '15px',
                                    border: '1px solid #667eea'
                                  }}
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <p style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#333',
                            margin: 0
                          }}>
                            ₹{Math.round(offer.price).toLocaleString()}
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '400',
                              color: '#666',
                              marginLeft: '8px'
                            }}>
                              per night
                            </span>
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleBooking(offer)}
                          style={{
                            padding: '15px 30px',
                            backgroundColor: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)',
                            minWidth: '150px'
                          }}
                        >
                          Book This Room
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: '#f8f9ff',
                    borderRadius: '15px',
                    border: '2px solid #e5e7ff'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏨</div>
                    <h4 style={{ color: '#333', marginBottom: '10px' }}>No rooms available</h4>
                    <p style={{ color: '#666' }}>Please try different dates or contact the hotel directly.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'amenities' && (
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '25px',
                  color: '#333'
                }}>
                  Hotel Amenities
                </h3>
                
                {hotel.amenities && Array.isArray(hotel.amenities) && hotel.amenities.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '15px'
                  }}>
                    {hotel.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: '#f8f9ff',
                          border: '2px solid #e5e7ff',
                          borderRadius: '10px',
                          padding: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#667eea',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px'
                        }}>
                          ✓
                        </div>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#333'
                        }}>
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: '#f8f9ff',
                    borderRadius: '15px',
                    border: '2px solid #e5e7ff'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏨</div>
                    <h4 style={{ color: '#333', marginBottom: '10px' }}>Amenities information not available</h4>
                    <p style={{ color: '#666' }}>Please contact the hotel for detailed amenities information.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'location' && (
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '25px',
                  color: '#333'
                }}>
                  Location & Nearby
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '30px',
                  alignItems: 'start'
                }}>
                  {hotel.address && (
                    <div style={{
                      backgroundColor: '#fef3c7',
                      border: '2px solid #f59e0b',
                      borderRadius: '15px',
                      padding: '25px'
                    }}>
                      <h4 style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        marginBottom: '15px',
                        color: '#d97706'
                      }}>
                        📍 Hotel Address
                      </h4>
                      <p style={{
                        fontSize: '16px',
                        color: '#6b7280',
                        lineHeight: '1.6'
                      }}>
                        {hotel.address.lines?.join(', ')}<br/>
                        {hotel.address.cityName}, {hotel.address.countryCode}
                      </p>
                    </div>
                  )}

                  {hotel.attractions && Array.isArray(hotel.attractions) && hotel.attractions.length > 0 && (
                    <div style={{
                      backgroundColor: '#f0fdf4',
                      border: '2px solid #16a34a',
                      borderRadius: '15px',
                      padding: '25px'
                    }}>
                      <h4 style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        marginBottom: '15px',
                        color: '#15803d'
                      }}>
                        🏛️ Top Nearby Attractions
                      </h4>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        {hotel.attractions.slice(0, 5).map((attraction, index) => (
                          <div
                            key={index}
                            style={{
                              backgroundColor: 'white',
                              padding: '15px',
                              borderRadius: '8px',
                              border: '1px solid #dcfce7'
                            }}
                          >
                            <h5 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              marginBottom: '5px',
                              color: '#15803d'
                            }}>
                              {attraction.title}
                            </h5>
                            {attraction.rating && (
                              <span style={{
                                fontSize: '12px',
                                color: '#16a34a',
                                fontWeight: '600'
                              }}>
                                ⭐ {attraction.rating}/5
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
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