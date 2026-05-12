import React, { useEffect, useState } from 'react';
import { propertiesAPI } from '../api';
import PropertyCard from './PropertyCard';
import './PropertyList.css';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  area: number;
  isFeatured: boolean;
  image: string;
  category: string;
}

// Función de transformación estándar según frontend_guidelines.md
export function transformProperty(item: any) {
  const attrs = item.attributes;
  const imageUrl = attrs.images?.data?.[0]?.attributes?.url;
  return {
    id: item.id,
    title: attrs.title,
    price: attrs.price,
    location: attrs.location || 'Sin ubicación',
    area: attrs.area || 0,
    isFeatured: attrs.isFeatured || false,
    category: attrs.category?.data?.attributes?.name || 'Sin categoría',
    // ⚠️ Cloudinary devuelve URL ABSOLUTA — NO prefixar con API_URL
    image: imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
  };
}

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await propertiesAPI.getAll();
        
        // Transform Strapi data using the standard function
        const transformedData = response.data.map(transformProperty);

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
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
          },
          {
            id: 2,
            title: 'Skyline Penthouse (Mock)',
            price: 850000,
            location: 'Manhattan, NY',
            area: 180,
            isFeatured: true,
            category: 'Penthouse',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Loading properties...</div>;

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
          <button className="btn-secondary">View All Properties</button>
        </div>
      </div>
    </section>
  );
};

export default PropertyList;
