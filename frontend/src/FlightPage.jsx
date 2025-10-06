import React, { useState } from "react";
import axios from "axios";

export default function FlightPage() {
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    date: "",
    travelClass: "ECONOMY",
    airline: "",
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setFilters({ ...filters, [key]: value });

  const searchFlights = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/flights", {
        params: filters,
      });
      setFlights(res.data);
    } catch (err) {
      alert("Error fetching flights. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
const handleBook = async (flight) => {
  try {
    const res = await axios.post("http://localhost:4000/api/create-checkout-session", flight);
    window.location.href = res.data.url; // redirect to Stripe checkout
  } catch (err) {
    console.error("Booking error:", err);
    alert("Failed to start payment");
  }
};


  return (
    <div style={{ padding: 20 }}>
      <h2>Search Flights ✈️</h2>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <input
          placeholder="Origin (e.g., BOM)"
          value={filters.origin}
          onChange={(e) => update("origin", e.target.value.toUpperCase())}
        />
        <input
          placeholder="Destination (e.g., DEL)"
          value={filters.destination}
          onChange={(e) => update("destination", e.target.value.toUpperCase())}
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => update("date", e.target.value)}
        />
        <select
          value={filters.travelClass}
          onChange={(e) => update("travelClass", e.target.value)}
        >
          <option value="ECONOMY">Economy</option>
          <option value="BUSINESS">Business</option>
          <option value="FIRST">First</option>
        </select>
        <input
          placeholder="Airline Code (optional)"
          value={filters.airline}
          onChange={(e) => update("airline", e.target.value.toUpperCase())}
        />
        <button onClick={searchFlights} disabled={loading}>
          {loading ? "Searching..." : "Search Flights"}
        </button>
      </div>

      <hr />

      {flights.length > 0 ? (
        flights.map((f) => (
          <div key={f.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <strong>{f.airline}</strong> — {f.departure} → {f.arrival}
            <div>Duration: {f.duration}</div>
            <div>
              <b>₹{f.inflatedPrice}</b> <small>(includes commission)</small>
            </div>
         <button onClick={() => handleBook(f)}>Book Now</button>

          </div>
        ))
      ) : (
        <p>No flights yet. Try searching.</p>
      )}
    </div>
  );
}
