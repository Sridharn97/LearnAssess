import React from 'react';
import { useNavigate } from 'react-router-dom';
import { File, Clock } from 'lucide-react';
import Card from '../common/Card';
import './MaterialCard.css';

const MaterialCard = ({ material }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getCategoryIcon = (category) => {
    const categoryClasses = {
      general: 'category-general',
      programming: 'category-programming',
      design: 'category-design',
      science: 'category-science',
      math: 'category-math',
      history: 'category-history'
    };
    
    return categoryClasses[category] || categoryClasses.general;
  };
  
  const handleClick = () => {
    navigate(`/materials/${material._id || material.id}`);
  };
  
  return (
    <Card 
      hoverable 
      onClick={handleClick}
      className="material-card"
    >
      <div className="material-card-header">
        <div className={`material-category ${getCategoryIcon(material.category)}`}>
          {material.category.charAt(0).toUpperCase() + material.category.slice(1)}
        </div>
        <h3 className="material-title">{material.title}</h3>
        <p className="material-description">{material.description}</p>
      </div>
      <div className="material-card-footer">
        <div className="material-meta">
          <span className="material-meta-item">
            <File size={14} />
            <span>{material.contentType === 'pdf' ? 'PDF' : 'Article'}</span>
          </span>
          <span className="material-meta-item">
            <Clock size={14} />
            <span>{formatDate(material.updatedAt)}</span>
          </span>
        </div>
      </div>
    </Card>
  );
};

export default MaterialCard;