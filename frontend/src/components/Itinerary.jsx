import React, { useState, useEffect } from "react";
import "./Itinerary.css";

function Itinerary() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all cities on component mount
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      // CHANGE PORT FROM 5000 TO 4000
      const response = await fetch('http://localhost:4000/api/premade/cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCityDetails = async (cityName) => {
    try {
      // CHANGE PORT FROM 5000 TO 4000
      const response = await fetch(`http://localhost:4000/api/premade/city/${cityName}`);
      const data = await response.json();
      setSelectedCity(data);
    } catch (error) {
      console.error('Error fetching city details:', error);
    }
  };

  const savePremadePlan = async (cityName, plan) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.email) {
        alert('Please login to save plans');
        return;
      }
      
      const response = await fetch('http://localhost:4000/api/premade/save-premade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cityName: cityName,
          planId: plan.id,
          userEmail: user.email
        })
      });
      
      if (response.ok) {
        alert('✅ Plan saved to My Plans!');
      } else {
        alert('❌ Failed to save plan');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('❌ Failed to save plan');
    }
  };

  const downloadPDF = (plan, cityName) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isPremium = user.subscriptionStatus === 'premium';
    
    if (!isPremium) {
      alert('🔒 PDF Download is a Premium feature! Upgrade to download your itineraries.');
      return;
    }
    
    // Create PDF content
    let pdfContent = `
      ${plan.name}
      ${cityName} - ${plan.days} Days
      Cost: ${plan.cost}
      Type: ${plan.type}
      
      HIGHLIGHTS:
      ${plan.highlights.map(h => `• ${h}`).join('\n')}
      
      DETAILED ITINERARY:
      ${plan.details.map(day => `
      DAY ${day.day}: ${day.title}
      ${day.activities.map(activity => `  ✓ ${activity}`).join('\n')}
      
      Meals: ${day.meals.join(', ')}
      Accommodation: ${day.accommodation}
      `).join('\n')}
      
      INCLUDES: ${plan.includes.join(', ')}
      EXCLUDES: ${plan.excludes.join(', ')}
      BEST TIME: ${plan.bestTime}
      DIFFICULTY: ${plan.difficulty}
    `;
    
    // Create and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cityName}-${plan.days}day-itinerary.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert('📄 Itinerary downloaded! (Premium feature)');
  };

  if (loading) {
    return <div className="loading">🔄 Loading amazing destinations...</div>;
  }

  // If viewing specific plan details
  if (selectedPlan) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isPremium = user.subscriptionStatus === 'premium';

    return (
      <div className="plan-detail-view">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => setSelectedPlan(null)}
            className="back-btn"
          >
            ← Back to {selectedCity.cityName}
          </button>
          
          <button 
            onClick={() => downloadPDF(selectedPlan, selectedCity.cityName)}
            style={{
              background: isPremium ? 'linear-gradient(45deg, #gold, #orange)' : '#ccc',
              color: isPremium ? 'white' : '#666',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: isPremium ? 'pointer' : 'not-allowed',
              fontWeight: 'bold'
            }}
            title={isPremium ? 'Download PDF' : 'Premium feature - Upgrade to download'}
          >
            {isPremium ? '📄 Download PDF' : '🔒 Download PDF (Premium)'}
          </button>
        </div>
        
        <div className="plan-header">
          <h1>{selectedPlan.name}</h1>
          <div className="plan-meta">
            <span className="cost">{selectedPlan.cost}</span>
            <span className="days">{selectedPlan.days} days</span>
            <span className="type">{selectedPlan.type}</span>
          </div>
        </div>

        <div className="plan-highlights">
          <h3>✨ Highlights</h3>
          <div className="highlights-grid">
            {selectedPlan.highlights.map((highlight, index) => (
              <span key={index} className="highlight-tag">{highlight}</span>
            ))}
          </div>
        </div>

        <div className="plan-details">
          {selectedPlan.details.map((day, index) => (
            <div key={index} className="day-card">
              <h3>Day {day.day}: {day.title}</h3>
              <div className="activities">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="activity">{activity}</div>
                ))}
              </div>
              <div className="day-info">
                <div><strong>Meals:</strong> {day.meals.join(', ')}</div>
                <div><strong>Stay:</strong> {day.accommodation}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="plan-info">
          <div className="info-section">
            <h4>🗓️ Best Time to Visit</h4>
            <p>{selectedPlan.bestTime}</p>
          </div>
          <div className="info-section">
            <h4>📊 Difficulty Level</h4>
            <p>{selectedPlan.difficulty}</p>
          </div>
          <div className="info-section">
            <h4>✅ Includes</h4>
            <ul>
              {selectedPlan.includes.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="info-section">
            <h4>❌ Excludes</h4>
            <ul>
              {selectedPlan.excludes.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // If viewing city details
  if (selectedCity) {
    return (
      <div className="city-detail-view">
        <button 
          onClick={() => setSelectedCity(null)}
          className="back-btn"
        >
          ← Back to Cities
        </button>
        
        <div className="city-header">
          <img src={selectedCity.cityImage} alt={selectedCity.cityName} className="city-hero" />
          <div className="city-info">
            <h1>{selectedCity.cityName}</h1>
            <p>{selectedCity.description}</p>
          </div>
        </div>

        <div className="plans-grid">
          {selectedCity.plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <div className="plan-header-card">
                <h3>{plan.name}</h3>
                <div className="plan-tags">
                  <span className="cost-tag">{plan.cost}</span>
                  <span className="days-tag">{plan.days} days</span>
                </div>
              </div>
              
              <div className="plan-type">{plan.type}</div>
              
              <div className="plan-highlights-preview">
                {plan.highlights.slice(0, 3).map((highlight, index) => (
                  <span key={index} className="highlight-mini">{highlight}</span>
                ))}
                {plan.highlights.length > 3 && <span className="more">+{plan.highlights.length - 3} more</span>}
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  savePremadePlan(selectedCity.cityName, plan);
                }}
                className="save-plan-btn"
                style={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ee5a6f)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                💾 Save Plan
              </button>

              <button 
                onClick={() => setSelectedPlan(plan)}
                className="view-details-btn"
              >
                View Full Itinerary →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main cities grid view
  return (
    <div className="screen-section">
      <div className="itinerary-header">
        <h1>🌍 Discover Amazing Destinations</h1>
        <p>Choose your next adventure from our curated travel experiences</p>
      </div>

      {/* ADD THIS CUSTOM PLANNER SECTION */}
      <div className="custom-planner-section" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '40px',
        color: 'white'
      }}>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '2rem' }}>
          🛠️ Create Your Custom Itinerary
        </h2>
        <p style={{ margin: '0 0 25px 0', fontSize: '1.1rem', opacity: '0.9' }}>
          Plan your perfect trip with our drag-and-drop itinerary builder
        </p>
        <button 
          onClick={() => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const isPremium = user.isPremium || user.subscriptionStatus === 'premium';
            
            if (!isPremium) {
              // Redirect to premium page instead of planner
              window.location.hash = 'premium';
            } else {
              window.location.hash = 'planner';
            }
          }}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          🚀 Start Planning Now
        </button>
      </div>

      <div className="cities-grid">
        {cities.map((city) => (
          <div 
            key={city._id} 
            className="city-card"
            onClick={() => fetchCityDetails(city.cityName)}
          >
            <div className="city-image">
              <img src={city.cityImage} alt={city.cityName} />
            </div>
            <div className="city-content">
              <h3>{city.cityName}</h3>
              <p>{city.description}</p>
              <button className="explore-btn">Explore Plans →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Itinerary;
