import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
      <h1>Welcome to Travel Planner ✈️</h1>
      
      <div style={{ marginBottom: "30px" }}>
        <Link to="/flights" style={{ 
          display: "inline-block",
          margin: "10px", 
          padding: "15px 30px",
          backgroundColor: "#007bff",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "18px"
        }}>
          Search Flights
        </Link>

        <Link to="/hotels" style={{ 
          display: "inline-block",
          margin: "10px", 
          padding: "15px 30px",
          backgroundColor: "#28a745",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "18px"
        }}>
          Search Hotels
        </Link>
        
        <Link to="/booking-lookup" style={{ 
          display: "inline-block",
          margin: "10px", 
          padding: "15px 30px",
          backgroundColor: "#6c757d",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "18px"
        }}>
          Check Booking
        </Link>
      </div>
      
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "left" }}>
        <h3>Features:</h3>
        <ul style={{ fontSize: "16px", lineHeight: "1.6" }}>
          <li>Search flights and hotels with real-time data</li>
          <li>Complete booking flow with passenger details</li>
          <li>Secure payment processing with Stripe</li>
          <li>Booking confirmation and management</li>
        </ul>
      </div>
    </div>
  );
}
