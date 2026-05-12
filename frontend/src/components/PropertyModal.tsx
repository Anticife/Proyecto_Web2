import React, { useState, useEffect } from 'react';
import { X, Upload, Building2, MapPin, DollarSign, Maximize2, Tag } from 'lucide-react';
import { categoriesAPI, propertiesAPI } from '../api';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  property?: any; // If present, we are editing
}

const PropertyModal: React.FC<PropertyModalProps> = ({ isOpen, onClose, onSuccess, property }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    area: '',
    location: '',
    category: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (property) {
        setFormData({
          title: property.title || '',
          price: property.price?.toString() || '',
          area: property.area?.toString() || '',
          location: property.location || '',
          category: property.categoryId?.toString() || '',
        });
      } else {
        setFormData({
          title: '',
          price: '',
          area: '',
          location: '',
          category: '',
        });
        setFiles([]);
        setPreviews([]);
      }
    }
  }, [isOpen, property]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageIds: number[] = [];
      
      // 1. Upload images if there are new ones
      if (files.length > 0) {
        const uploadResponse = await propertiesAPI.uploadImages(files);
        imageIds = uploadResponse.map((img: any) => img.id);
      }

      // 2. Prepare payload
      const payload: any = {
        title: formData.title,
        price: parseFloat(formData.price),
        area: formData.area ? parseFloat(formData.area) : null,
        location: formData.location,
        category: formData.category ? parseInt(formData.category) : null,
      };

      if (imageIds.length > 0) {
        payload.images = imageIds;
      }

      // 3. Create or Update
      if (property) {
        await propertiesAPI.update(property.id, payload);
      } else {
        await propertiesAPI.create(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving property:', err);
      alert('Failed to save property. Please check the fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{property ? 'Edit Property' : 'Create New Property'}</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label><Building2 size={16} /> Title *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                required 
                placeholder="Modern Villa..."
              />
            </div>

            <div className="form-group">
              <label><DollarSign size={16} /> Price *</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleInputChange} 
                required 
                placeholder="250000"
              />
            </div>

            <div className="form-group">
              <label><Maximize2 size={16} /> Area (m²)</label>
              <input 
                type="number" 
                name="area" 
                value={formData.area} 
                onChange={handleInputChange} 
                placeholder="120"
              />
            </div>

            <div className="form-group">
              <label><MapPin size={16} /> Location</label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleInputChange} 
                placeholder="City, Neighborhood"
              />
            </div>

            <div className="form-group full-width">
              <label><Tag size={16} /> Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.attributes.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label><Upload size={16} /> Images</label>
              <div className="upload-area">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  id="file-upload" 
                  hidden
                />
                <label htmlFor="file-upload" className="upload-label">
                  <Upload size={32} />
                  <span>Click to upload images</span>
                </label>
              </div>
              <div className="previews-grid">
                {previews.map((src, index) => (
                  <div key={index} className="preview-item">
                    <img src={src} alt="preview" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (property ? 'Update Property' : 'Create Property')}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .modal-content {
          width: 100%;
          max-width: 700px;
          background: var(--background);
          border-radius: 20px;
          padding: 2rem;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .modal-header h2 { margin: 0; }
        .btn-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .modal-form .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group.full-width { grid-column: span 2; }
        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .form-group input, .form-group select {
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--glass-border);
          font-family: inherit;
        }
        .upload-area {
          border: 2px dashed var(--glass-border);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .upload-area:hover { border-color: var(--primary); }
        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          cursor: pointer;
        }
        .previews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .preview-item {
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
        }
        .preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--glass-border);
        }
        .btn-primary { background: var(--primary); color: white; }
        .btn-secondary { background: transparent; color: var(--text-muted); border: 1px solid var(--glass-border); }
      `}</style>
    </div>
  );
};

export default PropertyModal;
