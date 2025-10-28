import React from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import FlightPage from "./FlightPage";
import SuccessPage from "./SuccessPage";
import BookingLookup from "./BookingLookup";
import HotelSearch from "./components/hotels/HotelSearch";
import HotelList from "./components/hotels/HotelList";
import HotelDetail from "./components/hotels/HotelDetail";
import BookingForm from "./components/hotels/BookingForm";

function AppFlightHotel({ navigateToMainApp }) {
  return (
    <Router>
      <div>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "14px 40px",
            backgroundColor: "#003580", // Booking.com deep blue
            borderBottom: "2px solid #00224f",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
          }}
        >
          {[
            { href: "/", label: "Home", isMainHome: true },
            { href: "/flights", label: "Search Flights" },
            { href: "/booking-lookup", label: "Booking Lookup" },
            { href: "/hotels", label: "Hotel Search" },
          ].map((link, index) =>
            link.isMainHome ? (
              <button
                key={index}
                onClick={() => navigateToMainApp("home")} 
                style={{
                  color: "white",
                  textDecoration: "none",
                  marginRight: "25px",
                  fontSize: "16px",
                  fontWeight: "500",
                  padding: "6px 0",
                  borderBottom: "2px solid transparent",
                  transition: "all 0.2s ease-in-out",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.target.style.color = "#febb02";
                  e.target.style.borderBottom = "2px solid #febb02";
                }}
                onMouseOut={(e) => {
                  e.target.style.color = "white";
                  e.target.style.borderBottom = "2px solid transparent";
                }}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={index}
                to={link.href}
                style={{
                  color: "white",
                  textDecoration: "none",
                  marginRight: "25px",
                  fontSize: "16px",
                  fontWeight: "500",
                  padding: "6px 0",
                  borderBottom: "2px solid transparent",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseOver={(e) => {
                  e.target.style.color = "#febb02"; 
                  e.target.style.borderBottom = "2px solid #febb02";
                }}
                onMouseOut={(e) => {
                  e.target.style.color = "white";
                  e.target.style.borderBottom = "2px solid transparent";
                }}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <Routes>
          <Route path="/flights" element={<FlightPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/booking-lookup" element={<BookingLookup />} />
          <Route path="/hotels" element={<HotelSearch />} />
          <Route path="/hotels/results" element={<HotelList />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/hotels/:id/booking" element={<BookingForm />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppFlightHotel;
