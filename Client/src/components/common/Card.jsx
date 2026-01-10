import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  title,
  subtitle,
  footer,
  className = '', 
  onClick,
  hoverable = false
}) => {
  return (
    <div 
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;