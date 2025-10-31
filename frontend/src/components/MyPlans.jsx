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
      return [];
    }
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
};

// NEW: Get saved premade plans
const getSavedPremadePlans = async (userEmail) => {
  try {
    const response = await fetch(`${API_BASE_URL}/premade/my-saved/${userEmail}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching saved premade plans:', error);
    return [];
  }
};

function MyPlans() {
  const [bookings, setBookings] = useState([]);
  const [plans, setPlans] = useState([]);
  const [savedPremadePlans, setSavedPremadePlans] = useState([]); // NEW
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
          } else {
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

      // NEW: Load saved premade plans
      try {
        const fetchedSavedPremade = await getSavedPremadePlans(user.email);
        setSavedPremadePlans(fetchedSavedPremade || []);
      } catch (premadeError) {
        setSavedPremadePlans([]);
      }
      
    } catch (error) {
      setBookings([]);
      setPlans([]);
      setSavedPremadePlans([]);
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

  const downloadCustomPlanPDF = (plan) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isPremium = user.isPremium || user.subscriptionStatus === 'premium';
    
    if (!isPremium) {
      alert('🔒 PDF Download is a Premium feature! Upgrade to download your itineraries.');
      return;
    }
    
    // Create HTML content for better PDF formatting
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${plan.destination} Trip - Custom Itinerary</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #28a745; padding-bottom: 20px; }
          .header h1 { color: #28a745; font-size: 28px; margin: 0; }
          .header p { color: #666; font-size: 16px; margin: 10px 0; }
          .day-section { margin-bottom: 30px; page-break-inside: avoid; }
          .day-header { background: #28a745; color: white; padding: 15px; border-radius: 8px 8px 0 0; font-size: 18px; font-weight: bold; }
          .day-content { border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
          .activity { padding: 15px; border-bottom: 1px solid #f0f0f0; display: flex; gap: 15px; }
          .activity:last-child { border-bottom: none; }
          .activity-time { background: #e3f2fd; color: #1976d2; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; white-space: nowrap; }
          .activity-info h4 { margin: 0 0 8px 0; color: #333; font-size: 16px; }
          .activity-info p { margin: 0 0 10px 0; color: #666; font-size: 14px; }
          .activity-meta { display: flex; gap: 10px; flex-wrap: wrap; }
          .activity-meta span { background: #f8f9fa; padding: 3px 8px; border-radius: 12px; font-size: 11px; color: #666; }
          .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛠️ ${plan.destination} Trip</h1>
          <p><strong>Custom Itinerary</strong></p>
          <p>Duration: ${plan.numDays} Days | Created: ${new Date(plan.createdAt).toLocaleDateString()}</p>
        </div>

        ${plan.schedule.map((day, dayIndex) => `
          <div class="day-section">
            <div class="day-header">📅 Day ${dayIndex + 1}</div>
            <div class="day-content">
              ${day.attractions && day.attractions.length > 0 ? 
                day.attractions
                  .sort((a, b) => {
                    const timeA = parseInt(a.startTime?.split(":")[0] || "0");
                    const timeB = parseInt(b.startTime?.split(":")[0] || "0");
                    return timeA - timeB;
                  })
                  .map(attraction => `
                    <div class="activity">
                      <div class="activity-time">
                        🕒 ${attraction.startTime || '09:00'} - ${attraction.endTime || '10:00'}
                      </div>
                      <div class="activity-info" style="flex: 1;">
                        <h4>${attraction.name || 'Unnamed Activity'}</h4>
                        <p>${attraction.description || 'No description available'}</p>
                        <div class="activity-meta">
                          <span>⏱️ Duration: ${attraction.suggestedDuration || 1}h</span>
                          <span>🏷️ Category: ${attraction.category || 'General'}</span>
                        </div>
                      </div>
                    </div>
                  `).join('') 
                : '<div style="padding: 40px; text-align: center; color: #999; font-style: italic;">No activities planned for this day</div>'
              }
            </div>
          </div>
        `).join('')}

        <div class="summary">
          <h3 style="margin-top: 0; color: #28a745;">📊 Trip Summary</h3>
          <p><strong>Total Duration:</strong> ${plan.numDays} Days</p>
          <p><strong>Total Activities:</strong> ${plan.schedule.reduce((total, day) => total + (day.attractions ? day.attractions.length : 0), 0)}</p>
          <p><strong>Destination:</strong> ${plan.destination}</p>
          <p><strong>Plan Type:</strong> Custom Itinerary</p>
        </div>

        <div class="footer">
          <p>Generated by Travel Planner Pro | Premium Feature</p>
          <p>Downloaded on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </body>
      </html>
    `;
    
    // Create a new window and print to PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      
      // Show success message
      alert('📄 PDF print dialog opened! Choose "Save as PDF" to download your itinerary.');
      
      // Close the window after a delay
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);
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

  const totalPlansCount = plans.length + savedPremadePlans.length;

  return (
    <div style={{ 
      minHeight: '80vh',
      padding: '20px 40px',
      paddingBottom: '100px'
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
          My Travel Plans ({totalPlansCount})
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
          {totalPlansCount > 0 ? (
            <div>
              {/* Custom Plans Section */}
              {plans.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{ 
                    marginBottom: '20px', 
                    color: '#333', 
                    borderLeft: '4px solid #28a745',
                    paddingLeft: '12px'
                  }}>
                    🛠️ Custom Travel Plans ({plans.length})
                  </h3>
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
                            border: '1px solid #28a745',
                            borderRadius: '12px',
                            padding: '24px',
                            backgroundColor: '#f8fff9',
                            boxShadow: '0 4px 8px rgba(40, 167, 69, 0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => setSelectedPlan(plan)}
                        >
                          <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ 
                              margin: '0 0 8px 0', 
                              color: '#333',
                              fontSize: '20px',
                              fontWeight: '600'
                            }}>
                              🛠️ {plan.destination} Trip (Custom)
                            </h3>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '12px',
                              flexWrap: 'wrap'
                            }}>
                              <span style={{
                                backgroundColor: '#e8f5e8',
                                color: '#28a745',
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                🗓️ {plan.numDays} Days
                              </span>
                              <span style={{
                                backgroundColor: '#e8f5e8',
                                color: '#28a745',
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
                                  <div style={{ color: '#28a745', fontStyle: 'italic' }}>
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
                              color: '#28a745',
                              fontWeight: '500'
                            }}>
                              View Details →
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Saved Premade Plans Section */}
              {savedPremadePlans.length > 0 && (
                <div>
                  <h3 style={{ 
                    marginBottom: '20px', 
                    color: '#333',
                    borderLeft: '4px solid #667eea',
                    paddingLeft: '12px'
                  }}>
                    ⭐ Saved Premade Plans ({savedPremadePlans.length})
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                  }}>
                    {savedPremadePlans.map((plan) => (
                      <div 
                        key={plan._id} 
                        style={{
                          border: '1px solid #667eea',
                          borderRadius: '12px',
                          padding: '24px',
                          backgroundColor: '#f8f9ff',
                          boxShadow: '0 4px 8px rgba(102, 126, 234, 0.1)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => setSelectedPlan({ ...plan, isPremade: true })}
                      >
                        {plan.cityImage && (
                          <div style={{ 
                            width: '100%', 
                            height: '120px', 
                            backgroundImage: `url(${plan.cityImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '8px',
                            marginBottom: '16px'
                          }} />
                        )}
                        
                        <div style={{ marginBottom: '16px' }}>
                          <h3 style={{ 
                            margin: '0 0 8px 0', 
                            color: '#333',
                            fontSize: '20px',
                            fontWeight: '600'
                          }}>
                            ⭐ {plan.planName}
                          </h3>
                          <p style={{ 
                            margin: '0 0 12px 0', 
                            color: '#666',
                            fontSize: '14px'
                          }}>
                            {plan.cityName} • {plan.type}
                          </p>
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
                              🗓️ {plan.days} Days
                            </span>
                            <span style={{
                              backgroundColor: '#e8f5e8',
                              color: '#28a745',
                              padding: '4px 12px',
                              borderRadius: '16px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              💰 {plan.cost}
                            </span>
                          </div>
                        </div>

                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          paddingTop: '16px',
                          borderTop: '1px solid #f0f0f0'
                        }}>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            Saved: {formatDate(plan.savedAt)}
                          </div>
                          <div style={{ 
                            fontSize: '14px', 
                            color: '#667eea',
                            fontWeight: '500'
                          }}>
                            View Details →
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  {selectedPlan.isPremade ? '⭐' : '🛠️'} {selectedPlan.isPremade ? selectedPlan.planName : `${selectedPlan.destination} Trip`}
                </h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    🗓️ {selectedPlan.isPremade ? selectedPlan.days : selectedPlan.numDays} Days
                  </span>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    📅 {selectedPlan.isPremade ? 'Saved' : 'Created'}: {formatDate(selectedPlan.isPremade ? selectedPlan.savedAt : selectedPlan.createdAt)}
                  </span>
                  {selectedPlan.isPremade ? (
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      💰 {selectedPlan.cost} • {selectedPlan.type}
                    </span>
                  ) : (
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      📍 {getTotalAttractions(selectedPlan)} Total Places
                    </span>
                  )}
                  
                  {/* ADD DOWNLOAD BUTTON FOR CUSTOM PLANS */}
                  {!selectedPlan.isPremade && (
                    <button 
                      onClick={() => downloadCustomPlanPDF(selectedPlan)}
                      style={{
                        background: user.isPremium ? 'linear-gradient(45deg, #28a745, #20c997)' : '#ccc',
                        color: user.isPremium ? 'white' : '#666',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: user.isPremium ? 'pointer' : 'not-allowed',
                        marginLeft: '10px'
                      }}
                      title={user.isPremium ? 'Download PDF' : 'Premium feature - Upgrade to download'}
                    >
                      {user.isPremium ? '📄 PDF' : '🔒 PDF'}
                    </button>
                  )}
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
              {selectedPlan.isPremade ? (
                // Render premade plan details
                <div>
                  {selectedPlan.highlights && (
                    <div style={{ marginBottom: '30px' }}>
                      <h3 style={{ marginBottom: '15px', color: '#333' }}>✨ Highlights</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedPlan.highlights.map((highlight, index) => (
                          <span key={index} style={{
                            background: 'linear-gradient(45deg, #ffc107, #fd7e14)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '15px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <h3 style={{ marginBottom: '20px', color: '#333' }}>📋 Day-wise Itinerary</h3>
                  {selectedPlan.details && selectedPlan.details.map((day, index) => (
                    <div key={index} style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        backgroundColor: '#667eea',
                        color: 'white',
                        padding: '16px 20px',
                        fontWeight: 'bold'
                      }}>
                        Day {day.day}: {day.title}
                      </div>
                      <div style={{ padding: '20px' }}>
                        <div style={{ marginBottom: '15px' }}>
                          <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Activities:</h4>
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} style={{
                              backgroundColor: '#f8f9fa',
                              padding: '8px 12px',
                              marginBottom: '6px',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}>
                              {activity}
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                          <div>
                            <strong>Meals:</strong> {day.meals.join(', ')}
                          </div>
                          <div>
                            <strong>Stay:</strong> {day.accommodation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Render custom plan details (existing code)
                <div>
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPlans;
