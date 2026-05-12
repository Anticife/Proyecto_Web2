import React from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="container hero-content">
        <h1 className="hero-title">Find Your Dream Property</h1>
        <p className="hero-subtitle">Discover a wide range of properties tailored to your lifestyle and budget.</p>
        
        <div className="search-box glass">
          <div className="search-input">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Search by title..." />
          </div>
          <div className="search-input">
            <MapPin className="search-icon" size={20} />
            <input type="text" placeholder="Location..." />
          </div>
          <div className="search-input">
            <Filter className="search-icon" size={20} />
            <select>
              <option value="">Category</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="office">Office</option>
            </select>
          </div>
          <button className="btn-search">Search Now</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
