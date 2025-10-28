import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [flightPayments, setFlightPayments] = useState([]);
  const [hotelPayments, setHotelPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('flights');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [flightData, hotelData] = await Promise.all([
          axios.get('http://localhost:4000/api/admin/by-type/flight', { headers }),
          axios.get('http://localhost:4000/api/admin/by-type/hotel', { headers })
        ]);

        setFlightPayments(flightData.data);
        setHotelPayments(hotelData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-dashboard" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading payment data...</h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={summaryCardStyle}>
          <h3>Total Flight Bookings</h3>
          <p>{flightPayments.length}</p>
        </div>
        <div style={summaryCardStyle}>
          <h3>Total Hotel Bookings</h3>
          <p>{hotelPayments.length}</p>
        </div>
        <div style={summaryCardStyle}>
          <h3>Total Revenue</h3>
          <p>{formatAmount(
            [...flightPayments, ...hotelPayments].reduce((sum, payment) => sum + payment.amount, 0)
          )}</p>
        </div>
      </div>

      {/* Tab Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'flights' ? '#003580' : '#f8f9fa',
            color: activeTab === 'flights' ? 'white' : '#333'
          }}
          onClick={() => setActiveTab('flights')}
        >
          Flight Bookings
        </button>
        <button
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'hotels' ? '#003580' : '#f8f9fa',
            color: activeTab === 'hotels' ? 'white' : '#333'
          }}
          onClick={() => setActiveTab('hotels')}
        >
          Hotel Bookings
        </button>
      </div>

      {/* Payments Table */}
      <div style={tableContainerStyle}>
        {activeTab === 'flights' ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Payment ID</th>
                <th style={thStyle}>PNR</th>
                <th style={thStyle}>Passenger</th>
                <th style={thStyle}>Route</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {flightPayments.map(payment => (
                <tr key={payment.paymentId}>
                  <td style={tdStyle}>{payment.paymentId}</td>
                  <td style={tdStyle}>{payment.pnr}</td>
                  <td style={tdStyle}>{payment.passengerName}</td>
                  <td style={tdStyle}>{`${payment.departure} → ${payment.arrival}`}</td>
                  <td style={tdStyle}>{formatAmount(payment.amount)}</td>
                  <td style={tdStyle}>
                    <span style={getStatusBadgeStyle(payment.status)}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={tdStyle}>{formatDate(payment.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Payment ID</th>
                <th style={thStyle}>Guest</th>
                <th style={thStyle}>Hotel</th>
                <th style={thStyle}>Room Type</th>
                <th style={thStyle}>Check In/Out</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {hotelPayments.map(payment => (
                <tr key={payment.paymentId}>
                  <td style={tdStyle}>{payment.paymentId}</td>
                  <td style={tdStyle}>{payment.guestName}</td>
                  <td style={tdStyle}>{payment.hotelName}</td>
                  <td style={tdStyle}>{payment.roomType}</td>
                  <td style={tdStyle}>{`${formatDate(payment.checkIn)} - ${formatDate(payment.checkOut)}`}</td>
                  <td style={tdStyle}>{formatAmount(payment.amount)}</td>
                  <td style={tdStyle}>
                    <span style={getStatusBadgeStyle(payment.status)}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={tdStyle}>{formatDate(payment.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Styles
const summaryCardStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const tableContainerStyle = {
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '20px',
  overflowX: 'auto'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '10px'
};

const thStyle = {
  backgroundColor: '#f8f9fa',
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #dee2e6'
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #dee2e6'
};

const tabButtonStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  marginRight: '10px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const getStatusBadgeStyle = (status) => ({
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold',
  backgroundColor: 
    status === 'completed' ? '#d4edda' :
    status === 'pending' ? '#fff3cd' :
    '#f8d7da',
  color:
    status === 'completed' ? '#155724' :
    status === 'pending' ? '#856404' :
    '#721c24'
});

export default AdminDashboard;