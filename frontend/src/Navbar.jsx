// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (active) => ({
    color: active ? "#febb02" : "white",
    textDecoration: "none",
    margin: "0 18px",
    fontSize: "16px",
    fontWeight: active ? "bold" : "500",
    borderBottom: active ? "2px solid #febb02" : "2px solid transparent",
    paddingBottom: "4px",
    transition: "all 0.2s ease-in-out",
  });

  return (
    <nav
      style={{
        backgroundColor: "#003580",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 40px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "22px",
          fontWeight: "bold",
          letterSpacing: "0.3px",
        }}
      >
        Travel Planner ✈️
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={linkStyle(isActive("/"))}>Home</Link>
        <Link to="/flights" style={linkStyle(isActive("/flights"))}>Flights</Link>
        <Link to="/hotels" style={linkStyle(isActive("/hotels"))}>Hotels</Link>
        <Link to="/booking-lookup" style={linkStyle(isActive("/booking-lookup"))}>My Bookings</Link>

        <button
          style={{
            marginLeft: "25px",
            backgroundColor: "#febb02",
            color: "#003580",
            fontWeight: "bold",
            border: "none",
            padding: "8px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.2s ease-in-out",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#ffd43b")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#febb02")}
        >
          Sign In
        </button>
      </div>
    </nav>
  );
}
