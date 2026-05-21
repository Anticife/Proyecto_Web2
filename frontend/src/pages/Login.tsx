import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import './Auth.css';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSlowNotice, setShowSlowNotice] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setShowSlowNotice(false), 0);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowSlowNotice(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(identifier, password);

      // Store JWT and User Info
      localStorage.setItem('jwt', response.jwt);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirect to dashboard
      navigate('/dashboard');
      window.location.reload(); // Simple way to refresh navbar state
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMsg = (err as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message || 'Invalid credentials. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card glass">
        <div className="auth-header">
          <div className="auth-icon-circle">
            <LogIn size={32} color="var(--primary)" />
          </div>
          <h2>Welcome Back</h2>
          <p>Login to manage your properties and featured listings.</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="identifier">Email or Username</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '3px', margin: 0 }}></div>
                <span>Logging in...</span>
              </div>
            ) : 'Sign In'}
          </button>
        </form>

        {showSlowNotice && (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '0.8rem', marginTop: '15px' }}>
            The server is waking up. This might take a few more seconds...
          </p>
        )}

        <div className="auth-footer">
          <p>Don't have an account? <a href="/register">Create one here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
