import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HotelSearch() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/hotels/results', { state: searchData });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0',
      margin: '0'
    }}>
      {/* Hero Section */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '700',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Find Your Perfect Stay
        </h1>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '40px',
          opacity: '0.9'
        }}>
          Discover exceptional hotels worldwide with unbeatable prices
        </p>
      </div>

      {/* Search Form */}
      <div style={{
        maxWidth: '900px',
        margin: '-60px auto 0',
        padding: '0 20px',
        position: 'relative',
        zIndex: 10
      }}>
        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Location Input */}
            <div style={{ position: 'relative' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                📍 Destination
              </label>
              <input
                type="text"
                placeholder="Where do you want to stay?"
                value={searchData.location}
                onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            {/* Check-in Date */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                📅 Check-in
              </label>
              <input
                type="date"
                value={searchData.checkIn}
                min={today}
                onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            {/* Check-out Date */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                📅 Check-out
              </label>
              <input
                type="date"
                value={searchData.checkOut}
                min={searchData.checkIn || today}
                onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            {/* Guests */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                👥 Guests
              </label>
              <select
                value={searchData.guests}
                onChange={(e) => setSearchData({...searchData, guests: e.target.value})}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '18px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            🔍 Search Hotels
          </button>
        </form>
      </div>

      {/* Features Section */}
      <div style={{
        padding: '80px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          <div style={{
            textAlign: 'center',
            color: 'white',
            padding: '30px 20px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏨</div>
            <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Premium Hotels</h3>
            <p style={{ opacity: '0.9' }}>Handpicked luxury and boutique hotels worldwide</p>
          </div>
          <div style={{
            textAlign: 'center',
            color: 'white',
            padding: '30px 20px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💰</div>
            <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Best Prices</h3>
            <p style={{ opacity: '0.9' }}>Guaranteed lowest prices with no hidden fees</p>
          </div>
          <div style={{
            textAlign: 'center',
            color: 'white',
            padding: '30px 20px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⭐</div>
            <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Verified Reviews</h3>
            <p style={{ opacity: '0.9' }}>Real reviews from verified guests</p>
          </div>
        </div>
      </div>
    </div>
  );
}