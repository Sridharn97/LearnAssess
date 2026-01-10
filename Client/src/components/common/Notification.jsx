import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({ 
  message, 
  type = 'info', 
  duration = 3000,
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300); // Allow animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`notification notification-${type} ${isVisible ? 'show' : 'hide'}`}>
      <div className="notification-content">
        <p>{message}</p>
      </div>
      <button className="notification-close" onClick={() => setIsVisible(false)}>
        ×
      </button>
    </div>
  );
};

export default Notification;