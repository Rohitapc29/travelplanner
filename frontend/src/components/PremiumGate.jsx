import React from 'react';

const PremiumGate = ({ children, feature, fallback }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPremium = user?.isPremium || false;
  
  if (isPremium) {
    return children;
  }
  
  if (fallback) {
    return fallback;
  }
  
  return (
    <div style={{
      padding: '20px',
      border: '2px solid #ffc107',
      borderRadius: '8px',
      textAlign: 'center',
      background: 'linear-gradient(45deg, #fff9c4, #ffffff)',
      margin: '20px 0'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔒</div>
      <h3 style={{ color: '#856404', marginBottom: '12px' }}>
        Premium Feature
      </h3>
      <p style={{ color: '#664d03', marginBottom: '16px' }}>
        {feature || 'This feature requires a premium subscription'}
      </p>
      <button
        onClick={() => window.location.hash = '#premium'}
        style={{
          padding: '12px 24px',
          backgroundColor: '#ffc107',
          color: '#212529',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Upgrade to Premium
      </button>
    </div>
  );
};

export default PremiumGate;
