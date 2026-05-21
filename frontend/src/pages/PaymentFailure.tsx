import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw } from 'lucide-react';

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '60px', borderRadius: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: '#ef444420', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
          <XCircle size={48} color="#ef4444" />
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Payment Failed</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '40px' }}>
          We couldn't process your payment. Please try again or contact support if the problem persists.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RefreshCw size={18} /> Try Again
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
