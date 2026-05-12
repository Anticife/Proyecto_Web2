import React, { useEffect, useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../api';
import './Hero.css';

interface Category {
  id: number;
  attributes: {
    name: string;
  };
}

const Hero: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="hero">
      <div className="container hero-content">
        <h1 className="hero-title">Find Your Dream Property</h1>
        <p className="hero-subtitle">Discover a wide range of properties tailored to your lifestyle and budget.</p>
        
        <div className="search-box glass">
          <div className="search-input">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="search-input">
            <MapPin className="search-icon" size={20} />
            <input type="text" placeholder="Location..." disabled />
          </div>
          <div className="search-input">
            <Filter className="search-icon" size={20} />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.attributes.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-search" onClick={handleSearch}>Search Now</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
