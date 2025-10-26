import "./Itinerary.css";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchAllAttractions, testAPIs } from "../services/attractionsAPI";
import { savePlan } from "../services/plannerAPI";
import AttractionModal from "./AttractionModal";
import "../App.css";

const destinationsList = {
  delhi: { name: "Delhi" },
  mumbai: { name: "Mumbai" },
  goa: { name: "Goa" },
  jaipur: { name: "Jaipur" },
  kerala: { name: "Kerala" },
  agra: { name: "Agra" },
  manali: { name: "Manali" },
  varanasi: { name: "Varanasi" },
  rishikesh: { name: "Rishikesh" },
  ladakh: { name: "Leh-Ladakh" },
  amritsar: { name: "Amritsar" },
  darjeeling: { name: "Darjeeling" },
  andaman: { name: "Andaman Islands" },
  hyderabad: { name: "Hyderabad" },
  udaipur: { name: "Udaipur" }
};

function ItineraryPlanner() {
  const [selectedDestination, setSelectedDestination] = useState("delhi");
  const [numDays, setNumDays] = useState(3);
  const [schedule, setSchedule] = useState(() => generateSchedule(3));
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [activeDay, setActiveDay] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [loadingAttractions, setLoadingAttractions] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  const universal = [
    { id: "u1", name: "Breakfast", category: "food" },
    { id: "u2", name: "Lunch", category: "food" },
    { id: "u3", name: "Dinner", category: "food" },
    { id: "u4", name: "Leisure Time", category: "leisure" },
    { id: "u5", name: "Sleep / Bedtime", category: "rest" },
  ];

  function generateSchedule(days) {
    const scheduleObj = {};
    for (let d = 1; d <= days; d++) {
      scheduleObj[`day${d}`] = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        activity: null,
      }));
    }
    return scheduleObj;
  }

  useEffect(() => {
    const loadAttractions = async () => {
      setLoadingAttractions(true);
      setAttractions([]);
      
      try {
        const attractionsData = await fetchAllAttractions(selectedDestination);
        
        if (attractionsData.length === 0) {
          console.error('⚠️ NO ATTRACTIONS LOADED - APIs FAILED');
        } else {
          console.log(`✅ Loaded ${attractionsData.length} attractions for ${selectedDestination}`);
        }
        
        setAttractions(attractionsData);
      } catch (error) {
        console.error('Failed to load attractions:', error);
        setAttractions([]);
      } finally {
        setLoadingAttractions(false);
      }
    };

    loadAttractions();
  }, [selectedDestination]);

  const getActivityIcon = (activity) => {
    if (!activity) return "📍";
    const name = (activity.name || "").toLowerCase();
    const category = activity.category || "";

    if (name.includes("lunch") || name.includes("dinner") || name.includes("breakfast") || category === "food") return "🍽️";
    if (name.includes("museum") || name.includes("fort") || name.includes("minar") || category === "sightseeing" || category === "museum" || category === "monument") return "🏛️";
    if (name.includes("beach") || name.includes("park") || category === "leisure") return "🌴";
    if (name.includes("train") || name.includes("flight") || category === "travel") return "🚆";
    if (name.includes("sleep") || category === "rest") return "🛌";
    if (category === "attraction") return "⭐";
    if (category === "memorial") return "🗿";
    return "📍";
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const draggedId = result.draggableId;
    const draggedItem =
      attractions.find((a) => a.id === draggedId) ||
      universal.find((a) => a.id === draggedId);

    if (!draggedItem) return;

    const [dayKey, hourIndex] = destination.droppableId.split("-");
    const start = parseInt(hourIndex, 10);
    
    // FIX: Use the attraction's suggestedDuration, or selectedDuration as fallback
    const duration = draggedItem.suggestedDuration || selectedDuration;
    const end = Math.min(start + duration, 24);

    const updated = structuredClone(schedule);
    
    for (let i = start; i < end; i++) {
      if (updated[dayKey][i].activity) {
        alert(`This ${duration}h activity needs ${duration} consecutive free slots! Slots ${start}:00 to ${end}:00 are needed.`);
        return;
      }
    }

    const placed = { ...draggedItem, overriddenDuration: duration, placedAt: start };
    for (let i = start; i < end; i++) updated[dayKey][i].activity = placed;
    setSchedule(updated);
  };

  const handleDestinationChange = (e) => {
    const dest = e.target.value;
    setSelectedDestination(dest);
    setSchedule(generateSchedule(numDays));
  };

  const handleDaysChange = (e) => {
    const days = parseInt(e.target.value, 10);
    setNumDays(days);
    setSchedule(generateSchedule(days));
  };

  const handleSave = async () => {
    try {
      const formattedSchedule = Object.keys(schedule).map(dayKey => {
        const daySchedule = schedule[dayKey];
        const seenActivities = new Set(); // Track seen activities
        const dayAttractions = [];

       
        for (let i = 0; i < daySchedule.length; i++) {
          const slot = daySchedule[i];
          
          
          if (slot.activity) {
           
            const activityKey = `${slot.activity.name}-${slot.hour}`;
            

            if (!seenActivities.has(activityKey) && 
                (!i || !daySchedule[i-1].activity || 
                 daySchedule[i-1].activity.name !== slot.activity.name)) {
              
              seenActivities.add(activityKey);
              
              dayAttractions.push({
                name: slot.activity.name,
                description: slot.activity.description,
                thumbnail: slot.activity.thumbnail || null,
                suggestedDuration: slot.activity.suggestedDuration || 1,
                category: slot.activity.category,
                coordinates: slot.activity.coordinates || null,
                startTime: slot.hour,
                endTime: `${parseInt(slot.hour) + (slot.activity.suggestedDuration || 1)}:00`
              });
            }
          }
        }

        return {
          attractions: dayAttractions
        };
      });

      const planData = {
        destination: destinationsList[selectedDestination].name,
        numDays: numDays,
        schedule: formattedSchedule,
        thumbnail: null
      };

      console.log('Formatted plan data:', planData);
      await savePlan(planData);
      alert(" Itinerary saved successfully!");
    } catch (error) {
      console.error('Error in handleSave:', error);
      alert("❌ Failed to save itinerary. Please try again.");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("savedItinerary");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") setSchedule(parsed);
      } catch {
        console.warn("Failed to load saved itinerary");
      }
    }
  }, []);

  const removeScheduledActivity = (dayKey, hourIndex) => {
    const updated = structuredClone(schedule);
    const slot = updated[dayKey][hourIndex];
    if (!slot?.activity) return;

    const placed = slot.activity;
    const start = placed.placedAt ?? hourIndex;
    const duration = placed.overriddenDuration ?? 1;
    const end = Math.min(start + duration, 24);

    for (let i = start; i < end; i++) updated[dayKey][i].activity = null;
    setSchedule(updated);
  };

  const handleAttractionClick = (attraction, event) => {
    if (event.target.closest('.activity-item')) {
      setSelectedAttraction(attraction);
    }
  };

  const renderActivityCard = (slotActivity, dayKey, hourIndex) => {
    if (!slotActivity) return null;

    const start = slotActivity.placedAt ?? hourIndex;
    
    
    if (start !== hourIndex) return null;

    const icon = getActivityIcon(slotActivity);
    const duration = slotActivity.overriddenDuration || 1;
    

    const slotHeight = 68; 
    const cardHeight = (slotHeight * duration) - 8; // -8 for padding

    return (
      <div 
        className="scheduled-card" 
        style={{ 
          height: `${cardHeight}px`,
          minHeight: `${cardHeight}px`,
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          zIndex: 10
        }}
      >
        <div className="scheduled-content">
          <div className="scheduled-icon">{icon}</div>
          <div className="scheduled-text">
            <div className="scheduled-name">{slotActivity.name}</div>
            <span className="duration-tag">{duration}h</span>
            {slotActivity.thumbnail && (
              <img src={slotActivity.thumbnail} alt={slotActivity.name} className="scheduled-thumb" />
            )}
          </div>
        </div>
        <button
          className="remove-btn"
          onClick={() => removeScheduledActivity(dayKey, hourIndex)}
          title="Remove activity"
        >
          ×
        </button>
      </div>
    );
  };

  const handleTestAPIs = async () => {
    await testAPIs();
  };

  return (
    <div className="itinerary-container">
      <h1 className="itinerary-header">🇮🇳 India Travel Itinerary Planner</h1>

      <div className="planner-controls">
        <div>
          <label>Destination:</label>
          <select value={selectedDestination} onChange={handleDestinationChange}>
            {Object.keys(destinationsList).map((key) => (
              <option key={key} value={key}>
                {destinationsList[key].name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>No. of Days:</label>
          <select value={numDays} onChange={handleDaysChange}>
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Duration for Universal Activities:</label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(parseInt(e.target.value, 10))}
            title="This duration only applies to Universal Activities (Food, Sleep, etc). Attractions use their suggested duration."
          >
            {[1, 2, 3, 4, 5, 6].map((h) => (
              <option key={h} value={h}>
                {h}h
              </option>
            ))}
          </select>
          <small style={{display: 'block', color: '#666', fontSize: '11px', marginTop: '4px'}}>
            ℹ️ Attractions use their own suggested duration
          </small>
        </div>

        <button className="save-btn" onClick={handleSave}>
          💾 Save Itinerary
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="itinerary-grid">
          <Droppable droppableId="activities" isDropDisabled>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="activities-box">
                <h2>📍 Points of Interest - {destinationsList[selectedDestination].name}</h2>
                
                {loadingAttractions ? (
                  <div className="loading-attractions">
                    <div className="spinner"></div>
                    <p>Loading real attractions...</p>
                    <small style={{color: '#999', marginTop: '10px'}}>Fetching from OpenStreetMap & Wikipedia APIs</small>
                  </div>
                ) : attractions.length === 0 ? (
                  <div className="no-attractions">
                    <p style={{color: '#ff6b6b', padding: '20px', textAlign: 'center'}}>
                      No attractions loaded<br/>
                      <small>APIs may be temporarily unavailable. Please try again.</small>
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="attractions-count">
                      <small>✅ {attractions.length} real attractions loaded</small>
                    </div>
                    {attractions.map((attraction, index) => (
                      <Draggable key={attraction.id} draggableId={attraction.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`activity-item attraction-item ${snapshot.isDragging ? 'dragging' : ''}`}
                            onClick={(e) => !snapshot.isDragging && handleAttractionClick(attraction, e)}
                            title={`Drag to schedule (requires ${attraction.suggestedDuration} consecutive hour${attraction.suggestedDuration > 1 ? 's' : ''})`}
                          >
                            {attraction.thumbnail && (
                              <div className="attraction-thumbnail">
                                <img src={attraction.thumbnail} alt={attraction.name} />
                              </div>
                            )}
                            <div className="attraction-content">
                              <span className="poi-name">{attraction.name}</span>
                              <span className="attraction-type">{attraction.description.substring(0, 60)}...</span>
                              <div className="attraction-badges">
                                <span className="source-badge" title={`Data from ${attraction.source}`}>
                                  {attraction.source === 'openstreetmap' ? '🗺️ OSM' : '📖 Wiki'}
                                </span>
                                <span 
                                  className="duration-badge" 
                                  style={{
                                    background: attraction.suggestedDuration > 3 ? 'rgba(255, 107, 107, 0.15)' : 'rgba(102, 126, 234, 0.1)',
                                    color: attraction.suggestedDuration > 3 ? '#ff6b6b' : '#667eea'
                                  }}
                                  title={`This activity takes ${attraction.suggestedDuration} hour${attraction.suggestedDuration > 1 ? 's' : ''}`}
                                >
                                  ⏱ {attraction.suggestedDuration}h
                                </span>
                              </div>
                            </div>
                            <div className="attraction-meta">
                              <span className="info-icon">ℹ️</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </>
                )}

                <h3 style={{ marginTop: "20px", color: "#003580", borderTop: '2px solid #e0e0e0', paddingTop: '15px' }}>
                  🍴 Universal Activities
                </h3>

                {universal.map((act, index) => (
                  <Draggable key={act.id} draggableId={act.id} index={attractions.length + index}>
                    {/* Changed from index + 1000 to attractions.length + index */}
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="activity-item universal"
                        title={`Drag to schedule (will use ${selectedDuration}h duration)`}
                      >
                        <span className="poi-name">{act.name}</span>
                        <span className="duration-indicator" style={{fontSize: '10px', color: '#999', marginLeft: '8px'}}>
                          ({selectedDuration}h)
                        </span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="schedule-grid">
            {Object.keys(schedule).map((dayKey, dayIndex) => {
              const expanded = activeDay === dayKey || activeDay === null;

              return (
                <div
                  key={dayKey}
                  className={`day-box ${activeDay && activeDay !== dayKey ? "collapsed" : "expanded"}`}
                  style={{
                    flex: activeDay === null ? "0 0 320px" : activeDay === dayKey ? "0 0 380px" : "0 0 280px",
                    transition: "flex 0.4s ease",
                  }}
                >
                  <div className="day-header">
                    <h2>Day {dayIndex + 1}</h2>
                    <button
                      className="collapse-btn"
                      onClick={() => setActiveDay(activeDay === dayKey ? null : dayKey)}
                    >
                      {activeDay === dayKey ? "🔽 Minimize" : "🔼 Focus"}
                    </button>
                  </div>

                  {expanded && (
                    <div className="time-grid">
                      {schedule[dayKey].map((slot, hourIndex) => {
                        const occupied = !!slot.activity;
                        const isStartSlot = occupied && (slot.activity.placedAt ?? hourIndex) === hourIndex;
                        const isContinuation = occupied && !isStartSlot;

                        return (
                          <Droppable key={`${dayKey}-${hourIndex}`} droppableId={`${dayKey}-${hourIndex}`}>
                            {(provided, snapshot) => {
                              return (
                                <div 
                                  ref={provided.innerRef} 
                                  {...provided.droppableProps} 
                                  className={`time-slot ${occupied ? "occupied" : ""} ${isContinuation ? "continuation-slot" : ""} ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                                  style={{
                                    position: 'relative',
                                    pointerEvents: isContinuation ? 'none' : 'auto'
                                  }}
                                >
                                  <span className="hour-label">{slot.hour}</span>
                                  <div className="time-slot-inner">
                                    {isStartSlot ? (
                                      renderActivityCard(slot.activity, dayKey, hourIndex)
                                    ) : isContinuation ? (
                                      <div className="continuation-marker">
                                      </div>
                                    ) : (
                                      <p className="day-placeholder">Drop activity</p>
                                    )}
                                  </div>
                                  {provided.placeholder}
                                </div>
                              );
                            }}
                          </Droppable>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DragDropContext>

      {selectedAttraction && (
        <AttractionModal
          attraction={selectedAttraction}
          onClose={() => setSelectedAttraction(null)}
        />
      )}
    </div>
  );
}

export default ItineraryPlanner;
