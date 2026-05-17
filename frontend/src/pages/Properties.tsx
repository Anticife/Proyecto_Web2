import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { propertiesAPI, categoriesAPI } from '../api';
import PropertyCard from '../components/PropertyCard';
import { transformProperty } from '../components/PropertyList';
import { Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  const location = useLocation();

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParts = [`pagination[page]=${currentPage}`, `pagination[pageSize]=6`];
      
      if (filters.category) {
        queryParts.push(`filters[category][id][$eq]=${filters.category}`);
      }
      if (filters.minPrice) {
        queryParts.push(`filters[price][$gte]=${filters.minPrice}`);
      }
      if (filters.maxPrice) {
        queryParts.push(`filters[price][$lte]=${filters.maxPrice}`);
      }
      if (filters.search) {
        queryParts.push(`filters[title][$containsi]=${filters.search}`);
      }

      const response = await propertiesAPI.getAll(queryParts.join('&'));
      const transformedData = response.data.map(transformProperty);
      setProperties(transformedData);
      setPagination(response.meta.pagination);
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // Parse URL params if any
    const params = new URLSearchParams(location.search);
    const category = params.get('category') || '';
    const search = params.get('search') || '';
    setFilters(prev => ({ ...prev, category, search }));
  }, [location.search]);

  useEffect(() => {
    fetchProperties();
  }, [currentPage, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="properties-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar glass">
          <div className="filter-header">
            <Filter size={20} />
            <h3>Filters</h3>
          </div>
          
          <div className="filter-group">
            <label>Search</label>
            <div className="search-input-wrapper">
              <Search size={16} />
              <input 
                type="text" 
                name="search" 
                value={filters.search} 
                onChange={handleFilterChange} 
                placeholder="Title..." 
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.attributes.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input 
                type="number" 
                name="minPrice" 
                value={filters.minPrice} 
                onChange={handleFilterChange} 
                placeholder="Min" 
              />
              <span>-</span>
              <input 
                type="number" 
                name="maxPrice" 
                value={filters.maxPrice} 
                onChange={handleFilterChange} 
                placeholder="Max" 
              />
            </div>
          </div>
        </aside>

        {/* Property Grid */}
        <main className="properties-main">
          <div className="results-header">
            <h2>Available Properties</h2>
            <p>{pagination?.total || 0} properties found</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>
          ) : properties.length > 0 ? (
            <>
              <div className="property-grid">
                {properties.map(p => <PropertyCard key={p.id} property={p} />)}
              </div>

              {/* Pagination */}
              {pagination && pagination.pageCount > 1 && (
                <div className="pagination">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="glass"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="page-info">
                    Page {pagination.page} of {pagination.pageCount}
                  </span>
                  <button 
                    disabled={currentPage === pagination.pageCount} 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="glass"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="glass no-results">
              <p>No properties match your filters.</p>
              <button onClick={() => setFilters({ category: '', minPrice: '', maxPrice: '', search: '' })}>
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .properties-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        .filters-sidebar {
          padding: 1.5rem;
          border-radius: 16px;
          position: sticky;
          top: 100px;
        }
        .filter-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1rem;
        }
        .filter-header h3 { margin: 0; font-size: 1.25rem; }
        .filter-group {
          margin-bottom: 1.5rem;
        }
        .filter-group label {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          color: var(--text);
        }
        .filter-group select, .filter-group input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--glass-border);
          font-family: inherit;
        }
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-input-wrapper svg {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
        }
        .search-input-wrapper input {
          padding-left: 2.25rem;
        }
        .price-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .price-inputs input { width: 45%; }
        
        .results-header {
          margin-bottom: 2.5rem;
        }
        .results-header h2 { margin: 0 0 0.25rem; }
        .results-header p { color: var(--text-muted); margin: 0; }
        
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 4rem;
        }
        .pagination button {
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
        .page-info { font-weight: 600; color: var(--text); }
        
        .no-results {
          padding: 60px;
          text-align: center;
          border-radius: 16px;
        }

        @media (max-width: 1024px) {
          .properties-layout { grid-template-columns: 1fr; }
          .filters-sidebar { position: static; }
        }
      `}</style>
    </div>
  );
};

export default Properties;
