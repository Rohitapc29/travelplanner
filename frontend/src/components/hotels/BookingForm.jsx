import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BookingForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, roomType, searchParams } = location.state;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/hotels/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotel,
          roomType,
          amount: roomType.price,
          amount: totalAmount,
          checkIn: searchParams.checkIn,
          checkOut: searchParams.checkOut,
          guests: searchParams.guests,
          ...formData
        }),
      });

      const { url } = await response.json();
      window.location = url;
    } catch (err) {
      setError('Failed to process booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const nights = Math.ceil((new Date(searchParams.checkOut) - new Date(searchParams.checkIn)) / (1000 * 60 * 60 * 24));
  const totalAmount = roomType.price * nights;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid #e5e5e5',
              color: '#667eea',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '30px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ← Back to Hotel Details
          </button>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '300',
            color: '#333',
            margin: '0 0 10px 0'
          }}>
            Complete Your Booking
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            margin: 0
          }}>
            You're just one step away from your perfect stay
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Booking Summary */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid #f0f0f0'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '2px solid #f5f5f5'
            }}>
              Booking Summary
            </h2>
            
            <div style={{
              marginBottom: '25px'
            }}>
              <img
                src={hotel.image}
                alt={hotel.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}
              />
              
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#333',
                margin: '0 0 10px 0'
              }}>
                {hotel.name}
              </h3>
              
              <p style={{
                fontSize: '16px',
                color: '#667eea',
                fontWeight: '600',
                margin: '0 0 20px 0'
              }}>
                {roomType.type}
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8f9ff',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '25px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <span style={{ color: '#666' }}>📅 Check-in</span>
                <span style={{ fontWeight: '600' }}>{searchParams.checkIn}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <span style={{ color: '#666' }}>📅 Check-out</span>
                <span style={{ fontWeight: '600' }}>{searchParams.checkOut}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <span style={{ color: '#666' }}>👥 Guests</span>
                <span style={{ fontWeight: '600' }}>{searchParams.guests}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <span style={{ color: '#666' }}>🌙 Nights</span>
                <span style={{ fontWeight: '600' }}>{nights}</span>
              </div>
            </div>

            <div style={{
              borderTop: '2px solid #f5f5f5',
              paddingTop: '20px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{ color: '#666' }}>Room rate per night</span>
                <span>₹{roomType.price.toLocaleString()}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px',
                fontSize: '18px',
                fontWeight: '700',
                color: '#333'
              }}>
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid #f0f0f0'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '2px solid #f5f5f5'
            }}>
              Guest Information
            </h2>

            {error && (
              <div style={{
                backgroundColor: '#ffeaea',
                color: '#d63384',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '25px',
                border: '1px solid #f5c2c7'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '2px solid #e5e5e5',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                    required
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '2px solid #e5e5e5',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid #e5e5e5',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                  required
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid #e5e5e5',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '18px',
                  backgroundColor: loading ? '#94a3b8' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 10px 20px rgba(102, 126, 234, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#5a67d8';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#667eea';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {loading ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Processing...
                  </div>
                ) : (
                  `Proceed to Payment - ₹${totalAmount.toLocaleString()}`
                )}
              </button>

              <p style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#888',
                marginTop: '20px',
                lineHeight: '1.5'
              }}>
                🔒 Your payment is secured by Stripe. You will be redirected to complete your payment safely.
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .booking-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}