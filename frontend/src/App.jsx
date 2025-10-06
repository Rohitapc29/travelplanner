import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FlightsPage from "./FlightPage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header style={{ padding: "10px", backgroundColor: "#f4f4f4" }}>
          <nav style={{ display: "flex", gap: "10px" }}>
            <Link to="/">Home</Link>
            <Link to="/flights">Flights</Link>
            <Link to="/about">About</Link>
            {/* 👉 Other teammates can add their nav links here */}
          </nav>
        </header>

        <main style={{ padding: "20px" }}>
          <Routes>
  {/* Only include existing components */}
  <Route path="/flights" element={<FlightsPage />} />

  {/* Comment out or remove these until you create them */}
  {/* <Route path="/" element={<HomePage />} />
  <Route path="/flights/seats" element={<SeatSelection />} />
  <Route path="/flights/payment" element={<PaymentPage />} />
  <Route path="/about" element={<AboutPage />} /> */}
</Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


/*function App() {

  return (
    <>
      <h1>Frontend is running</h1>
    </>
  )
}

export default App*/
