import React from 'react';
import { Building2, Mail, Phone, MapPin, Globe, MessageSquare, Info } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-info">
          <div className="logo">
            <Building2 size={24} color="var(--primary-light)" />
            <span style={{ color: 'white' }}>RealEstatePro</span>
          </div>
          <p>The leading platform for finding, selling, and managing premium properties worldwide.</p>
          <div className="social-links">
            <a href="#"><Globe size={20} /></a>
            <a href="#"><MessageSquare size={20} /></a>
            <a href="#"><Info size={20} /></a>
          </div>
        </div>
        
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/properties">Properties</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <ul>
            <li><MapPin size={18} /> 123 Luxury Ave, Estate City</li>
            <li><Phone size={18} /> +1 (555) 123-4567</li>
            <li><Mail size={18} /> support@realestatepro.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 RealEstatePro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
