import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import FlightPage from "./FlightPage";
import SuccessPage from "./SuccessPage";
import BookingLookup from "./BookingLookup";

function App() {
  return (
    <Router>
      <div>
        <nav
          style={{
            padding: "10px 20px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #ddd",
            marginBottom: "20px",
          }}
        >
          <a
            href="/"
            style={{
              marginRight: "20px",
              textDecoration: "none",
            }}
          >
            Home
          </a>
          <a
            href="/flights"
            style={{
              marginRight: "20px",
              textDecoration: "none",
            }}
          >
            Search Flights
          </a>
          <a
            href="/booking-lookup"
            style={{
              marginRight: "20px",
              textDecoration: "none",
            }}
          >
            Booking Lookup
          </a>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flights" element={<FlightPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/booking-lookup" element={<BookingLookup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
