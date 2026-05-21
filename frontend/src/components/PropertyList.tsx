import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertiesAPI } from '../api';
import PropertyCard from './PropertyCard';
import { transformProperty } from '../utils/propertyUtils';
import type { Property } from '../utils/propertyUtils';
import './PropertyList.css';

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSlowNotice, setShowSlowNotice] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ... rest of code stays the same

    const timer = setTimeout(() => {
      if (loading) setShowSlowNotice(true);
    }, 5000);

    const fetchProperties = async () => {
      try {
        const response = await propertiesAPI.getAll();
        console.log('API Response:', response);

        if (!response || !response.data) {
          throw new Error('Invalid API response structure');
        }
        
        // Transform Strapi data using the standard function, filtering out nulls
        const transformedData = response.data
          .map(transformProperty)
          .filter((item: Property | null): item is Property => item !== null);

        // Sort: Featured first
        const sorted = transformedData.sort((a: Property, b: Property) => 
          (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        );

        setProperties(sorted);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Showing mock data instead.');
        // Fallback to mock data if API fails
        setProperties([
          {
            id: 1,
            title: 'Modern Luxury Villa (Mock)',
            price: 1250000,
            location: 'Beverly Hills, CA',
            area: 450,
            isFeatured: true,
            category: 'Villa',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
            images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800']
          },
          {
            id: 2,
            title: 'Skyline Penthouse (Mock)',
            price: 850000,
            location: 'Manhattan, NY',
            area: 180,
            isFeatured: true,
            category: 'Penthouse',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
            images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
        <div className="loading-spinner"></div>
        <p>Loading properties...</p>
        {showSlowNotice && (
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '10px' }}>
            The server is taking a moment to wake up. This is normal for free-tier hosting.
            Please wait a few more seconds...
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="property-list-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Latest Properties</h2>
          <p className="section-subtitle">Explore our newest listings and find the perfect match.</p>
          {error && <p style={{ color: 'orange', fontSize: '0.9rem' }}>{error}</p>}
        </div>
        
        <div className="property-grid">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        <div className="view-more">
          <button className="btn-secondary" onClick={() => navigate('/properties')}>
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertyList;
