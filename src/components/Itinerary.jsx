import React from "react";

function Itinerary() {
  const items = [
    { name: "Flight to Paris", date: "2025-12-01" },
    { name: "Hotel Check-in", date: "2025-12-01" },
    { name: "Eiffel Tower Tour", date: "2025-12-02" },
  ];

  return (
    <section className="screen-section">
      <h2>My Itinerary</h2>
      <div className="screen-cards">
        {items.map((item, idx) => (
          <div key={idx} className="screen-card">
            <h4>{item.name}</h4>
            <p>Date: {item.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Itinerary;
