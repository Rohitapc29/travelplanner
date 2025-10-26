import React, { useState, useEffect } from 'react';
import { fetchAttractionDetails } from '../services/attractionsAPI';
import './AttractionModal.css';

const AttractionModal = ({ attraction, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      const attractionDetails = await fetchAttractionDetails(attraction);
      setDetails(attractionDetails);
      setLoading(false);
    };

    loadDetails();
  }, [attraction]);

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="attraction-modal" onClick={e => e.stopPropagation()}>
          <div className="loading-spinner">Loading attraction details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="attraction-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{details?.name || attraction.name}</h2>
          <span className="attraction-category">{details?.kinds || attraction.category}</span>
        </div>

        {details?.image && (
          <div className="modal-image">
            <img src={details.image} alt={details.name} />
          </div>
        )}

        <div className="modal-content">
          <div className="attraction-info">
            <h3>About this place</h3>
            <p>{details?.description || attraction.description || 'A wonderful place to visit in your itinerary!'}</p>
            
            <div className="attraction-meta">
              <div className="meta-item">
                <strong>📍 Address:</strong>
                <span>{details?.address || attraction.address}</span>
              </div>
              
              <div className="meta-item">
                <strong> Suggested Duration:</strong>
                <span>{attraction.suggestedDuration} hour{attraction.suggestedDuration > 1 ? 's' : ''}</span>
              </div>

              {details?.openingHours && (
                <div className="meta-item">
                  <strong>🕐 Opening Hours:</strong>
                  <span>{details.openingHours}</span>
                </div>
              )}

              {details?.phone && details.phone !== 'Not available' && (
                <div className="meta-item">
                  <strong> Phone:</strong>
                  <span>{details.phone}</span>
                </div>
              )}

              {details?.fee && details.fee !== 'Contact for details' && (
                <div className="meta-item">
                  <strong> Entry Fee:</strong>
                  <span>{details.fee}</span>
                </div>
              )}

              {details?.rating && (
                <div className="meta-item">
                  <strong>⭐ Rating:</strong>
                  <span>{details.rating}</span>
                </div>
              )}
            </div>

            {(details?.website || attraction.website) && (details?.website !== 'Not available') && (
              <div className="attraction-links">
                <a href={details?.website || attraction.website} target="_blank" rel="noopener noreferrer" className="website-link">
                  🌐 Learn More
                </a>
              </div>
            )}

            <div className="data-source">
              <small>Data source: {attraction.source === 'openstreetmap' ? 'OpenStreetMap' : 'Wikipedia'}</small>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="add-to-itinerary-btn" onClick={onClose}>
            ✅ Keep in Itinerary
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttractionModal;