import React from "react";
import Itinerary from "./Itinerary";

// Import travel plan images
import delhiImg from "../assets/images/Delhi.jpg";
import mumImg from "../assets/images/Mumbai.jpg";
import goaImg from "../assets/images/Goa.jpeg";
import agraImg from "../assets/images/Agra.jpg";
import lehImg from "../assets/images/Leh.jpg";

// Import hotel images
import hiltonImg from "../assets/images/hilton.jpg";
import marriottImg from "../assets/images/marriott.jpeg";
import tajImg from "../assets/images/Taj.jpg";
import hyattImg from "../assets/images/hyatt.jpg";
import sheratonImg from "../assets/images/sheraton.jpg";

// Dummy user avatars for reviews
import avatar1 from "../assets/images/avatar1.jpeg";
import avatar2 from "../assets/images/avatar2.jpeg";
import avatar3 from "../assets/images/avatar3.avif";

// Data for travel plans
const popularPlans = [
  { name: "Delhi Highlights", image: delhiImg, desc: "Visit the iconic capital city of India." },
  { name: "Mumbai Bustle", image: mumImg, desc: "Explore the city that never sleeps." },
  { name: "Goa Retreat", image: goaImg, desc: "Nothing better than beaches and the sea." },
  { name: "Agra Tour", image: agraImg, desc: "Peek into historic Wonders." },
  { name: "Leh-Ladakh Experience", image: lehImg, desc: "Experience whispers of history and terrain." },
];

// Data for top hotels
const topHotels = [
  { name: "Fairmont Jaipur", image: hiltonImg },
  { name: "St Regis Goa", image: marriottImg },
  { name: "Taj Rishikesh", image: tajImg },
  { name: "Grand Hyatt", image: hyattImg },
  { name: "JW Marriott", image: sheratonImg },
];

// Dummy reviews
const reviews = [
  {
    name: "Aditi Sharma",
    location: "Delhi",
    text: "TravelMate made my Goa trip seamless! Loved the easy itinerary planner and hotel options.",
    rating: 5,
    avatar: avatar1,
  },
  {
    name: "Rohan Mehta",
    location: "Mumbai",
    text: "Great platform for booking and planning together. Very intuitive and user-friendly!",
    rating: 4,
    avatar: avatar2,
  },
  {
    name: "Sneha Iyer",
    location: "Bangalore",
    text: "I could manage flights, hotels, and my travel schedule in one place. Super convenient.",
    rating: 5,
    avatar: avatar3,
  },
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

      {/* Top Hotels Section */}
      <section className="hotels-section">
        <h3>Top Hotels</h3>
        <div className="hotels">
          {topHotels.map((hotel) => (
            <div key={hotel.name} className="hotel-card">
              <img src={hotel.image} alt={hotel.name} />
              <h4>{hotel.name}</h4>
              <p>Highest rated luxury hotels</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h3>What Our Travellers Say</h3>
        <div className="reviews">
          {reviews.map((review) => (
            <div key={review.name} className="review-card">
              <div className="review-header">
                <img src={review.avatar} alt={review.name} />
                <div>
                  <h4>{review.name}</h4>
                  <p>{review.location}</p>
                </div>
              </div>
              <p className="review-text">“{review.text}”</p>
              <div className="review-rating">
                {"⭐".repeat(review.rating)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
