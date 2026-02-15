import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Search, Filter } from 'lucide-react';
import { useData } from '../../context/DataContext';
import MaterialCard from '../../components/user/MaterialCard';
import './MaterialsList.css';

const MaterialsList = () => {
  const { materials, getMaterials } = useData();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        await getMaterials();
        setLoading(false);
      } catch (error) {
        console.error('Error loading materials:', error);
        setLoading(false);
      }
    };

    loadMaterials();
  }, [getMaterials]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(materials.map(m => m.category))];
    return cats.sort();
  }, [materials]);

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    let filtered = materials.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          material.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [materials, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="materials-list-page">
        <div className="loading">Loading materials...</div>
      </div>
    );
  }

  return (
    <div className="materials-list-page">
      <div className="page-header">
        <Link to="/user" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>

        <div className="page-title">
          <BookOpen size={24} />
          <h1>All Learning Materials</h1>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Sort:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="results-info">
        Showing {filteredMaterials.length} of {materials.length} materials
      </div>

      <div className="materials-grid">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map(material => (
            <MaterialCard key={material._id || material.id} material={material} />
          ))
        ) : (
          <div className="empty-state">
            <p>No materials found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsList;