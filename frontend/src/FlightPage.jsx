import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FlightPage() {
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    date: "",
    travelClass: "ECONOMY",
    airline: "",
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  // --- STYLES ---
  const inputStyle = {
    padding: "12px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box", 
    minWidth: "180px",
    height: "46px", 
  };

  const buttonStyle = {
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "bold",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    height: "46px", 
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  };
  // --- END STYLES ---

  const update = (key, value) => setFilters({ ...filters, [key]: value });

  const searchAirports = async (keyword, type) => {
    if (keyword.length < 2) {
      if (type === "origin") setOriginSuggestions([]);
      else setDestSuggestions([]);
      return;
    }

    try {
      const res = await axios.get("http://localhost:4000/api/airports/search", {
        params: { keyword },
      });
      if (type === "origin") setOriginSuggestions(res.data);
      else setDestSuggestions(res.data);
    } catch (err) {
      console.error("Airport search failed:", err);
    }
  };

  const selectAirport = (airport, type) => {
    update(type, airport.iataCode);
    if (type === "origin") setOriginSuggestions([]);
    else setDestSuggestions([]);
  };

  const searchFlights = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/flights/search", {
        params: filters,
      });
      setFlights(res.data);
    } catch (err) {
      alert("Error fetching flights. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setShowBookingForm(true);
  };

  const proceedToSeatMap = (booking) => {
    setBookingData(booking);
    setShowSeatMap(true);
    setShowBookingForm(false);
  };

  const proceedToServices = (selectedSeat) => {
    setShowServices(true);
    setShowSeatMap(false);
    if (bookingData && selectedSeat) {
      setBookingData({
        ...bookingData,
        selectedSeat: selectedSeat,
      });
    }
  };

  if (showServices) {
    return (
      <ServicesPage
        booking={bookingData}
        flight={selectedFlight}
        onBack={() => {
          setShowServices(false);
          setShowSeatMap(true);
        }}
      />
    );
  }

  if (showSeatMap) {
    return (
      <SeatMapPage
        booking={bookingData}
        flight={selectedFlight}
        onBack={() => {
          setShowSeatMap(false);
          setShowBookingForm(true);
        }}
        onProceedToServices={proceedToServices}
      />
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2
        style={{ marginTop: "20px", marginBottom: "20px", textAlign: "center" }}
      >
        Search Flights ✈️
      </h2>

      {!showBookingForm ? (
        <>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: 20,
              padding: "20px",
              backgroundColor: "#daf2f1ff", // Changed back to white as per your screenshot
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)", // Slightly enhanced shadow
              alignItems: "center", 
              justifyContent: "center", 
            }}
          >
            {/* Origin Input */}
            <div style={{ position: "relative" }}>
              <input
                placeholder="Origin (e.g., Mumbai)"
                value={filters.origin}
                onChange={(e) => {
                  update("origin", e.target.value);
                  searchAirports(e.target.value, "origin");
                }}
                style={{ ...inputStyle, width: "200px" }} 
              />
              {originSuggestions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    background: "white",
                    border: "1px solid #ccc",
                    zIndex: 10,
                    width: "100%",
                    maxHeight: "200px",
                    overflow: "auto",
                  }}
                >
                  {originSuggestions.map((airport, index) => (
                    <div
                      key={`origin-${airport.iataCode}-${index}`}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        fontSize: "14px",
                      }}
                      onClick={() => selectAirport(airport, "origin")}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#f0f0f0")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "white")
                      }
                    >
                      <strong>{airport.iataCode}</strong> - {airport.name}
                      <br />
                      <small>
                        {airport.city}, {airport.country}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Input */}
            <div style={{ position: "relative" }}>
              <input
                placeholder="Destination (e.g., Delhi)"
                value={filters.destination}
                onChange={(e) => {
                  update("destination", e.target.value);
                  searchAirports(e.target.value, "dest");
                }}
                style={{ ...inputStyle, width: "200px" }} 
              />
              {destSuggestions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    background: "white",
                    border: "1px solid #ccc",
                    zIndex: 10,
                    width: "100%",
                    maxHeight: "200px",
                    overflow: "auto",
                  }}
                >
                  {destSuggestions.map((airport, index) => (
                    <div
                      key={`dest-${airport.iataCode}-${index}`}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        fontSize: "14px",
                      }}
                      onClick={() => selectAirport(airport, "dest")}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#f0f0f0")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "white")
                      }
                    >
                      <strong>{airport.iataCode}</strong> - {airport.name}
                      <br />
                      <small>
                        {airport.city}, {airport.country}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Input */}
            <input
              type="date"
              placeholder="dd-mm-yyyy" // Placeholder isn't really effective on type=date
              value={filters.date}
              onChange={(e) => update("date", e.target.value)}
              style={inputStyle} 
            />

            {/* Travel Class Select */}
            <select
              value={filters.travelClass}
              onChange={(e) => update("travelClass", e.target.value)}
              style={inputStyle} 
            >
              <option value="ECONOMY">Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First</option>
            </select>

            {/* Airline Input */}
            <input
              placeholder="Airline Code (optional)"
              value={filters.airline}
              onChange={(e) => update("airline", e.target.value.toUpperCase())}
              style={inputStyle} 
            />

            {/* Search Button */}
            <button
              onClick={searchFlights}
              disabled={loading}
              style={loading ? disabledButtonStyle : buttonStyle} 
            >
              {loading ? "Searching..." : "Search Flights"}
            </button>
          </div>

          <hr />

          {/* *** THIS IS THE CHANGED PART ***
            It now shows <EmptyState /> when flights.length is 0
          */}
          {flights.length > 0 ? (
            flights.map((f) => (
              <EnhancedFlightCard
                key={f.id}
                flight={f}
                onSelect={handleSelectFlight}
              />
            ))
          ) : (
            <EmptyState />
          )}
          {/* *** END OF CHANGE *** */}

        </>
      ) : (
        <BookingForm
          flight={selectedFlight}
          onBack={() => setShowBookingForm(false)}
          onProceedToSeatMap={proceedToSeatMap}
        />
      )}
    </div>
  );
}

// ... (EnhancedFlightCard, WeatherInfo, BookingForm, SeatMapPage, SeatButton, ServicesPage are all unchanged) ...

function EnhancedFlightCard({ flight, onSelect }) {
  return (
    <div style={{ 
      border: "1px solid #ccc", 
      padding: 20, 
      marginBottom: 15,
      borderRadius: 8,
      backgroundColor: "#f9f9f9"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
            <h3 style={{ margin: "0", marginRight: "15px" }}>
              {flight.airlineName} ({flight.airline})
            </h3>
            <span style={{ 
              backgroundColor: "#007bff", 
              color: "white", 
              padding: "2px 8px", 
              borderRadius: "4px",
              fontSize: "12px"
            }}>
              {flight.flightNumber}
            </span>
          </div>
          
          <div style={{ display: "flex", gap: "40px", margin: "15px 0" }}>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>{flight.departure?.iataCode}</div>
              <div style={{ fontSize: "16px" }}>{flight.departure?.time}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Terminal {flight.departure?.terminal} • Gate {flight.departure?.gate}
              </div>
            </div>
            
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>{flight.duration}</div>
              <div style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
                {flight.stops === 0 ? "Non-stop" : `${flight.stops} stops`}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {flight.aircraft?.type || String(flight.aircraft) || 'Unknown Aircraft'} • {flight.aircraft?.totalSeats || 'N/A'} seats
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>{flight.arrival?.iataCode}</div>
              <div style={{ fontSize: "16px" }}>{flight.arrival?.time}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Terminal {flight.arrival?.terminal} • Gate {flight.arrival?.gate}
              </div>
            </div>
          </div>
          
          <WeatherInfo cityCode={flight.arrival?.iataCode} />
          
          <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: "#666", marginTop: "15px" }}>
            <span>🍽️ {flight.amenities?.includes("Meal") ? "Meal included" : "Buy on board"}</span>
            <span>📶 {flight.amenities?.includes("WiFi") ? "WiFi available" : "No WiFi"}</span>
            <span>🎬 {flight.amenities?.includes("Entertainment") ? "Entertainment" : ""}</span>
            <span>🧳 Baggage: {flight.baggage?.included}</span>
          </div>
        </div>
        
        <div style={{ textAlign: "right", marginLeft: "30px" }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
            ₹{flight.inflatedPrice}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
            includes taxes & fees
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
            Class: {flight.cabinClass}
          </div>
          <button 
            onClick={() => onSelect(flight)}
            style={{ 
              padding: "12px 24px", 
              backgroundColor: "#28a745", 
              color: "white", 
              border: "none", 
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            Book This Flight
          </button>
        </div>
      </div>
    </div>
  );
}

function WeatherInfo({ cityCode }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/weather/${cityCode}`);
        setWeather(res.data);
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      }
    };
    
    if (cityCode) {
      fetchWeather();
    }
  }, [cityCode]);

  if (!weather) return null;

  return (
    <div style={{ 
      padding: "8px", 
      backgroundColor: "#f0f8ff", 
      borderRadius: "4px",
      marginTop: "10px",
      fontSize: "12px"
    }}>
      <div>
        <span>🌡️ {weather.city}: {weather.temperature}°C</span>
        <span style={{ marginLeft: "15px" }}>💧 Humidity: {weather.humidity}%</span>
      </div>
      <div style={{ marginTop: "4px" }}>
        <span>{weather.condition}</span>
        {weather.rainfall && <span style={{ marginLeft: "15px" }}>🌧️ Chance of rain: {weather.rainfall}%</span>}
      </div>
    </div>
  );
}

function BookingForm({ flight, onBack, onProceedToSeatMap }) {
  const [passenger, setPassenger] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: ""
  });
  const [loading, setLoading] = useState(false);

  const updatePassenger = (key, value) => {
    setPassenger({ ...passenger, [key]: value });
  };

  const handleBooking = async () => {
    if (!passenger.firstName || !passenger.lastName || !passenger.email) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        flightOffer: flight,
        passengers: [passenger],
        contactInfo: {
          email: passenger.email,
          phone: passenger.phone
        }
      };

      const bookingRes = await axios.post("http://localhost:4000/api/booking/create", bookingData);
      
      if (bookingRes.data.success) {
        onProceedToSeatMap(bookingRes.data.booking);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert(`Booking failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={onBack} 
        style={{ 
          marginBottom: 20, 
          padding: "8px 16px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        ← Back to Flights
      </button>
      
      <h3>Flight Summary</h3>
      <div style={{ 
        border: "1px solid #ccc", 
        padding: 20, 
        marginBottom: 20, 
        borderRadius: 8,
        backgroundColor: "#f8f9fa"
      }}>
        <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
          {flight.airlineName} {flight.flightNumber}
        </div>
        <div style={{ margin: "5px 0" }}>
          <strong>{flight.departure?.iataCode}</strong> ({flight.departure?.time}) → 
          <strong> {flight.arrival?.iataCode}</strong> ({flight.arrival?.time})
        </div>
        <div style={{ margin: "5px 0" }}>
          Duration: {flight.duration} | Class: {flight.cabinClass} | Aircraft: {flight.aircraft?.type || String(flight.aircraft) || 'Unknown'}
        </div>
        <div style={{ fontWeight: "bold", marginTop: "15px", fontSize: "20px", color: "#007bff" }}>
          Base Price: ₹{flight.inflatedPrice}
        </div>
        <div style={{ fontSize: "12px", color: "#666" }}>
          Next: Seat selection → Additional services → Payment
        </div>
      </div>

      <h3>Passenger Details</h3>
      <div style={{ 
        display: "grid", 
        gap: "15px", 
        maxWidth: "500px",
        marginBottom: "20px"
      }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            First Name *
          </label>
          <input
            type="text"
            value={passenger.firstName}
            onChange={(e) => updatePassenger("firstName", e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
            required
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Last Name *
          </label>
          <input
            type="text"
            value={passenger.lastName}
            onChange={(e) => updatePassenger("lastName", e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
            required
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Email *
          </label>
          <input
            type="email"
            value={passenger.email}
            onChange={(e) => updatePassenger("email", e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
            required
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Phone *
          </label>
          <input
            type="tel"
            value={passenger.phone}
            onChange={(e) => updatePassenger("phone", e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
            required
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Date of Birth
          </label>
          <input
            type="date"
            value={passenger.dateOfBirth}
            onChange={(e) => updatePassenger("dateOfBirth", e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        
        <button 
          onClick={handleBooking}
          disabled={loading || !passenger.firstName || !passenger.lastName || !passenger.email || !passenger.phone}
          style={{ 
            padding: "15px", 
            backgroundColor: loading ? "#ccc" : "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: 6,
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 15
          }}
        >
          {loading ? "Creating Booking..." : "Continue to Seat Selection →"}
        </button>
      </div>
    </div>
  );
}

function SeatMapPage({ booking, flight, onBack, onProceedToServices }) {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatMap, setSeatMap] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const aircraftType = flight.aircraft?.type || String(flight.aircraft) || "Boeing 737-800";
    const mockSeatMap = generateSeatMap(aircraftType);
    setSeatMap(mockSeatMap);
    setLoading(false);
  }, [flight]);

  const generateSeatMap = (aircraftType) => {
    const totalRows = aircraftType === "Boeing 737-800" ? 27 : 25;
    const rows = [];

    for (let row = 1; row <= totalRows; row++) {
      const rowData = {
        number: row,
        seats: []
      };

      ['A', 'B', 'C', 'D', 'E', 'F'].forEach(letter => {
        const seatNumber = `${row}${letter}`;
        const isOccupied = Math.random() < 0.3; 
        const isPremium = row <= 5; 
        const isEmergencyExit = row === 12 || row === 13; 
        
        rowData.seats.push({
          number: seatNumber,
          type: letter === 'A' || letter === 'F' ? 'window' : 
                letter === 'C' || letter === 'D' ? 'aisle' : 'middle',
          status: isOccupied ? 'occupied' : 'available',
          premium: isPremium,
          emergencyExit: isEmergencyExit,
          price: isPremium ? "1000" : isEmergencyExit ? "1500" : "500"
        });
      });

      rows.push(rowData);
    }

    return {
      aircraft: aircraftType,
      rows: rows,
      legend: {
        available: "Available",
        occupied: "Occupied", 
        premium: "Premium (Extra legroom)",
        emergency: "Emergency Exit (Extra legroom)",
        selected: "Selected"
      }
    };
  };

  const selectSeat = (seat) => {
    if (seat.status === 'occupied') return;
    setSelectedSeat(seat);
  };

  const proceedToServices = () => {
    onProceedToServices(selectedSeat);
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading seat map...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <button 
        onClick={onBack} 
        style={{ 
          marginBottom: 20, 
          padding: "8px 16px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        ← Back to Passenger Details
      </button>

      <h2>Select Your Seat</h2>
      <p>PNR: <strong>{booking.pnr}</strong> | Aircraft: <strong>{seatMap.aircraft}</strong></p>

      <div style={{ display: "flex", gap: "30px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            border: "2px solid #333", 
            borderRadius: "20px 20px 8px 8px", 
            padding: "20px",
            backgroundColor: "#f8f9fa",
            maxWidth: "400px"
          }}>
            <div style={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold" }}>
              Front of Aircraft
            </div>
            
            {seatMap.rows.map(row => (
              <div key={row.number} style={{ 
                display: "flex", 
                alignItems: "center", 
                marginBottom: "5px",
                fontSize: "12px"
              }}>
                <div style={{ width: "25px", textAlign: "center", fontWeight: "bold" }}>
                  {row.number}
                </div>
                
                
                {row.seats.slice(0, 3).map(seat => (
                  <SeatButton key={seat.number} seat={seat} selected={selectedSeat} onSelect={selectSeat} />
                ))}
                
                
                <div style={{ width: "20px" }}></div>
                
                
                {row.seats.slice(3, 6).map(seat => (
                  <SeatButton key={seat.number} seat={seat} selected={selectedSeat} onSelect={selectSeat} />
                ))}
              </div>
            ))}
          </div>
        </div>

       
        <div style={{ width: "300px" }}>
          <h4>Seat Legend</h4>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ 
                width: "20px", 
                height: "20px", 
                backgroundColor: "#28a745", 
                marginRight: "10px",
                borderRadius: "4px"
              }}></div>
              Available (₹500)
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ 
                width: "20px", 
                height: "20px", 
                backgroundColor: "#007bff", 
                marginRight: "10px",
                borderRadius: "4px"
              }}></div>
              Premium (₹1000)
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ 
                width: "20px", 
                height: "20px", 
                backgroundColor: "#ffc107", 
                marginRight: "10px",
                borderRadius: "4px"
              }}></div>
              Emergency Exit (₹1500)
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ 
                width: "20px", 
                height: "20px", 
                backgroundColor: "#dc3545", 
                marginRight: "10px",
                borderRadius: "4px"
              }}></div>
              Occupied
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ 
                width: "20px", 
                height: "20px", 
                backgroundColor: "#8b5cf6", 
                marginRight: "10px",
                borderRadius: "4px",
                border: "2px solid #333"
              }}></div>
              Selected
            </div>
          </div>

          {selectedSeat && (
            <div style={{ 
              border: "1px solid #ddd", 
              padding: "15px", 
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
              marginBottom: "20px"
            }}>
              <h4>Selected Seat</h4>
              <div><strong>Seat:</strong> {selectedSeat.number}</div>
              <div><strong>Type:</strong> {selectedSeat.type}</div>
              <div><strong>Price:</strong> ₹{selectedSeat.price}</div>
              {selectedSeat.premium && <div style={{ color: "#007bff" }}>✓ Premium seat with extra legroom</div>}
              {selectedSeat.emergencyExit && <div style={{ color: "#ffc107" }}>⚠️ Emergency exit row</div>}
            </div>
          )}

          <div style={{ 
            border: "1px solid #ddd", 
            padding: "15px", 
            borderRadius: "8px",
            backgroundColor: "white"
          }}>
            <h4>Price Summary</h4>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span>Base Flight:</span>
              <span>₹{flight.inflatedPrice}</span>
            </div>
            {selectedSeat && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span>Seat {selectedSeat.number}:</span>
                <span>₹{selectedSeat.price}</span>
              </div>
            )}
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
              <span>Subtotal:</span>
              <span>₹{(Number(flight.inflatedPrice) + Number(selectedSeat?.price || 0)).toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={proceedToServices}
            disabled={!selectedSeat}
            style={{ 
              width: "100%",
              padding: "15px", 
              backgroundColor: selectedSeat ? "#28a745" : "#ccc", 
              color: "white", 
              border: "none", 
              borderRadius: 6,
              fontSize: "16px",
              fontWeight: "bold",
              cursor: selectedSeat ? "pointer" : "not-allowed",
              marginTop: 20
            }}
          >
            {selectedSeat ? "Continue to Services →" : "Please select a seat"}
          </button>
        </div>
      </div>
    </div>
  );
}


function SeatButton({ seat, selected, onSelect }) {
  const isSelected = selected?.number === seat.number;
  
  let backgroundColor = "#28a745"; // Available
  if (seat.status === 'occupied') backgroundColor = "#dc3545";
  else if (seat.premium) backgroundColor = "#007bff";
  else if (seat.emergencyExit) backgroundColor = "#ffc107";
  
  if (isSelected) backgroundColor = "#8b5cf6";

  return (
    <div
      onClick={() => onSelect(seat)}
      style={{
        width: "25px",
        height: "25px",
        backgroundColor: backgroundColor,
        margin: "2px",
        borderRadius: "4px",
        cursor: seat.status === 'occupied' ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "10px",
        fontWeight: "bold",
        color: "white",
        border: isSelected ? "2px solid #333" : "none",
        position: "relative"
      }}
      title={`${seat.number} - ${seat.type} - ₹${seat.price} - ${seat.status}`}
    >
      {seat.number.slice(-1)}
    </div>
  );
}

function ServicesPage({ booking, flight, onBack }) {
  const [selectedServices, setSelectedServices] = useState({
    baggage: null,
    meal: null,
    insurance: null
  });
  const [totalAdditionalCost, setTotalAdditionalCost] = useState(0);
  const [loading, setLoading] = useState(false);

  const baggageOptions = flight.baggage?.options || [];
  const mealOptions = flight.mealOptions || [];

  const selectService = (type, service) => {
    const newServices = { ...selectedServices, [type]: service };
    setSelectedServices(newServices);
    
    let total = 0;
    Object.values(newServices).forEach(service => {
      if (service && service.price) {
        total += Number(service.price);
      }
    });
    setTotalAdditionalCost(total);
  };

  const proceedToPayment = async () => {
    setLoading(true);
    try {
      const seatPrice = Number(booking.selectedSeat?.price || 0);
      const finalPrice = Number(flight.inflatedPrice) + seatPrice + totalAdditionalCost;
      
      const paymentData = {
        airline: flight.airline,
        inflatedPrice: finalPrice.toFixed(2),
        departure: `${flight.departure?.iataCode} ${flight.departure?.time}`,
        arrival: `${flight.arrival?.iataCode} ${flight.arrival?.time}`,
        pnr: booking.pnr,
        passengerName: `${booking.passengers[0].firstName} ${booking.passengers[0].lastName}`
      };

      const paymentRes = await axios.post("http://localhost:4000/api/booking/payment/create-session", paymentData);
      
      window.location.href = paymentRes.data.url;
    } catch (err) {
      console.error("Payment error:", err);
      alert(`Payment failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const seatPrice = Number(booking.selectedSeat?.price || 0);

  return (
    <div style={{ padding: 20 }}>
      <button 
        onClick={onBack} 
        style={{ 
          marginBottom: 20, 
          padding: "8px 16px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        ← Back to Seat Selection
      </button>

      <h2>Additional Services</h2>
      <p>PNR: <strong>{booking.pnr}</strong> | Selected Seat: <strong>{booking.selectedSeat?.number || "None"}</strong></p>

      <div style={{ display: "grid", gap: "30px", maxWidth: "800px" }}>
        <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
          <h3>🧳 Extra Baggage</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", padding: "10px", border: "1px solid #eee", borderRadius: 4 }}>
              <input 
                type="radio" 
                name="baggage" 
                onChange={() => selectService('baggage', null)}
                defaultChecked
                style={{ marginRight: 10 }}
              />
              Standard - {flight.baggage?.included} (Included)
            </label>
            {baggageOptions.map((option, index) => (
              <label key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", border: "1px solid #eee", borderRadius: 4 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input 
                    type="radio" 
                    name="baggage" 
                    onChange={() => selectService('baggage', option)}
                    style={{ marginRight: 10 }}
                  />
                  Extra Baggage - {option.weight}
                </div>
                <span style={{ fontWeight: "bold" }}>₹{option.price}</span>
              </label>
            ))}
          </div>
        </div>
        <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
          <h3>Meal Preferences</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            {mealOptions.map((option, index) => (
              <label key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", border: "1px solid #eee", borderRadius: 4 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input 
                    type="radio" 
                    name="meal" 
                    onChange={() => selectService('meal', option)}
                    defaultChecked={index === 0}
                    style={{ marginRight: 10 }}
                  />
                  {option.type} {option.included && "(Included)"}
                </div>
                <span style={{ fontWeight: "bold" }}>
                  {option.price === "0" ? "Free" : `₹${option.price}`}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
          <h3>Travel Insurance</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", padding: "10px", border: "1px solid #eee", borderRadius: 4 }}>
              <input 
                type="radio" 
                name="insurance" 
                onChange={() => selectService('insurance', null)}
                defaultChecked
                style={{ marginRight: 10 }}
              />
              No Insurance
            </label>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", border: "1px solid #eee", borderRadius: 4 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input 
                  type="radio" 
                  name="insurance" 
                  onChange={() => selectService('insurance', { type: 'Basic', price: '500' })}
                  style={{ marginRight: 10 }}
                />
                Basic Coverage - Trip cancellation
              </div>
              <span style={{ fontWeight: "bold" }}>₹500</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", border: "1px solid #eee", borderRadius: 4 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input 
                  type="radio" 
                  name="insurance" 
                  onChange={() => selectService('insurance', { type: 'Comprehensive', price: '1200' })}
                  style={{ marginRight: 10 }}
                />
                Comprehensive - Medical + Cancellation
              </div>
              <span style={{ fontWeight: "bold" }}>₹1200</span>
            </label>
          </div>
        </div>
      </div>

      <div style={{ 
        position: "sticky", 
        bottom: 0, 
        background: "white", 
        border: "1px solid #ddd", 
        padding: 20, 
        borderRadius: 8,
        marginTop: 30,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)"
      }}>
        <h3>Final Price Summary</h3>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span>Base Flight Price:</span>
          <span>₹{flight.inflatedPrice}</span>
        </div>
        {seatPrice > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span>Seat {booking.selectedSeat?.number}:</span>
            <span>₹{seatPrice}</span>
          </div>
        )}
        {totalAdditionalCost > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span>Additional Services:</span>
            <span>₹{totalAdditionalCost}</span>
          </div>
        )}
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold" }}>
          <span>Total Amount:</span>
          <span>₹{(Number(flight.inflatedPrice) + seatPrice + totalAdditionalCost).toFixed(2)}</span>
        </div>
        
        <button 
          onClick={proceedToPayment}
          disabled={loading}
          style={{ 
            width: "100%",
            padding: "15px", 
            backgroundColor: loading ? "#ccc" : "#28a745", 
            color: "white", 
            border: "none", 
            borderRadius: 6,
            fontSize: "18px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 20
          }}
        >
          {loading ? "Processing..." : "Proceed to Payment →"}
        </button>
      </div>
    </div>
    
  );
}

// 
// *** THIS IS THE NEW COMPONENT YOU ASKED FOR ***
//
// Find this component at the bottom of your FlightPage.js file
function EmptyState() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '80px 40px',
      marginTop: '30px',
    
      backgroundColor: '#dbe8f2ff', // A very light blue
      
      borderRadius: '8px',
      border: '1px dashed #a3d9ff', // You might want to match the dashed border to the new background
      color: '#6c757d'
    }}>
      <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px' }}>
        ✈️
      </span>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
        Where are you flying to?
      </h3>
      <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.5' }}>
        Use the search form above to find the best flights
        <br />
        for your next adventure.
      </p>
    </div>
  );
}