import React from "react";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h2>Discover Your Next Adventure</h2>
          <p>
            Book flights, hotels, and create custom itineraries with TravelMate – your trusted travel companion.
          </p>
          <button>Start Planning</button>
        </div>
      </section>

      {/* Popular Travel Plans */}
      <section className="plans-section">
        <h3>Popular Travel Plans</h3>
        <div className="plans">
          {["Paris Getaway", "Bali Escape", "Swiss Alps", "New York Tour", "Tokyo Highlights"].map(
            (plan, idx) => (
              <div key={idx} className="plan-card">
                <div className="image"></div>
                <h4>{plan}</h4>
                <p>Exciting trip with top attractions.</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Top Hotels */}
      <section className="hotels-section">
        <h3>Top Hotels</h3>
        <div className="hotels">
          {["Hilton", "Marriott", "Taj", "Hyatt", "Sheraton"].map((hotel, idx) => (
            <div key={idx} className="hotel-card">
              <div className="image"></div>
              <h4>{hotel}</h4>
              <p>Luxury and comfort for your stay.</p>
              <button>Book Now</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
