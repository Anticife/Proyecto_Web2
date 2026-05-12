import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { Plus, LayoutDashboard, LogOut } from 'lucide-react';

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

const Dashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    if (!jwt) {
      navigate('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchMyProperties = async () => {
      try {
        const userParsed = JSON.parse(userData || '{}');
        const response = await axios.get(
          `${API_URL}/api/properties?filters[owner][id][$eq]=${userParsed.id}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

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
              ? `${API_URL}${attrs.images.data[0].attributes.url}`
              : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
          };
        });

        setProperties(transformedData);
      } catch (err) {
        console.error('Error fetching my properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, [jwt, navigate, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  if (!jwt) return null;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <LayoutDashboard size={32} /> User Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '5px 0 0' }}>
            Welcome back, {user?.username}! Manage your property listings here.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Create Property
          </button>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <section>
          <h2 style={{ marginBottom: '20px' }}>My Properties</h2>
          {loading ? (
            <p>Loading your properties...</p>
          ) : properties.length > 0 ? (
            <div className="property-grid">
              {properties.map(property => (
                <div key={property.id} style={{ position: 'relative' }}>
                  <PropertyCard property={property} />
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                    <button className="glass" style={{ padding: '5px 10px', fontSize: '0.8rem', color: 'var(--primary)' }}>Edit</button>
                    {!property.isFeatured && (
                      <button className="glass" style={{ padding: '5px 10px', fontSize: '0.8rem', background: 'var(--primary)', color: 'white' }}>Promote</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '16px' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>You haven't listed any properties yet.</p>
              <button style={{ marginTop: '20px' }}>List Your First Property</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
