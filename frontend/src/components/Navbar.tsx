import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Building2, LayoutDashboard, UserPlus, LogIn, User } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const jwt = localStorage.getItem('jwt');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <nav className="navbar glass">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <Building2 size={24} color="var(--primary)" />
          <span>RealEstatePro</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link"><Home size={18} /> Home</Link>
          <Link to="/properties" className="nav-link"><Building2 size={18} /> Properties</Link>
          {jwt && (
            <Link to="/dashboard" className="nav-link"><LayoutDashboard size={18} /> Dashboard</Link>
          )}
        </div>
        <div className="auth-buttons">
          {jwt ? (
            <Link to="/dashboard" className="btn-register">
              <User size={18} /> {user.username}
            </Link>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate('/login')}>
                <LogIn size={18} /> Login
              </button>
              <button className="btn-register" onClick={() => navigate('/register')}>
                <UserPlus size={18} /> Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
