import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const pnr = params.get('pnr');
        const status = params.get('status');
        
        if (!pnr) {
          setError('No booking reference found');
          setLoading(false);
          return;
        }
        
        
        const response = await fetch(`http://localhost:4000/api/booking/lookup/${pnr}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        
        const data = await response.json();
        setBooking(data.booking);
        setError(null);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [location]);
  
  if (loading) {
    return (
      <div className="success-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">✅</div>
        <h1>Booking Confirmed!</h1>
        
        {booking ? (
          <div className="booking-details">
            <p className="pnr">Booking Reference (PNR): <strong>{booking.pnr}</strong></p>
            <div className="flight-info">
              <h3>{booking.flight.airlineName} {booking.flight.flightNumber}</h3>
              <div className="route">
                <div className="departure">
                  <p className="city">{booking.flight.departure.iataCode}</p>
                  <p className="time">{booking.flight.departure.time}</p>
                  <p className="date">{booking.flight.departure.date}</p>
                </div>
                <div className="flight-path">
                  <div className="line"></div>
                  <div className="airplane">✈</div>
                </div>
                <div className="arrival">
                  <p className="city">{booking.flight.arrival.iataCode}</p>
                  <p className="time">{booking.flight.arrival.time}</p>
                  <p className="date">{booking.flight.arrival.date}</p>
                </div>
              </div>
            </div>
            
            <div className="passenger-info">
              <h3>Passenger Information</h3>
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="passenger">
                  <p>{passenger.firstName} {passenger.lastName}</p>
                </div>
              ))}
            </div>
            
            <div className="price-info">
              <h3>Price</h3>
              <p className="price">₹{booking.flight.inflatedPrice}</p>
            </div>
            
            <div className="actions">
              <button className="print-button" onClick={() => window.print()}>
                Print E-Ticket
              </button>
              <button className="home-button" onClick={() => navigate('/')}>
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="error-message">
            <p>{error || "We couldn't find your booking details."}</p>
            <p>Your payment has been processed successfully.</p>
            <button className="home-button" onClick={() => navigate('/')}>
              Return to Home
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .success-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .success-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 800px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          text-align: center;
        }
        
        .success-icon {
          font-size: 60px;
          margin-bottom: 20px;
        }
        
        h1 {
          color: #333;
          margin-bottom: 30px;
        }
        
        .pnr {
          font-size: 18px;
          background: #f8f9ff;
          padding: 15px;
          border-radius: 10px;
          border: 1px dashed #667eea;
          margin-bottom: 30px;
        }
        
        .flight-info {
          margin-bottom: 30px;
        }
        
        .route {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
        }
        
        .flight-path {
          flex: 1;
          position: relative;
          height: 2px;
          background: #ddd;
          margin: 0 20px;
        }
        
        .airplane {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 20px;
        }
        
        .departure, .arrival {
          text-align: center;
        }
        
        .city {
          font-size: 20px;
          font-weight: bold;
        }
        
        .time {
          font-size: 18px;
        }
        
        .date {
          font-size: 14px;
          color: #666;
        }
        
        .passenger-info, .price-info {
          margin-bottom: 30px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 10px;
          text-align: left;
        }
        
        .price {
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
        }
        
        .actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }
        
        button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .print-button {
          background: #667eea;
          color: white;
        }
        
        .home-button {
          background: #f8f9ff;
          color: #667eea;
          border: 1px solid #667eea;
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 10px rgba(0,0,0,0.1);
        }
        
        .loading-container {
          text-align: center;
          padding: 40px;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-message {
          color: #666;
        }
      `}</style>
    </div>
  );
}