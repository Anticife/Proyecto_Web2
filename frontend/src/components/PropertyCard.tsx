import React from 'react';
import { MapPin, Maximize2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PropertyCard.css';

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    price: number;
    location: string;
    area: number;
    isFeatured?: boolean;
    image: string;
    category: string;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();

  return (
    <div className={`property-card glass ${property.isFeatured ? 'featured' : ''}`}>
      {property.isFeatured && (
        <div className="featured-badge">
          <Star size={14} fill="currentColor" /> Featured
        </div>
      )}
      <div className="property-image" onClick={() => navigate(`/properties/${property.id}`)} style={{ cursor: 'pointer' }}>
        <img src={property.image} alt={property.title} />
        <div className="property-price">${property.price.toLocaleString()}</div>
        <div className="property-category">{property.category}</div>
      </div>
      <div className="property-info">
        <h3 className="property-title" onClick={() => navigate(`/properties/${property.id}`)} style={{ cursor: 'pointer' }}>{property.title}</h3>
        <div className="property-location">
          <MapPin size={16} /> {property.location}
        </div>
        <div className="property-meta">
          <div className="meta-item">
            <Maximize2 size={16} /> {property.area} m²
          </div>
        </div>
        <button 
          className="btn-view-details"
          onClick={() => navigate(`/properties/${property.id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
