import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Travel Planner ✈️</h1>
      <p>
        <Link to="/" style={{ margin: "0 10px" }}>Home</Link>
        <Link to="/flights" style={{ margin: "0 10px" }}>Flights</Link>
        
      </p>
      <p>This is a landing page. Click Flights to search for flights!</p>
    </div>
  );
}
