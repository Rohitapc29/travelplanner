import React from "react";

// Import travel plan images
import parisImg from "../assets/images/paris.avif";
import baliImg from "../assets/images/bali.jpeg";
import swissImg from "../assets/images/swiss.avif";
import newYorkImg from "../assets/images/new-york.avif";
import tokyoImg from "../assets/images/tokyo.jpeg";

// Import hotel images
import hiltonImg from "../assets/images/hilton.jpg";
import marriottImg from "../assets/images/marriott.jpeg";
import tajImg from "../assets/images/Taj.jpg";
import hyattImg from "../assets/images/hyatt.jpg";
import sheratonImg from "../assets/images/sheraton.jpg";

// Data for travel plans
const popularPlans = [
  { name: "Paris Getaway", image: parisImg, desc: "Exciting trip with top attractions." },
  { name: "Bali Escape", image: baliImg, desc: "Relax and unwind in paradise." },
  { name: "Swiss Alps", image: swissImg, desc: "Adventure awaits in the mountains." },
  { name: "New York Tour", image: newYorkImg, desc: "Explore the city that never sleeps." },
  { name: "Tokyo Highlights", image: tokyoImg, desc: "Experience the blend of tradition and tech." },
];

// Data for top hotels
const topHotels = [
    { name: "Hilton", image: hiltonImg },
    { name: "Marriott", image: marriottImg },
    { name: "Taj", image: tajImg },
    { name: "Hyatt", image: hyattImg },
    { name: "Sheraton", image: sheratonImg }
];

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

      {/* Popular Travel Plans Section */}
      <section className="plans-section">
        <h3>Popular Travel Plans</h3>
        <div className="plans">
          {popularPlans.map((plan) => (
            <div key={plan.name} className="plan-card">
              <img src={plan.image} alt={plan.name} />
              <h4>{plan.name}</h4>
              <p>{plan.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Hotels Section - UPDATED */}
      <section className="hotels-section">
        <h3>Top Hotels</h3>
        <div className="hotels">
          {topHotels.map((hotel) => (
            <div key={hotel.name} className="hotel-card">
              <img src={hotel.image} alt={hotel.name} />
              <h4>{hotel.name}</h4>
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