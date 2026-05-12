import React from 'react';
import { Home, Building2, LayoutDashboard, UserPlus, LogIn } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar glass">
      <div className="container navbar-content">
        <div className="logo">
          <Building2 size={24} color="var(--primary)" />
          <span>RealEstatePro</span>
        </div>
        <div className="nav-links">
          <a href="/" className="nav-link"><Home size={18} /> Home</a>
          <a href="/properties" className="nav-link"><Building2 size={18} /> Properties</a>
          <a href="/dashboard" className="nav-link"><LayoutDashboard size={18} /> Dashboard</a>
        </div>
        <div className="auth-buttons">
          <button className="btn-login"><LogIn size={18} /> Login</button>
          <button className="btn-register"><UserPlus size={18} /> Register</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
