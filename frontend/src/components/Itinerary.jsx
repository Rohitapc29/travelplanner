import React, { useState } from "react";
import "./Itinerary.css";
import ItineraryPlanner from "./ItineraryPlanner";

const destinations = [
  { id: 1, name: "Goa", image: "https://seoimgak.mmtcdn.com/blog/sites/default/files/goa-quick-guide.jpg" },
  { id: 2, name: "Jaipur", image: "https://hldak.mmtcdn.com/prod-s3-hld-hpcmsadmin/holidays/images/cities/3769/Marvellous%20doorways%20in%20Amer%20Fort.jpg?downsize=328:200" },
  { id: 3, name: "Kerala", image: "https://seoimgak.mmtcdn.com/blog/sites/default/files/kerala-handy-travel-guide.jpg" },
  { id: 4, name: "Agra", image: "https://hblimg.mmtcdn.com/content/hubble/img/agra/mmt/activities/m_activities-agra-taj-mahal_l_400_640.jpg" },
  { id: 5, name: "Manali", image: "https://seoimgak.mmtcdn.com/blog/sites/default/files/images/manali-High-mountain-road.jpg" },
  { id: 6, name: "Varanasi", image: "https://hldak.mmtcdn.com/prod-s3-hld-hpcmsadmin/holidays/images/cities/1381/Varanasi.jpg?downsize=328:200" },
  { id: 7, name: "Rishikesh", image: "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202107281139471142-e10676bc8ea211eea62c0a58a9feac02.jpg" },
  { id: 8, name: "Leh-Ladakh", image: "https://hblimg.mmtcdn.com/content/hubble/img/ladakh/mmt/activities/t_ufs/m_activities_ladakh_diskit_monastery_l_399_598.jpg" },
  { id: 9, name: "Mumbai", image: "https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/destination/m_mumbai_main_tv_destination_img_1_l_848_1272.jpg" },
  { id: 10, name: "Delhi", image: "https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/activities/m_Delhi_shutterjulimg_1_l_1058_1590.jpg" },
  { id: 11, name: "Amritsar", image: "https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/destination/m_Amritsar_main_tv_destination_img_1_l_759_1290.jpg" },
  { id: 12, name: "Darjeeling", image: "https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/activities/m_Darjeeling_destjulimg_6_l_810_1215.jpg" },
  { id: 13, name: "Andaman Islands", image: "https://hldak.mmtcdn.com/prod-s3-hld-hpcmsadmin/holidays/images/cities/3872/Havelock_2.jpg?downsize=328:200" },
  { id: 14, name: "Hyderabad", image: "https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/destination/m_hyderbad_destinatoin_new_tv_img_l_875_1407.jpg" },
  { id: 15, name: "Udaipur", image: "https://hldak.mmtcdn.com/prod-s3-hld-hpcmsadmin/holidays/images/cities/1325/Udaipur3.jpg?downsize=328:200" },
];

const itinerariesData = {
  Goa: [
    { id: 1, name: "Beach Relaxation Trip", days: 4, cost: "₹12,000", details: ["Day 1: Baga Beach", "Day 2: Fort Aguada", "Day 3: Water Sports", "Day 4: Old Goa Churches"] },
    { id: 2, name: "Adventure & Parties", days: 5, cost: "₹18,000", details: ["Day 1: Anjuna Beach", "Day 2: Water Sports", "Day 3: Casino Night", "Day 4: Dudhsagar Falls", "Day 5: Clubbing"] },
    { id: 3, name: "Goa Cultural Tour", days: 3, cost: "₹10,000", details: ["Day 1: Old Goa", "Day 2: Local Food Tour", "Day 3: Spice Plantations"] }
  ],
  Jaipur: [
    { id: 1, name: "Royal Heritage Tour", days: 3, cost: "₹15,000", details: ["Day 1: Amber Fort", "Day 2: City Palace", "Day 3: Hawa Mahal"] },
    { id: 2, name: "Shopping & Food Walk", days: 2, cost: "₹8,000", details: ["Day 1: Johari Bazaar", "Day 2: Rajasthani Thali"] },
    { id: 3, name: "Jaipur Forts Trip", days: 4, cost: "₹14,000", details: ["Day 1: Nahargarh", "Day 2: Jaigarh", "Day 3: Amber", "Day 4: City Palace"] }
  ],
};

function Itinerary() {
  const [search, setSearch] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [showPlanner, setShowPlanner] = useState(false);

  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  // if planner mode, render ItineraryPlanner instead
  if (showPlanner) {
    return (
      <ItineraryPlanner onBack={() => setShowPlanner(false)} />
    );
  }

  return (
    <div className="screen-section">
      {/* 🔍 Search Bar + Create Button */}
      <div className="search-bar big">
        <input
          type="text"
          placeholder="Search your travel destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="flashy-btn" onClick={() => setShowPlanner(true)}>
          ✨ Create your own!
        </button>
      </div>

      {/* Destination Grid */}
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

      {/* Itinerary Popup */}
      {selectedDestination && !selectedItinerary && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{selectedDestination} Itineraries</h2>
            <ul className="itinerary-list">
              {itinerariesData[selectedDestination]?.map((it) => (
                <li key={it.id} onClick={() => setSelectedItinerary(it)}>
                  {it.name} - {it.days} days - {it.cost}
                </li>
              )) || <p>No itineraries available</p>}
            </ul>
            <div className="modal-actions">
              <button className="close-btn" onClick={() => setSelectedDestination(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Itinerary View */}
      {selectedItinerary && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{selectedItinerary.name}</h2>
            <h4>{selectedItinerary.days} Days - {selectedItinerary.cost}</h4>
            <ul>
              {selectedItinerary.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
            <div className="modal-actions">
              <button>Add to Cart</button>
              <button className="close-btn" onClick={() => setSelectedItinerary(null)}>Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Itinerary;
