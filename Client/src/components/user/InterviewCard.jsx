import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calendar } from 'lucide-react';
import Card from '../common/Card';
import './InterviewCard.css';

const InterviewCard = ({ interview }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'difficulty-easy',
      Medium: 'difficulty-medium',
      Hard: 'difficulty-hard'
    };
    return colors[difficulty] || '';
  };
  
  const getResultColor = (result) => {
    const colors = {
      Accepted: 'result-success',
      Rejected: 'result-error',
      Pending: 'result-warning'
    };
    return colors[result] || '';
  };
  
  const handleClick = () => {
    navigate(`/interviews/${interview.id}`);
  };
  
  return (
    <Card 
      hoverable 
      onClick={handleClick}
      className="interview-card"
    >
      <div className="interview-card-header">
        <div className="interview-company">
          <Briefcase size={16} />
          <span>{interview.company}</span>
        </div>
        <div className="interview-date">
          <Calendar size={16} />
          <span>{formatDate(interview.createdAt)}</span>
        </div>
      </div>
      
      <h3 className="interview-title">{interview.title}</h3>
      <p className="interview-position">{interview.position}</p>
      
      <div className="interview-card-footer">
        <div className="interview-meta">
          <span className={`interview-difficulty ${getDifficultyColor(interview.difficulty)}`}>
            {interview.difficulty}
          </span>
          <span className={`interview-result ${getResultColor(interview.result)}`}>
            {interview.result}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default InterviewCard;