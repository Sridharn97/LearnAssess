import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Calendar, Star } from 'lucide-react';
import Card from '../common/Card';
import './FeedbackCard.css';

const FeedbackCard = ({ feedback, clickable = true }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleClick = () => {
    if (clickable) {
      navigate(`/feedbacks/${feedback.id}`);
    }
  };

  return (
    <Card
      hoverable={clickable}
      onClick={clickable ? handleClick : undefined}
      className={`feedback-card ${!clickable ? 'non-clickable' : ''}`}
    >
      <div className="feedback-card-header">
        <div className="feedback-category">
          <Tag size={12} />
          <span>{feedback.category?.replace(/_/g, ' ')}</span>
        </div>
        <div className="feedback-date">
          <Calendar size={12} />
          <span>{formatDate(feedback.createdAt)}</span>
        </div>
      </div>

      <div className="feedback-body">
        <h3 className="feedback-title">{feedback.title}</h3>
        <p className="feedback-message">{feedback.message}</p>
      </div>

      <div className="feedback-card-footer">
        <div className="feedback-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={15}
              fill={i < feedback.rating ? "#F59E0B" : "none"}
              color={i < feedback.rating ? "#F59E0B" : "#e2e8f0"}
            />
          ))}
        </div>
        <span className="feedback-rating-label">{feedback.rating}/5</span>
      </div>
    </Card>
  );
};

export default FeedbackCard;