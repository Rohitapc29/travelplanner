import React, { useState } from "react";
import "./Itinerary.css";
import ItineraryPlanner from "./ItineraryPlanner";
import PremiumGate from "./PremiumGate";

const destinations = [
  { id: 1, name: "Goa", image: "https://seoimgak.mmtcdn.com/blog/sites/default/files/goa-quick-guide.jpg" },
  { id: 2, name: "Jaipur", image: "https://hldak.mmtcdn.com/prod-s3-hld-hpcmsadmin/holidays/images/cities/3769/Marvellous%20doorways%20in%20Amer%20Fort.jpg?downsize=328:200" },
  { id: 3, name: "Kerala", image: "https://seoimgak.mmtcdn.com/blog/sites/default/files/kerala-handy-travel-guide.jpg" },
  { id: 4, name: "Agra", image: "https://hblimg.mmtcdn.com/content/hubble/img/agra/mmt/activities/m_activities-agra-taj-mahal_l_400_640.jpg" },
  { id: 5, name: "Manali", image: "https://seoimgak.mmtcdn.com/blog/sites/default/files/images/manali-High-mountain-road.jpg" },
  { id: 6, name: "Delhi", image: "https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/activities/m_Delhi_shutterjulimg_1_l_1058_1590.jpg" },
  { id: 7, name: "Mumbai", image: "https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/destination/m_mumbai_main_tv_destination_img_1_l_848_1272.jpg" },
  { id: 8, name: "Udaipur", image: "https://hldak.mmtcdn.com/prod-s3-hld-hpcmsadmin/holidays/images/cities/1325/Udaipur3.jpg?downsize=328:200" },
];

// Pre-made itineraries data
const itinerariesData = {
  Goa: [
    { 
      id: 1, 
      name: "🏖️ Beach Paradise", 
      days: 4, 
      cost: "₹12,000",
      type: "Beach & Relaxation",
      details: [
        { day: 1, title: "Arrival & Baga Beach", activities: ["Check-in hotel", "Baga Beach sunset", "Beach shack dinner"] },
        { day: 2, title: "North Goa Exploration", activities: ["Anjuna Beach", "Chapora Fort", "Saturday Night Market"] },
        { day: 3, title: "Water Sports & Adventure", activities: ["Parasailing at Calangute", "Jet skiing", "Dolphin spotting cruise"] },
        { day: 4, title: "Old Goa Heritage", activities: ["Basilica of Bom Jesus", "Se Cathedral", "Departure"] }
      ]
    }
  ],
  Jaipur: [
    { 
      id: 1, 
      name: "👑 Royal Heritage Tour", 
      days: 3, 
      cost: "₹15,000",
      type: "Heritage & Culture",
      details: [
        { day: 1, title: "Pink City Landmarks", activities: ["Hawa Mahal", "City Palace", "Jantar Mantar", "Local Rajasthani dinner"] },
        { day: 2, title: "Amber Fort & Hills", activities: ["Amber Fort elephant ride", "Jaigarh Fort", "Nahargarh Fort sunset"] },
        { day: 3, title: "Culture & Shopping", activities: ["Albert Hall Museum", "Johari Bazaar shopping", "Block printing workshop"] }
      ]
    }
  ],
  Delhi: [
    { 
      id: 1, 
      name: "🏛️ Historical Delhi", 
      days: 3, 
      cost: "₹10,000",
      type: "Heritage & History",
      details: [
        { day: 1, title: "Old Delhi Exploration", activities: ["Red Fort", "Jama Masjid", "Chandni Chowk food walk", "Rickshaw ride"] },
        { day: 2, title: "New Delhi Monuments", activities: ["India Gate", "Rashtrapati Bhavan", "Qutub Minar", "Lotus Temple"] },
        { day: 3, title: "Modern Delhi", activities: ["Akshardham Temple", "Connaught Place shopping", "Khan Market", "Cultural evening"] }
      ]
    }
  ]
  // Add more destinations as needed...
};

function Itinerary() {
  const [search, setSearch] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [showPlanner, setShowPlanner] = useState(false);
  const [savingItinerary, setSavingItinerary] = useState(false);

  // 🚀 GET USER PREMIUM STATUS
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPremium = user?.isPremium || false;
  const isLoggedIn = user && user.email;

  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🚀 PREMIUM CHECK FOR CUSTOM PLANNER
  const handleCreateCustom = () => {
    if (!isLoggedIn) {
      alert('Please log in to access this feature');
      return;
    }
    
    if (!isPremium) {
      // Show premium upgrade prompt instead of opening planner
      return; // Don't set showPlanner = true
    }
    
    setShowPlanner(true);
  };

  // Save pre-made itinerary function (FREE for all users)
  const saveItinerary = async (itinerary) => {
    if (!isLoggedIn) {
      alert('Please log in to save itineraries');
      return;
    }

    setSavingItinerary(true);
    try {
      const planData = {
        destination: selectedDestination,
        numDays: itinerary.days,
        schedule: itinerary.details.map(day => ({
          attractions: day.activities.map((activity, index) => ({
            name: activity,
            description: `Day ${day.day} activity`,
            thumbnail: null,
            suggestedDuration: 2,
            category: 'activity',
            coordinates: null,
            startTime: `${8 + index * 2}:00`,
            endTime: `${10 + index * 2}:00`
          }))
        })),
        thumbnail: null,
        isPremade: true,
        originalCost: itinerary.cost,
        itineraryType: itinerary.type
      };

      const { savePlan } = await import('../services/plannerAPI');
      await savePlan(planData);
      
      alert('✅ Itinerary saved successfully! Check "My Plans" to view.');
      setSelectedItinerary(null);
      setSelectedDestination(null);
    } catch (error) {
      console.error('Error saving itinerary:', error);
      alert('❌ Failed to save itinerary. Please try again.');
    } finally {
      setSavingItinerary(false);
    }
  };

  // If planner mode and user is premium, render ItineraryPlanner
  if (showPlanner && isPremium) {
    return (
      <ItineraryPlanner onBack={() => setShowPlanner(false)} />
    );
  }

  return (
    <div className="screen-section">
      {/* Header with Premium Status */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        color: 'white'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>✈️ Travel Itineraries</h1>
        <p style={{ margin: '0 0 15px 0', fontSize: '1.2rem', opacity: 0.9 }}>
          Discover amazing travel plans for your next adventure
        </p>
        
        {/* User Status Display */}
        {isLoggedIn ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '8px 16px', 
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              👤 Welcome, {user.name}
            </span>
            <span style={{ 
              background: isPremium ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.2)', 
              padding: '8px 16px', 
              borderRadius: '20px',
              fontSize: '14px',
              border: isPremium ? '2px solid gold' : 'none'
            }}>
              {isPremium ? '⭐ Premium User' : '🆓 Free User'}
            </span>
          </div>
        ) : (
          <p style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '10px 20px', 
            borderRadius: '20px',
            display: 'inline-block',
            margin: 0
          }}>
            🔐 Log in to save itineraries and access premium features
          </p>
        )}
      </div>

      {/* Search Bar + Create Button */}
      <div className="search-bar big">
        <input
          type="text"
          placeholder="Search your travel destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button 
          className="flashy-btn" 
          onClick={handleCreateCustom}
          style={{
            background: isPremium ? 'linear-gradient(45deg, #28a745, #20c997)' : 'linear-gradient(45deg, #667eea, #764ba2)',
            position: 'relative'
          }}
        >
          {!isPremium && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#ff4757',
              color: 'white',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: 'bold'
            }}>
              PRO
            </span>
          )}
          ✨ {isPremium ? 'Create Custom Plan' : 'Create Custom (Premium)'}
        </button>
      </div>

      {/* 🚀 PREMIUM GATE FOR CUSTOM PLANNER */}
      {!isPremium && (
        <PremiumGate 
          feature="Custom Itinerary Builder - Create personalized travel plans with drag-drop interface"
          fallback={
            <div style={{
              background: 'linear-gradient(45deg, #fff9c4, #ffffff)',
              border: '2px solid #ffc107',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              margin: '20px 0'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
              <h3 style={{ color: '#856404', marginBottom: '12px' }}>
                Unlock Custom Itinerary Builder
              </h3>
              <p style={{ color: '#664d03', marginBottom: '16px' }}>
                Create personalized travel plans with our advanced drag-drop interface. Available for Premium users only.
              </p>
              <div style={{ marginBottom: '20px' }}>
                <strong style={{ color: '#856404' }}>Premium Features:</strong>
                <ul style={{ textAlign: 'left', color: '#664d03', marginTop: '8px', maxWidth: '400px', margin: '8px auto 0' }}>
                  <li>✅ Unlimited custom itineraries</li>
                  <li>✅ Drag-drop itinerary builder</li>
                  <li>✅ All destinations worldwide</li>
                  <li>✅ Real-time weather & attractions</li>
                  <li>✅ PDF export & sharing</li>
                </ul>
              </div>
              <button
                onClick={() => window.location.hash = '#premium'}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🚀 Upgrade to Premium - ₹499/month
              </button>
            </div>
          }
        />
      )}

      {/* Free vs Premium Features Comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        margin: '20px 0',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '12px'
      }}>
        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '10px',
          border: '2px solid #e9ecef'
        }}>
          <h3 style={{ color: '#28a745', margin: '0 0 15px 0' }}>🆓 Free Features</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
            <li>Browse pre-made itineraries</li>
            <li>Save favorite travel plans</li>
            <li>View detailed day-by-day schedules</li>
            <li>Flight & hotel bookings</li>
          </ul>
        </div>
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          borderRadius: '10px',
          border: '2px solid #FFD700'
        }}>
          <h3 style={{ color: '#fff', margin: '0 0 15px 0' }}>⭐ Premium Features</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#fff' }}>
            <li><strong>Create unlimited custom itineraries</strong></li>
            <li><strong>Drag & drop planning interface</strong></li>
            <li><strong>All destinations worldwide</strong></li>
            <li><strong>PDF export & sharing</strong></li>
            <li><strong>Priority customer support</strong></li>
          </ul>
        </div>
      </div>

      {/* Destination Grid - FREE ACCESS */}
      <div className="destination-grid">
        {filteredDestinations.map((d) => (
          <div
            key={d.id}
            className="destination-card"
            onClick={() => setSelectedDestination(d.name)}
          >
            <img src={d.image} alt={d.name} />
            <h3>{d.name}</h3>
          </div>
        ))}
      </div>

      {/* Pre-made Itineraries Display - FREE ACCESS */}
      {selectedDestination && (
        <div className="itinerary-section">
          <h2>Pre-made Itineraries for {selectedDestination}</h2>
          <div className="itinerary-grid">
            {itinerariesData[selectedDestination]?.map((itinerary) => (
              <div key={itinerary.id} className="itinerary-card">
                <h3>{itinerary.name}</h3>
                <div className="itinerary-meta">
                  <span>📅 {itinerary.days} days</span>
                  <span>💰 {itinerary.cost}</span>
                  <span>🎯 {itinerary.type}</span>
                </div>
                <div className="itinerary-details">
                  {itinerary.details.map((day, dayIndex) => (
                    <div key={dayIndex} className="day-schedule">
                      <h4>Day {day.day}: {day.title}</h4>
                      <ul>
                        {day.activities.map((activity, actIndex) => (
                          <li key={actIndex}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => saveItinerary(itinerary)}
                  disabled={savingItinerary}
                  className="save-btn"
                >
                  {savingItinerary ? '⏳ Saving...' : '💾 Save This Plan'}
                </button>
              </div>
            )) || (
              <p>No pre-made itineraries available for this destination yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Itinerary;
