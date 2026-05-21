import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertiesAPI, paymentsAPI } from '../api';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import { transformProperty } from '../utils/propertyUtils';
import type { Property } from '../utils/propertyUtils';
import { Plus, LayoutDashboard, LogOut, CheckCircle } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [user] = useState<User | null>(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const navigate = useNavigate();
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    if (!jwt) {
      navigate('/login');
      return;
    }

    let ignore = false;
    const fetchMyProperties = async (userId: number) => {
      try {
        const response = await propertiesAPI.getMyProperties(userId);
        const transformedData = response.data
          .map(transformProperty)
          .filter((item: Property | null): item is Property => item !== null);
        
        if (!ignore) setProperties(transformedData);
      } catch (err) {
        console.error('Error fetching my properties:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (user) {
      fetchMyProperties(user.id);
    }

    return () => { ignore = true; };
  }, [jwt, user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const handlePromote = async (propertyId: number) => {
    try {
      const result = await paymentsAPI.createPreference(propertyId);
      window.location.href = result.init_point;
    } catch (err) {
      console.error('Error creating payment preference:', err);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const openCreateModal = () => {
    setSelectedProperty(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    if (user) {
      const fetchMyProperties = async (userId: number) => {
        try {
          const response = await propertiesAPI.getMyProperties(userId);
          const transformedData = response.data
            .map(transformProperty)
            .filter((item: Property | null): item is Property => item !== null);
          setProperties(transformedData);
        } catch (err) {
          console.error('Error fetching my properties:', err);
        }
      };
      fetchMyProperties(user.id);
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!jwt) return null;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {showSuccess && (
        <div className="success-toast glass">
          <CheckCircle size={20} color="#10b981" />
          <span>Property saved successfully!</span>
        </div>
      )}

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
          <button onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    <button 
                      onClick={() => openEditModal(property)}
                      className="glass" 
                      style={{ padding: '5px 10px', fontSize: '0.8rem', color: 'var(--primary)' }}
                    >
                      Edit
                    </button>
                    {!property.isFeatured && (
                      <button 
                        onClick={() => handlePromote(property.id)}
                        className="glass" 
                        style={{ padding: '5px 10px', fontSize: '0.8rem', background: 'var(--primary)', color: 'white' }}
                      >
                        Promote
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '16px' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>You haven't listed any properties yet.</p>
              <button onClick={openCreateModal} style={{ marginTop: '20px' }}>List Your First Property</button>
            </div>
          )}
        </section>
      </div>

      <PropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleModalSuccess}
        property={selectedProperty}
      />

      <style>{`
        .success-toast {
          position: fixed;
          top: 100px;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          z-index: 3000;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
