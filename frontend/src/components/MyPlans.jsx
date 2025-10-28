import React, { useState, useEffect } from "react";
import "./MyPlans.css";

const API_BASE_URL = 'http://localhost:4000/api';

const getPlans = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found for plans');
      return [];
    }
    
    console.log('Fetching plans ');
    
    const response = await fetch(`${API_BASE_URL}/plans`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Plans', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Raw plans:', data);
      
      const plansArray = Array.isArray(data) ? data : (data.plans || []);
      console.log('Processed :', plansArray, 'Length:', plansArray.length);
      
      return plansArray;
    } else {
      const errorText = await response.text();
      console.error('Plans fetch failed:', response.status, errorText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
};

function MyPlans() {
  const [bookings, setBookings] = useState([]);
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = user && user.email;

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Loading data for user:', user.email);
      
      if (user.email) {
        try {
          const bookingResponse = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
            headers: { 
              'user-email': user.email,
              'Content-Type': 'application/json'
            }
          });
          
          if (bookingResponse.ok) {
            const bookingData = await bookingResponse.json();
            console.log('Bookings loaded:', bookingData.bookings?.length || 0);
            setBookings(bookingData.bookings || []);
          } else {
            console.error('Failed to load bookings:', await bookingResponse.text());
            setBookings([]);
          }
        } catch (bookingError) {
          console.error('Booking fetch error:', bookingError);
          setBookings([]);
        }
      }


      try {
        console.log('Loading travel plans...');
        const fetchedPlans = await getPlans();
        console.log("Final plans loaded:", fetchedPlans); 
        setPlans(fetchedPlans || []);
      } catch (planError) {
        console.error('Plans fetch error:', planError);
        setPlans([]);
      }
      
    } catch (error) {
      console.error("Error in loadData:", error);
      setBookings([]);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    console.log("Selected plan details:", plan); 
    setSelectedPlan(plan);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px'
      }}>
        <div>
          <h2>Login Required</h2>
          <p>Please log in to view your bookings and travel plans.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '80vh',
      padding: '20px 40px',
      paddingBottom: '100px' // Space for footer
    }}>
      <h1 style={{ 
        marginBottom: '30px',
        color: '#333',
        borderBottom: '3px solid #007bff',
        paddingBottom: '10px'
      }}>
        My Plans
      </h1>
      
      <div style={{ 
        marginBottom: '30px',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            padding: '12px 24px',
            marginRight: '10px',
            border: 'none',
            background: 'none',
            fontSize: '16px',
            fontWeight: '500',
            color: activeTab === 'bookings' ? '#007bff' : '#666',
            cursor: 'pointer',
            borderBottom: activeTab === 'bookings' ? '3px solid #007bff' : '3px solid transparent',
            transition: 'all 0.3s ease'
          }}
        >
          My Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            fontSize: '16px',
            fontWeight: '500',
            color: activeTab === 'plans' ? '#007bff' : '#666',
            cursor: 'pointer',
            borderBottom: activeTab === 'plans' ? '3px solid #007bff' : '3px solid transparent',
            transition: 'all 0.3s ease'
          }}
        >
          My Travel Plans ({plans.length})
        </button>
      </div>

      {activeTab === 'bookings' ? (
        <div>
          {bookings.length > 0 ? (
            <div style={{ display: 'grid', gap: '20px' }}>
              {bookings.map((booking) => (
                <div key={booking._id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                        Flight Booking - PNR: {booking.pnr}
                      </h3>
                      <p><strong>Flight:</strong> {booking.flightDetails?.airlineName} {booking.flightDetails?.flightNumber}</p>
                      <p><strong>Route:</strong> {booking.flightDetails?.departure?.city} → {booking.flightDetails?.arrival?.city}</p>
                      <p><strong>Date:</strong> {booking.flightDetails?.departure?.date}</p>
                      <p><strong>Time:</strong> {booking.flightDetails?.departure?.time} - {booking.flightDetails?.arrival?.time}</p>
                      <p><strong>Status:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>{booking.status}</span></p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                        ₹{booking.totalAmount}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Booked: {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#666'
            }}>
              <h3>No Bookings Found</h3>
              <p>You haven't made any bookings yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {plans.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {plans.map((plan) => (
                <div key={plan._id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedPlan(plan)}
                >
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{plan.title}</h3>
                  <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
                    {plan.destination}
                  </p>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    Created: {new Date(plan.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '14px', color: '#007bff' }}>
                    {plan.itinerary?.length || 0} days planned
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#666'
            }}>
              <h3>No Travel Plans Found</h3>
              <p>You haven't created any travel plans yet.</p>
            </div>
          )}
        </div>
      )}

      {selectedPlan && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setSelectedPlan(null)}
        >
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            margin: '20px'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>{selectedPlan.title}</h2>
              <button
                onClick={() => setSelectedPlan(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            <p><strong>Destination:</strong> {selectedPlan.destination}</p>
            <p><strong>Created:</strong> {new Date(selectedPlan.createdAt).toLocaleDateString()}</p>
            
            {selectedPlan.itinerary && selectedPlan.itinerary.length > 0 && (
              <div>
                <h4>Itinerary:</h4>
                {selectedPlan.itinerary.map((day, index) => (
                  <div key={index} style={{
                    border: '1px solid #eee',
                    padding: '15px',
                    marginBottom: '10px',
                    borderRadius: '4px'
                  }}>
                    <h5>Day {day.day}: {day.title}</h5>
                    <p>{day.description}</p>
                    {day.activities && day.activities.length > 0 && (
                      <ul>
                        {day.activities.map((activity, actIndex) => (
                          <li key={actIndex}>{activity}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPlans;
