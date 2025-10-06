import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import FlightsPage from "./FlightPage";
import SuccessPage from "./SuccessPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/Success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
