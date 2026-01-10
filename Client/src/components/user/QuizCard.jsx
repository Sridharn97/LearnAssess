import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, HelpCircle } from 'lucide-react';
import Card from '../common/Card';
import './QuizCard.css';

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/quizzes/${quiz._id || quiz.id}`);
  };
  
  const getCategoryStyle = (category) => {
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
  
  return (
    <Card 
      hoverable 
      onClick={handleClick}
      className="quiz-card"
    >
      <div className="quiz-card-content">
        <div className={`quiz-category ${getCategoryStyle(quiz.category)}`}>
          {quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1)}
        </div>
        <h3 className="quiz-title">{quiz.title}</h3>
        <p className="quiz-description">{quiz.description}</p>
      </div>
      
      <div className="quiz-card-footer">
        <div className="quiz-meta">
          <span className="quiz-meta-item">
            <HelpCircle size={14} />
            <span>{quiz.questions.length} Questions</span>
          </span>
          <span className="quiz-meta-item">
            <Clock size={14} />
            <span>{quiz.timeLimit} min</span>
          </span>
        </div>
      </div>
    </Card>
  );
};

export default QuizCard;