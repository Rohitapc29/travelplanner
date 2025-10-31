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
    
    
    const response = await fetch(`${API_BASE_URL}/plans`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      
      const plansArray = Array.isArray(data) ? data : (data.plans || []);
      
      
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
            setBookings(bookingData.bookings || []);
          } 
          else {
            setBookings([]);
          }
        } catch (bookingError) {
          setBookings([]);
        }
      }

      try {
        const fetchedPlans = await getPlans();
        setPlans(fetchedPlans || []);
      } catch (planError) {
        setPlans([]);
      }
      
    } catch (error) {
      setBookings([]);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const getTotalAttractions = (plan) => {
    if (!plan.schedule || !Array.isArray(plan.schedule)) return 0;
    return plan.schedule.reduce((total, day) => {
      return total + (day.attractions ? day.attractions.length : 0);
    }, 0);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

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
      
      {/* Tabs */}
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {plans.map((plan) => {
                const totalAttractions = getTotalAttractions(plan);
                return (
                  <div 
                    key={plan._id} 
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '12px',
                      padding: '24px',
                      backgroundColor: '#fff',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      ':hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    {/* Plan Header */}
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ 
                        margin: '0 0 8px 0', 
                        color: '#333',
                        fontSize: '20px',
                        fontWeight: '600'
                      }}>
                        📍 {plan.destination} Trip
                      </h3>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          🗓️ {plan.numDays} Days
                        </span>
                        <span style={{
                          backgroundColor: '#f3e5f5',
                          color: '#7b1fa2',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          📍 {totalAttractions} Places
                        </span>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ 
                        color: '#666', 
                        fontSize: '14px', 
                        margin: '0 0 8px 0',
                        lineHeight: '1.4'
                      }}>
                        <strong>Highlights:</strong>
                      </p>
                      {plan.schedule && plan.schedule.length > 0 ? (
                        <div style={{ fontSize: '13px', color: '#888' }}>
                          {plan.schedule.slice(0, 2).map((day, dayIndex) => (
                            <div key={dayIndex} style={{ marginBottom: '4px' }}>
                              <strong>Day {dayIndex + 1}:</strong>{' '}
                              {day.attractions && day.attractions.length > 0 
                                ? day.attractions.slice(0, 2).map(attr => attr.name).join(', ')
                                : 'No activities planned'
                              }
                              {day.attractions && day.attractions.length > 2 && ` +${day.attractions.length - 2} more`}
                            </div>
                          ))}
                          {plan.schedule.length > 2 && (
                            <div style={{ color: '#007bff', fontStyle: 'italic' }}>
                              +{plan.schedule.length - 2} more days...
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ fontSize: '13px', color: '#999', fontStyle: 'italic' }}>
                          No detailed itinerary available
                        </div>
                      )}
                    </div>

                    {/* Plan Footer */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingTop: '16px',
                      borderTop: '1px solid #f0f0f0'
                    }}>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        Created: {formatDate(plan.createdAt)}
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#007bff',
                        fontWeight: '500'
                      }}>
                        View Details →
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#666'
            }}>
              <h3>No Travel Plans Found</h3>
              <p>You haven't created any travel plans yet.</p>
              <button
                onClick={() => {
                  window.location.hash = '#itinerary';
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginTop: '16px'
                }}
              >
                Create Your First Plan
              </button>
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
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => setSelectedPlan(null)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              padding: '24px 32px 16px 32px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 10
            }}>
              <div>
                <h2 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px' }}>
                  📍 {selectedPlan.destination} Trip
                </h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    🗓️ {selectedPlan.numDays} Days
                  </span>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    📅 Created: {formatDate(selectedPlan.createdAt)}
                  </span>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    📍 {getTotalAttractions(selectedPlan)} Total Places
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '4px',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '24px 32px 32px 32px' }}>
              {selectedPlan.schedule && Array.isArray(selectedPlan.schedule) && selectedPlan.schedule.length > 0 ? (
                <div>
                  <h3 style={{ marginBottom: '20px', color: '#333' }}>📋 Detailed Itinerary</h3>
                  {selectedPlan.schedule.map((day, dayIndex) => (
                    <div key={dayIndex} style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '16px 20px',
                        borderBottom: '1px solid #e0e0e0'
                      }}>
                        <h4 style={{ margin: 0, color: '#333', fontSize: '18px' }}>
                          📅 Day {dayIndex + 1}
                          {day.attractions && day.attractions.length > 0 && (
                            <span style={{ 
                              fontSize: '14px', 
                              color: '#666', 
                              fontWeight: 'normal',
                              marginLeft: '12px'
                            }}>
                              ({day.attractions.length} activities)
                            </span>
                          )}
                        </h4>
                      </div>
                      
                      <div style={{ padding: '20px' }}>
                        {day.attractions && Array.isArray(day.attractions) && day.attractions.length > 0 ? (
                          <div style={{ display: 'grid', gap: '16px' }}>
                            {day.attractions
                              .sort((a, b) => {
                                const timeA = parseInt(a.startTime?.split(":")[0] || "0");
                                const timeB = parseInt(b.startTime?.split(":")[0] || "0");
                                return timeA - timeB;
                              })
                              .map((attraction, idx) => (
                                <div key={idx} style={{
                                  display: 'flex',
                                  gap: '16px',
                                  padding: '16px',
                                  border: '1px solid #f0f0f0',
                                  borderRadius: '8px',
                                  backgroundColor: '#fafafa'
                                }}>
                                  {attraction.thumbnail ? (
                                    <img
                                      src={attraction.thumbnail}
                                      alt={attraction.name}
                                      style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: '6px',
                                        flexShrink: 0
                                      }}
                                    />
                                  ) : (
                                    <div style={{
                                      width: '80px',
                                      height: '80px',
                                      backgroundColor: '#e0e0e0',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '24px',
                                      flexShrink: 0
                                    }}>
                                      {attraction.category === 'temple' ? '🛕' :
                                       attraction.category === 'monument' ? '🏛️' :
                                       attraction.category === 'museum' ? '🏛️' :
                                       attraction.category === 'food' ? '🍽️' : '📍'}
                                    </div>
                                  )}
                                  
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <h5 style={{ 
                                      margin: '0 0 8px 0', 
                                      color: '#333',
                                      fontSize: '16px',
                                      fontWeight: '600'
                                    }}>
                                      {attraction.name || "Unnamed Activity"}
                                    </h5>
                                    <p style={{ 
                                      margin: '0 0 12px 0',
                                      color: '#666',
                                      fontSize: '14px',
                                      lineHeight: '1.4'
                                    }}>
                                      {attraction.description || "No description available"}
                                    </p>
                                    
                                    <div style={{ 
                                      display: 'flex', 
                                      gap: '16px',
                                      alignItems: 'center',
                                      fontSize: '13px',
                                      color: '#888'
                                    }}>
                                      <span style={{
                                        backgroundColor: '#e3f2fd',
                                        color: '#1976d2',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontWeight: '500'
                                      }}>
                                        ⏱️ {attraction.suggestedDuration || 1}h
                                      </span>
                                      
                                      {attraction.startTime && attraction.endTime && (
                                        <span style={{
                                          backgroundColor: '#f3e5f5',
                                          color: '#7b1fa2',
                                          padding: '4px 8px',
                                          borderRadius: '12px',
                                          fontWeight: '500'
                                        }}>
                                          🕒 {attraction.startTime} - {attraction.endTime}
                                        </span>
                                      )}
                                      
                                      {attraction.category && (
                                        <span style={{
                                          backgroundColor: '#e8f5e8',
                                          color: '#2e7d32',
                                          padding: '4px 8px',
                                          borderRadius: '12px',
                                          fontWeight: '500',
                                          textTransform: 'capitalize'
                                        }}>
                                          🏷️ {attraction.category}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        ) : (
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '40px 20px',
                            color: '#999',
                            fontStyle: 'italic'
                          }}>
                            No activities planned for this day
                          </div>
                        )}
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
                  <h3>📝 No Detailed Itinerary</h3>
                  <p>This travel plan doesn't have a detailed day-by-day itinerary yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPlans;
