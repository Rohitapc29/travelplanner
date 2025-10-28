import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const pnr = searchParams.get('pnr');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (pnr && sessionId) {
      updatePaymentStatus(sessionId);
      fetchBookingDetails();
    } else if (pnr) {
      fetchBookingDetails();
    }
  }, [pnr]);

  const updatePaymentStatus = async (sessionId) => {
    try {
      await axios.post('http://localhost:4000/api/booking/payment/success', { sessionId });
    } catch (err) {
      console.error("Failed to update payment status:", err);
    }
  };

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/booking/${pnr}`);
      setBooking(res.data);
      
      await axios.post('http://localhost:4000/api/booking/payment/success', { pnr });
    } catch (err) {
      console.error("Failed to fetch booking details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#f0f4f8",
      padding: "20px"
    }}>
      <div style={{
        padding: 40,
        background: "white",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "600px",
        width: "100%"
      }}>
        <h1 style={{ color: "green", marginBottom: 20 }}>✅ Payment Successful!</h1>
        
        {loading && <p>Loading booking details...</p>}
        
        {booking && (
          <div style={{ textAlign: "left", marginTop: "20px" }}>
            <h3>Booking Confirmation</h3>
            <div style={{ 
              background: "#f8f9fa", 
              padding: "15px", 
              borderRadius: "8px",
              marginBottom: "15px"
            }}>
              <strong>PNR: {booking.pnr}</strong><br/>
              <small>Booking Date: {new Date(booking.bookingDate).toLocaleString()}</small>
            </div>
            
            <h4>Flight Details</h4>
            <div style={{ 
              border: "1px solid #ddd", 
              padding: "15px", 
              borderRadius: "8px",
              marginBottom: "15px"
            }}>
              <div><strong>{booking.flight.airlineName}</strong> ({booking.flight.airline})</div>
              <div style={{ margin: "5px 0" }}>
                {booking.flight.departure?.iataCode} ({booking.flight.departure?.time}) → 
                {booking.flight.arrival?.iataCode} ({booking.flight.arrival?.time})
              </div>
              <div>Duration: {booking.flight.duration}</div>
              <div>Class: {booking.flight.cabinClass}</div>
              <div style={{ fontWeight: "bold", marginTop: "5px" }}>
                Total Paid: ₹{booking.totalPrice}
              </div>
            </div>
            
            <h4>Passenger Information</h4>
            <div style={{ 
              border: "1px solid #ddd", 
              padding: "15px", 
              borderRadius: "8px",
              marginBottom: "15px"
            }}>
              {booking.passengers.map((passenger, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <strong>{passenger.firstName} {passenger.lastName}</strong><br/>
                  <small>Email: {passenger.email}</small><br/>
                  {passenger.phone && <small>Phone: {passenger.phone}</small>}
                </div>
              ))}
            </div>
            
            <div style={{ 
              background: "#d4edda", 
              border: "1px solid #c3e6cb",
              padding: "10px", 
              borderRadius: "8px",
              marginBottom: "15px",
              color: "#155724"
            }}>
              <strong>✓ Booking Confirmed</strong><br/>
              <small>Please save your PNR for future reference</small>
            </div>
          </div>
        )}
        
        {!booking && !loading && pnr && (
          <p style={{ color: "red" }}>Unable to load booking details for PNR: {pnr}</p>
        )}
        
        {!pnr && (
          <p>Thank you for booking your flight with us.</p>
        )}
        
        <div style={{ marginTop: "20px" }}>
          <Link 
            to="/flights" 
            style={{ 
              color: "#1a73e8", 
              textDecoration: "underline",
              marginRight: "20px"
            }}
          >
            Book Another Flight
          </Link>
          <Link 
            to="/" 
            style={{ color: "#1a73e8", textDecoration: "underline" }}
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
