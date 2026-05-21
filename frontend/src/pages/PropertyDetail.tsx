import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertiesAPI } from '../api';
import { transformProperty } from '../utils/propertyUtils';
import type { Property } from '../utils/propertyUtils';
import { MapPin, Maximize2, Tag, Calendar, ChevronLeft, Star, Phone, Mail } from 'lucide-react';
import './PropertyDetail.css';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const response = await propertiesAPI.getById(id);
        const transformed = transformProperty(response.data);
        if (transformed) {
          setProperty(transformed);
          setActiveImage(transformed.image);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error fetching property detail:', err);
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
        <div className="loading-spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
        <div className="glass" style={{ padding: '40px', borderRadius: '16px' }}>
          <h2>Oops!</h2>
          <p>{error || 'Something went wrong.'}</p>
          <button onClick={() => navigate('/properties')} className="btn-primary" style={{ marginTop: '20px' }}>
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail-page container">
      <button onClick={() => navigate(-1)} className="btn-back">
        <ChevronLeft size={20} /> Back to Listings
      </button>

      <div className="property-detail-layout">
        <div className="property-visuals">
          <div className="main-image-container glass">
            {property.isFeatured && (
              <div className="detail-featured-badge">
                <Star size={16} fill="currentColor" /> Featured Property
              </div>
            )}
            <img src={activeImage} alt={property.title} className="main-image" />
          </div>
          
          {property.images.length > 1 && (
            <div className="thumbnail-grid">
              {property.images.map((img, index) => (
                <div 
                  key={index} 
                  className={`thumbnail-item glass ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`${property.title} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="property-content">
          <div className="property-header">
            <span className="detail-category"><Tag size={16} /> {property.category}</span>
            <h1 className="detail-title">{property.title}</h1>
            <p className="detail-location"><MapPin size={18} /> {property.location}</p>
            <div className="detail-price-tag">
              <span className="price-label">Price</span>
              <span className="price-value">${property.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="property-stats glass">
            <div className="stat-item">
              <Maximize2 size={24} />
              <div>
                <span className="stat-label">Total Area</span>
                <span className="stat-value">{property.area} m²</span>
              </div>
            </div>
            <div className="stat-item">
              <Calendar size={24} />
              <div>
                <span className="stat-label">Listed on</span>
                <span className="stat-value">May 2026</span>
              </div>
            </div>
          </div>

          <div className="property-description">
            <h3>Description</h3>
            <p>
              This stunning {property.category.toLowerCase()} located in {property.location} offers a perfect blend of modern design and comfort. 
              With {property.area} m² of living space, it provides ample room for relaxation and entertainment.
            </p>
            <p>
              Featuring high-quality finishes and attention to detail, this property is a rare find in today's market. 
              {property.isFeatured ? ' As a featured listing, this property represents one of our most exclusive opportunities.' : ''}
            </p>
          </div>

          <div className="contact-agent glass">
            <h3>Interested in this property?</h3>
            <p>Our agents are ready to help you with any questions or to schedule a visit.</p>
            <div className="contact-buttons">
              <button className="btn-primary">
                <Phone size={18} /> Call Agent
              </button>
              <button className="btn-secondary">
                <Mail size={18} /> Email Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
