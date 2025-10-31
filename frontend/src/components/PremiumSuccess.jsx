import React, { useEffect, useState } from 'react';

const PremiumSuccess = () => {
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    let isMounted = true; 
    
    const processPayment = async () => {
      try {
        
        
        const hash = window.location.hash;
        console.log('Full hash:', hash);
        
        const hashParams = hash.includes('?') ? hash.split('?')[1] : '';
        const urlParams = new URLSearchParams(hashParams);
        
        const sessionId = urlParams.get('session_id');
        const subscriptionType = urlParams.get('type');
        
        
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('👤 Current user:', { id: user._id, email: user.email });
        
        if (sessionId && subscriptionType && user._id) {
          
          const response = await fetch('http://localhost:4000/api/subscription/payment-success', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              session_id: sessionId,
              subscriptionType: subscriptionType,
              userId: user._id
            })
          });
          
          console.log('📡 Payment API response status:', response.status);
          const data = await response.json();
        
          if (!isMounted) return;
          
          if (response.ok) {
          
            
            const token = localStorage.getItem('token');
            if (token) {
              const userResponse = await fetch('http://localhost:4000/api/users/verify-token', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                localStorage.setItem('user', JSON.stringify(userData.user));
              } else {
                console.error('❌ Failed to refresh user data:', await userResponse.text());
              }
            }
            
            setSuccess(true);
          } else {
            
            setSuccess(false);
          }
        } else {
          console.error('Missing required params:', { 
            sessionId: !!sessionId, 
            subscriptionType: !!subscriptionType, 
            userId: !!user._id 
          });
          setSuccess(false);
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        if (isMounted) setSuccess(false);
      } finally {
        if (isMounted) {
          console.log('Payment processing completed');
          setProcessing(false);
        }
      }
    };

    const timer = setTimeout(() => {
      processPayment();
    }, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []); 

  if (processing) {
    return (
      <div style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⏳</div>
          <h2>Processing Your Payment...</h2>
          <p style={{ color: '#666' }}>Please wait while we activate your premium account.</p>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '20px' }}>
            Check browser console for detailed logs
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px',
      background: success ? 'linear-gradient(45deg, #f0fff4, #ffffff)' : 'linear-gradient(45deg, #fff5f5, #ffffff)'
    }}>
      <div style={{ 
        textAlign: 'center',
        maxWidth: '600px',
        padding: '40px',
        border: `2px solid ${success ? '#28a745' : '#dc3545'}`,
        borderRadius: '12px',
        background: 'white'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>
          {success ? '🎉' : '❌'}
        </div>
        
        <h2 style={{ 
          color: success ? '#28a745' : '#dc3545', 
          marginBottom: '16px' 
        }}>
          {success ? 'Welcome to Premium!' : 'Payment Processing Failed'}
        </h2>
        
        <p style={{ 
          color: '#666', 
          fontSize: '16px', 
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          {success ? (
            <>
              🚀 Your premium subscription is now active! You can now enjoy:<br/>
              ✅ Unlimited itinerary planning<br/>
              ✅ All destinations worldwide<br/>
              ✅ Custom drag-drop builder<br/>
              ✅ PDF export and priority support
            </>
          ) : (
            <>
              We couldn't process your payment automatically. Please check the console logs or contact support.
            </>
          )}
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => {
              if (success) {
                
                window.location.href = window.location.origin + '/#itinerary';
              } else {
                window.location.href = window.location.origin + '/#home';
              }
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: success ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {success ? 'Start Planning (Reload Page)' : 'Go Home'}
          </button>
          
          {!success && (
            <button
              onClick={() => window.location.href = window.location.origin + '/#premium'}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumSuccess;