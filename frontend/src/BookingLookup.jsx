import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// --- Weather Component ---
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

    if (cityCode) fetchWeather();
  }, [cityCode]);

  if (!weather) return null;

  return (
    <div
      style={{
        backgroundColor: "#e7f1ff",
        borderRadius: "8px",
        padding: "10px",
        marginTop: "15px",
        fontSize: "14px",
        color: "#003580",
      }}
    >
      <div style={{ fontWeight: "bold" }}>🌤 Weather in {weather.city}</div>
      <div>
        Temp: {weather.temperature}°C | Humidity: {weather.humidity}% | {weather.condition}
        {weather.rainfall && (
          <span style={{ marginLeft: "10px" }}>💧 Rain: {weather.rainfall}%</span>
        )}
      </div>
    </div>
  );
}

// --- Main Booking Lookup Page ---
export default function BookingLookup() {
  const [pnr, setPnr] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const lookupBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/booking/lookup/${pnr}`);
      setBooking(res.data);
    } catch (err) {
      alert("Booking not found or error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: "#003580",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 40px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          Travel Planner
        </Link>

        <div>
          <Link to="/flights" style={navLinkStyle}>Flights</Link>
          <Link to="/hotels" style={navLinkStyle}>Hotels</Link>
          <Link to="/booking-lookup" style={{ ...navLinkStyle, borderBottom: "2px solid #febb02" }}>
            My Bookings
          </Link>
        </div>

        <div>
          <button style={navButtonStyle}>Register</button>
          <button style={{ ...navButtonStyle, backgroundColor: "#febb02", color: "#003580" }}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Header Section */}
      <header
        style={{
          backgroundColor: "#0071c2",
          color: "white",
          textAlign: "center",
          padding: "40px 20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Booking Lookup</h1>
        <p>Check your flight and hotel booking details in one place</p>
      </header>

      {/* Lookup Form */}
      <main style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
        <form
          onSubmit={lookupBooking}
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#003580", marginBottom: "20px" }}>Find Your Booking</h2>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              value={pnr}
              onChange={(e) => setPnr(e.target.value.toUpperCase())}
              placeholder="Enter your PNR code"
              style={{
                flex: 1,
                padding: "12px 15px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "16px",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? "#6c757d" : "#0071c2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "12px 20px",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              {loading ? "Looking up..." : "Search"}
            </button>
          </div>
        </form>

        {/* Booking Details */}
        {booking && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              padding: "30px",
            }}
          >
            <h3 style={{ color: "#003580", marginBottom: "10px" }}>Booking Details</h3>
            <p><strong>PNR:</strong> {booking.pnr}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Payment:</strong> {booking.paymentStatus}</p>

            <h4 style={sectionTitle}>✈️ Flight Details</h4>
            <div>
              <div>{booking.flight?.departure?.iataCode} → {booking.flight?.arrival?.iataCode}</div>
              <div>Date: {booking.flight?.departure?.date}</div>
              <div>Time: {booking.flight?.departure?.time} - {booking.flight?.arrival?.time}</div>
              <div>Duration: {booking.flight?.duration}</div>
              <div>Aircraft: {booking.flight?.aircraft?.type || String(booking.flight?.aircraft) || 'Unknown'}</div>
            </div>

            <WeatherInfo cityCode={booking.flight?.arrival?.iataCode} />

            <h4 style={sectionTitle}>👤 Passenger</h4>
            {booking.passengers?.map((p, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              >
                <div>{p.firstName} {p.lastName}</div>
                <div>Email: {p.email}</div>
                <div>Phone: {p.phone}</div>
              </div>
            ))}

            {booking.selectedSeat && (
              <>
                <h4 style={sectionTitle}>💺 Seat Selection</h4>
                <p>Seat: {booking.selectedSeat.number}</p>
                <p>Type: {booking.selectedSeat.type}</p>
                <p>Price: ₹{booking.selectedSeat.price}</p>
              </>
            )}

            <h4 style={sectionTitle}>💰 Price Breakdown</h4>
            <p>Base Price: ₹{booking.flight?.inflatedPrice}</p>
            {booking.selectedSeat && <p>Seat: ₹{booking.selectedSeat.price}</p>}
            <p style={{ fontWeight: "bold", fontSize: "18px", marginTop: "10px" }}>
              Total Paid: ₹{booking.totalPrice}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#003580",
          color: "white",
          textAlign: "center",
          padding: "20px 0",
          marginTop: "40px",
        }}
      >
        © {new Date().getFullYear()} Travel Planner. All rights reserved.
      </footer>
    </div>
  );
}

// --- Reusable Styles ---
const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  margin: "0 15px",
  fontSize: "16px",
  fontWeight: "bold",
};

const navButtonStyle = {
  backgroundColor: "transparent",
  color: "white",
  border: "1px solid white",
  borderRadius: "4px",
  padding: "8px 16px",
  marginLeft: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.3s ease",
};

const sectionTitle = {
  color: "#0071c2",
  marginTop: "20px",
  marginBottom: "10px",
  fontWeight: "bold",
};
