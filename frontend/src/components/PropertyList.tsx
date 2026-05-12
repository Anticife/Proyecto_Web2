import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/properties?populate=*');
        
        // Transform Strapi data to our local Property interface
        const transformedData = response.data.data.map((item: any) => {
          const attrs = item.attributes;
          return {
            id: item.id,
            title: attrs.title,
            price: attrs.price,
            location: attrs.location,
            area: attrs.area,
            isFeatured: attrs.isFeatured,
            category: attrs.category?.data?.attributes?.name || 'Uncategorized',
            image: attrs.images?.data?.[0]?.attributes?.url 
              ? `http://localhost:1337${attrs.images.data[0].attributes.url}`
              : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
          };
        });

        // Sort: Featured first
        const sorted = transformedData.sort((a: Property, b: Property) => 
          (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        );

        setProperties(sorted);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Showing mock data instead.');
        // Fallback to mock data if API fails (useful for dev)
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
