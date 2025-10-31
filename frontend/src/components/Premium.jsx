import React, { useState } from 'react';

const Premium = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = user && user.email;
  const isPremium = user?.isPremium || false;

  const plans = [
    {
      type: 'free',
      name: 'Free Plan',
      price: '₹0',
      period: 'forever',
      features: [
        '✅ 2-day itineraries max',
        '✅ 3 destinations only',
        '✅ Pre-made itineraries',
        '✅ Flight & hotel booking',
        '❌ Custom itinerary builder',
        '❌ Unlimited destinations',
        '❌ PDF export',
        '❌ Priority support'
      ],
      color: '#6c757d',
      recommended: false
    },
    {
      type: 'monthly',
      name: 'Premium Monthly',
      price: '₹499',
      period: 'per month',
      features: [
        '✅ Unlimited itinerary days',
        '✅ More destinations available',
        '✅ Custom drag-drop planner',
        '✅ Flight & hotel booking',
        '✅ PDF export',
        '✅ Priority customer support',
        '✅ Weather integration'
      ],
      color: '#007bff',
      recommended: true
    },
    {
      type: 'yearly',
      name: 'Premium Yearly',
      price: '₹4,999',
      period: 'per year',
      originalPrice: '₹5,988',
      discount: 'Save ₹989',
      features: [
        '✅ Everything in Monthly',
        '✅ 2 months FREE',
        '✅ Priority feature requests',
        '✅ Advanced analytics',
        '✅ White-glove support',
        '✅ Beta feature access',
        '✅ Custom branding (coming soon)'
      ],
      color: '#28a745',
      recommended: false
    }
  ];

  const handleUpgrade = async (planType) => {
    if (!isLoggedIn) {
      alert('Please log in to upgrade to premium');
      return;
    }

    if (planType === 'free') return;

    setLoading(true);
    setSelectedPlan(planType);

    try {
      console.log('🔄 Starting premium upgrade:', planType);
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/subscription/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscriptionType: planType
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Stripe session created, redirecting...');
        window.location.href = data.url;
      } else {
        console.error('❌ Failed to create checkout session:', data.error);
        alert('Failed to start payment process: ' + data.error);
      }
    } catch (error) {
      console.error('❌ Upgrade error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  // If already premium, show success message
  if (isPremium) {
    return (
      <div style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '120px 40px 40px' // Changed from '40px' - added top padding
      }}>
        <div style={{ 
          textAlign: 'center',
          maxWidth: '500px',
          padding: '40px',
          border: '2px solid #28a745',
          borderRadius: '12px',
          background: 'linear-gradient(45deg, #f0fff4, #ffffff)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ color: '#28a745', marginBottom: '16px' }}>You're Premium!</h2>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
            Enjoy unlimited itinerary planning and all premium features.
          </p>
          <div style={{ 
            fontSize: '14px', 
            color: '#888',
            marginBottom: '24px'
          }}>
            <strong>Plan:</strong> {user.subscriptionType || 'Premium'}<br/>
            {user.premiumExpiryDate && (
              <>
                <strong>Expires:</strong> {new Date(user.premiumExpiryDate).toLocaleDateString()}
              </>
            )}
          </div>
          <button
            onClick={() => window.location.hash = '#itinerary'}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Start Planning Your Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '80vh',
      padding: '120px 20px 40px', // Changed from '40px 20px' - added 80px top padding
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🚀 Upgrade to Premium
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.9 }}>
            Unlock unlimited travel planning and premium features
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {plans.map((plan) => (
            <div 
              key={plan.type}
              style={{
                background: plan.recommended ? 'linear-gradient(145deg, #ffffff, #f8f9fa)' : 'rgba(255,255,255,0.95)',
                border: plan.recommended ? '3px solid #FFD700' : '1px solid #ddd',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                color: '#333',
                position: 'relative',
                transform: plan.recommended ? 'scale(1.05)' : 'scale(1)',
                boxShadow: plan.recommended ? '0 20px 40px rgba(0,0,0,0.2)' : '0 10px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              {plan.recommended && (
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  color: '#333',
                  padding: '8px 24px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  🌟 MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold',
                  color: plan.color,
                  marginBottom: '8px'
                }}>
                  {plan.name}
                </h3>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold',
                    color: plan.color
                  }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '16px', color: '#666' }}>
                    /{plan.period}
                  </span>
                </div>
                {plan.originalPrice && (
                  <div style={{ fontSize: '14px', color: '#888' }}>
                    <span style={{ textDecoration: 'line-through' }}>
                      {plan.originalPrice}
                    </span>
                    <span style={{ 
                      color: '#28a745', 
                      fontWeight: 'bold',
                      marginLeft: '8px'
                    }}>
                      {plan.discount}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '32px', textAlign: 'left' }}>
                {plan.features.map((feature, index) => (
                  <div key={index} style={{ 
                    padding: '8px 0',
                    fontSize: '14px',
                    color: feature.startsWith('❌') ? '#999' : '#333'
                  }}>
                    {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.type)}
                disabled={loading && selectedPlan === plan.type}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: plan.type === 'free' ? '#6c757d' : plan.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: plan.type === 'free' ? 'default' : 'pointer',
                  opacity: plan.type === 'free' ? 0.6 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {loading && selectedPlan === plan.type ? (
                  '⏳ Processing...'
                ) : plan.type === 'free' ? (
                  'Current Plan'
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div style={{ 
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '24px', fontSize: '24px' }}>
            🎯 Why Upgrade to Premium?
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
              <h4>Unlimited Planning</h4>
              <p style={{ opacity: 0.9 }}>Create itineraries for any duration to any destination</p>
            </div>
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
              <h4>Custom Builder</h4>
              <p style={{ opacity: 0.9 }}>Drag-drop itinerary builder with real-time weather and attractions</p>
            </div>
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
              <h4>Export & Share</h4>
              <p style={{ opacity: 0.9 }}>Download your itineraries as PDF and share with travel companions</p>
            </div>
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎧</div>
              <h4>Priority Support</h4>
              <p style={{ opacity: 0.9 }}>Get dedicated customer support and priority feature requests</p>
            </div>
          </div>
        </div>

        {!isLoggedIn && (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            marginTop: '40px'
          }}>
            <p style={{ marginBottom: '16px', fontSize: '16px' }}>
              🔒 Please log in to upgrade to premium
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#fff',
                color: '#333',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Premium;