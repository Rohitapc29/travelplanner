import "./Itinerary.css";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { destinations } from "./data";
import "../App.css";
function ItineraryPlanner() {
  const [selectedDestination, setSelectedDestination] = useState("delhi");
  const [numDays, setNumDays] = useState(3);
  const [schedule, setSchedule] = useState(() => generateSchedule(3));
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [activeDay, setActiveDay] = useState(null);

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

  const getActivityIcon = (activity) => {
    if (!activity) return "📍";
    const name = (activity.name || "").toLowerCase();
    const category = activity.category || "";

    if (name.includes("lunch") || name.includes("dinner") || category === "food") return "🍽️";
    if (name.includes("museum") || name.includes("fort") || name.includes("minar") || category === "sightseeing") return "🏛️";
    if (name.includes("beach") || name.includes("park") || category === "leisure") return "🌴";
    if (name.includes("train") || name.includes("flight") || category === "travel") return "🚆";
    if (name.includes("sleep") || category === "rest") return "🛌";
    return "📍";
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const draggedId = result.draggableId;
    const draggedItem =
      destinations[selectedDestination].activities.find((a) => a.id === draggedId) ||
      universal.find((a) => a.id === draggedId);

    if (!draggedItem) return;

    const [dayKey, hourIndex] = destination.droppableId.split("-");
    const start = parseInt(hourIndex, 10);
    const duration = selectedDuration;
    const end = Math.min(start + duration, 24);

    const updated = structuredClone(schedule);
    for (let i = start; i < end; i++) {
      if (updated[dayKey][i].activity) {
        alert("That slot already has an activity!");
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

  const handleSave = () => {
    localStorage.setItem("savedItinerary", JSON.stringify(schedule));
    alert("✅ Itinerary saved successfully!");
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

  const renderActivityCard = (slotActivity, dayKey, hourIndex) => {
    if (!slotActivity) return null;

    const start = slotActivity.placedAt ?? hourIndex;
    if (start !== hourIndex) return <div className="scheduled-continuation" aria-hidden />;

    const icon = getActivityIcon(slotActivity);

    return (
      <div
        className="scheduled-card"
        style={{
          height: `40 px`,
        }}
      >
        <div className="scheduled-content">
          <div className="scheduled-icon">{icon}</div>
          <div className="scheduled-text">
            <div className="scheduled-name">{slotActivity.name}</div>
            <span className="duration-tag">{slotActivity.overriddenDuration}h</span>
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

  return (
    <div className="itinerary-container">
      <h1 className="itinerary-header">India Travel Itinerary Planner</h1>

      <div className="planner-controls">
        <div>
          <label>Destination:</label>
          <select value={selectedDestination} onChange={handleDestinationChange}>
            {Object.keys(destinations).map((key) => (
              <option key={key} value={key}>
                {destinations[key].name}
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
          <label>Duration (hours):</label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(parseInt(e.target.value, 10))}
          >
            {[1, 2, 3, 4, 5, 6].map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
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
                <h2>Points of Interest - {destinations[selectedDestination].name}</h2>

                {destinations[selectedDestination].activities.map((act, index) => (
                  <Draggable key={act.id} draggableId={act.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="activity-item"
                      >
                        <span className="poi-name">{act.name}</span>
                        <span className="duration-label">⏱ {act.suggestedDuration ?? 1}h</span>
                      </div>
                    )}
                  </Draggable>
                ))}

                <h3 style={{ marginTop: "10px", color: "#003580" }}>Universal Activities</h3>

                {universal.map((act, index) => (
                  <Draggable key={act.id} draggableId={act.id} index={index + 100}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="activity-item universal"
                      >
                        <span className="poi-name">{act.name}</span>
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
                      {schedule[dayKey].map((slot, hourIndex) => (
                        <Droppable key={`${dayKey}-${hourIndex}`} droppableId={`${dayKey}-${hourIndex}`}>
                          {(provided) => {
                            const occupied = !!slot.activity;
                            return (
                              <div ref={provided.innerRef} {...provided.droppableProps} className={`time-slot ${occupied ? "occupied" : ""}`}>
                                <span className="hour-label">{slot.hour}</span>
                                <div className="time-slot-inner">
                                  {occupied ? renderActivityCard(slot.activity, dayKey, hourIndex) : <p className="day-placeholder">Drop activity</p>}
                                </div>
                                {provided.placeholder}
                              </div>
                            );
                          }}
                        </Droppable>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

export default ItineraryPlanner;
