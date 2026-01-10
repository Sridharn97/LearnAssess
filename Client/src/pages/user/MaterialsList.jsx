import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useData } from '../../context/DataContext';
import MaterialCard from '../../components/user/MaterialCard';
import './MaterialsList.css';

const MaterialsList = () => {
  const { materials, getMaterials } = useData();
  const [loading, setLoading] = useState(true);

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

      <div className="materials-grid">
        {materials.length > 0 ? (
          materials.map(material => (
            <MaterialCard key={material._id || material.id} material={material} />
          ))
        ) : (
          <div className="empty-state">
            <p>No learning materials available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsList;