import React, { useState, useEffect } from "react";
import { getPlans } from "../services/plannerAPI";
import "./MyPlans.css";

function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const fetchedPlans = await getPlans();
        console.log("Fetched plans:", fetchedPlans); 
        setPlans(fetchedPlans);
        setLoading(false);
      } catch (error) {
        console.error("Error loading plans:", error);
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  const handlePlanSelect = (plan) => {
    console.log("Selected plan details:", plan); 
    setSelectedPlan(plan);
  };

  const ItineraryModal = ({ plan, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="itinerary-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>
          {plan.destination} - {plan.numDays} Days
        </h2>

        <div className="itinerary-content">
          {plan.schedule && Array.isArray(plan.schedule) ? (
            plan.schedule.map((day, dayIndex) => (
              <div key={dayIndex} className="day-schedule">
                <h3>Day {dayIndex + 1}</h3>
                <div className="attractions-list">
                  {day.attractions && Array.isArray(day.attractions) ? (
                    day.attractions
                      .sort((a, b) => {
                        // Sort by start time
                        const timeA = parseInt(a.startTime.split(":")[0]);
                        const timeB = parseInt(b.startTime.split(":")[0]);
                        return timeA - timeB;
                      })
                      .map((attraction, idx) => (
                        <div key={idx} className="attraction-item">
                          <img
                            src={attraction.thumbnail || "/placeholder.jpg"}
                            alt={attraction.name}
                          />
                          <div className="attraction-details">
                            <h4>{attraction.name || "Attraction"}</h4>
                            <p>
                              {attraction.description ||
                                "No description available"}
                            </p>
                            <div className="attraction-meta">
                              <span className="duration">
                                ⏱️ Duration: {attraction.suggestedDuration}h
                              </span>
                              <span className="timing">
                                🕒 {attraction.startTime} -{" "}
                                {attraction.endTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p>No attractions added for this day</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-schedule">
              <p>No itinerary details available for this plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="plans-section">
      <h2>My Travel Plans</h2>

      {loading ? (
        <div className="loading">Loading your plans...</div>
      ) : plans.length === 0 ? (
        <div className="no-plans">
          <p>No plans saved yet. Start planning your next adventure! 🌎</p>
        </div>
      ) : (
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan._id} className="plan-card">
              {plan.thumbnail ? (
                <img
                  src={plan.thumbnail}
                  alt={plan.destination}
                  className="plan-thumbnail"
                />
              ) : (
                <div className="plan-thumbnail placeholder">
                  <span>📍 {plan.destination}</span>
                </div>
              )}

              <div className="plan-content">
                <h3>{plan.destination}</h3>
                <div className="plan-meta">
                  <span>{plan.numDays} days</span>
                  <span>•</span>
                  <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                </div>
                <button
                  className="view-plan-btn"
                  onClick={() => handlePlanSelect(plan)}
                >
                  View Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPlan && (
        <ItineraryModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </section>
  );
}

export default MyPlans;
