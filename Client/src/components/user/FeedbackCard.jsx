import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Calendar, Star } from 'lucide-react';
import Card from '../common/Card';
import './FeedbackCard.css';

const FeedbackCard = ({ feedback }) => {
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
    navigate(`/feedbacks/${feedback.id}`);
  };

  return (
    <Card
      hoverable
      onClick={handleClick}
      className="feedback-card"
    >
      <div className="feedback-card-header">
        <div className="feedback-category">
          <Tag size={16} />
          <span>{feedback.category}</span>
        </div>
        <div className="feedback-date">
          <Calendar size={16} />
          <span>{formatDate(feedback.createdAt)}</span>
        </div>
      </div>

      <h3 className="feedback-title">{feedback.title}</h3>

      <div className="feedback-card-footer">
        <div className="feedback-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < feedback.rating ? "#FFD700" : "none"}
              color={i < feedback.rating ? "#FFD700" : "#cbd5e1"}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default FeedbackCard;