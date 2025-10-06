import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherInfo({ cityCode }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/weather/${cityCode}`);
        setWeather(res.data);
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      }
    };
    
    if (cityCode) {
      fetchWeather();
    }
  }, [cityCode]);

  if (!weather) return null;

  return (
    <div style={{ 
      padding: "8px", 
      backgroundColor: "#f0f8ff", 
      borderRadius: "4px",
      marginTop: "10px",
      fontSize: "12px"
    }}>
      <div>
        <span>🌡️ {weather.city}: {weather.temperature}°C</span>
        <span style={{ marginLeft: "15px" }}>Humidity: {weather.humidity}%</span>
      </div>
      <div style={{ marginTop: "4px" }}>
        <span>{weather.condition}</span>
        {weather.rainfall && <span style={{ marginLeft: "15px" }}>Chance of rain: {weather.rainfall}%</span>}
      </div>
    </div>
  );
}

export default function BookingLookup() {
  const [pnr, setPnr] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const lookupBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/booking/lookup/${pnr}`);
      setBooking(res.data);
    } catch (err) {
      alert('Booking not found or error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Booking Lookup</h2>
      
      <form onSubmit={lookupBooking} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={pnr}
          onChange={(e) => setPnr(e.target.value.toUpperCase())}
          placeholder="Enter PNR"
          style={{ padding: 8, marginRight: 10 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Looking up...' : 'Look up'}
        </button>
      </form>

      {booking && (
        <div style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
          <h3>Booking Details</h3>
          <div>PNR: {booking.pnr}</div>
          <div>Status: {booking.status}</div>
          <div>Payment Status: {booking.paymentStatus}</div>
          
          <h4>Flight Details</h4>
          <div>
            {booking.flight?.departure?.iataCode} → {booking.flight?.arrival?.iataCode}
          </div>
          <div>Date: {booking.flight?.departure?.date}</div>
          <div>Time: {booking.flight?.departure?.time} - {booking.flight?.arrival?.time}</div>
          <div>Duration: {booking.flight?.duration}</div>
          <div>Aircraft: {booking.flight?.aircraft?.type || String(booking.flight?.aircraft) || 'Unknown'}</div>
          
          <WeatherInfo cityCode={booking.flight?.arrival?.iataCode} />
          
          <h4>Passenger</h4>
          {booking.passengers?.map((passenger, index) => (
            <div key={index}>
              <div>{passenger.firstName} {passenger.lastName}</div>
              <div>Email: {passenger.email}</div>
              <div>Phone: {passenger.phone}</div>
            </div>
          ))}
          
          {booking.selectedSeat && (
            <div>
              <h4>Seat Selection</h4>
              <div>Seat: {booking.selectedSeat.number}</div>
              <div>Type: {booking.selectedSeat.type}</div>
              <div>Price: ₹{booking.selectedSeat.price}</div>
            </div>
          )}
          
          <div style={{ marginTop: 20 }}>
            <h4>Price Breakdown</h4>
            <div>Base Price: ₹{booking.flight?.inflatedPrice}</div>
            {booking.selectedSeat && <div>Seat: ₹{booking.selectedSeat.price}</div>}
            <div style={{ fontWeight: 'bold', marginTop: 10 }}>
              <strong>Total Paid: ₹{booking.totalPrice}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}