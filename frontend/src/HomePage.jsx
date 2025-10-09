import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      
      
      {/* Hero Section */}
      <div 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "100px 20px",
          color: "white",
          textAlign: "center",
          boxShadow: "inset 0 0 0 2000px rgba(0,0,0,0.4)"
        }}
      >
        <h1 style={{ fontSize: "42px", fontWeight: "bold", marginBottom: "15px" }}>
          Find your next adventure
        </h1>
        <p style={{ fontSize: "20px", marginBottom: "40px" }}>
          Compare flights, book hotels, and plan your perfect trip
        </p>

        {/* Navigation Buttons */}
        <div>
          <Link
            to="/flights"
            style={{
              margin: "10px",
              padding: "14px 32px",
              backgroundColor: "#003580",
              color: "white",
              borderRadius: "8px",
              fontSize: "18px",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            ✈️ Search Flights
          </Link>

          <Link
            to="/hotels"
            style={{
              margin: "10px",
              padding: "14px 32px",
              backgroundColor: "#0071c2",
              color: "white",
              borderRadius: "8px",
              fontSize: "18px",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            🏨 Search Hotels
          </Link>

          <Link
            to="/booking-lookup"
            style={{
              margin: "10px",
              padding: "14px 32px",
              backgroundColor: "#febb02",
              color: "#333",
              borderRadius: "8px",
              fontSize: "18px",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            🔍 Check Booking
          </Link>
        </div>
      </div>

      {/* Feature Section */}
      <div style={{ maxWidth: "1000px", margin: "60px auto", padding: "0 20px" }}>
        <h2 style={{ color: "#003580", marginBottom: "20px", fontWeight: "bold" }}>
          Why book with Travel Planner?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Real-time Search</h3>
            <p>Instantly compare flight and hotel options from trusted providers.</p>
          </div>
          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Seamless Booking</h3>
            <p>Book flights and hotels together for a smoother travel experience.</p>
          </div>
          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Secure Payments</h3>
            <p>Pay safely using Stripe’s encrypted and verified system.</p>
          </div>
          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Manage Bookings</h3>
            <p>View, modify, or cancel your bookings anytime with ease.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#003580",
          color: "white",
          textAlign: "center",
          padding: "20px 0",
          marginTop: "40px"
        }}
      >
        <p>© {new Date().getFullYear()} Travel Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}




const featureCardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "default",
};

const featureTitleStyle = {
  color: "#0071c2",
  marginBottom: "10px",
  fontWeight: "bold",
};
