import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '60px', borderRadius: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: '#10b98120', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
          <CheckCircle size={48} color="#10b981" />
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Payment Successful!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '40px' }}>
          Thank you for promoting your property. It is now featured and will receive more visibility on our platform.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            Go to Dashboard <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/properties')} className="btn-secondary">
            View All Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
