import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './InterviewView.css';

const InterviewView = () => {
  const { interviewId } = useParams();
  const { user } = useAuth();
  const { getInterview, deleteInterview } = useData();
  const [interview, setInterview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const foundInterview = getInterview(interviewId);
    if (foundInterview) {
      setInterview(foundInterview);
    } else {
      navigate('/interviews');
    }
  }, [interviewId, getInterview, navigate]);
  
  if (!interview) {
    return null;
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleDelete = () => {
    deleteInterview(interviewId);
    navigate('/interviews');
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
  
  return (
    <div className="interview-view-page">
      <div className="interview-view-header">
        <Link to="/interviews" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Interviews</span>
        </Link>
        
        {user.id === interview.userId && (
          
          <div className="interview-actions">
            <Button 
              variant="outline"
              onClick={() => navigate(`/interviews/${interviewId}/edit`)}
            >
              <Edit size={16} />
              <span>Edit</span>
            </Button>
            <Button 
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </Button>
          </div>
        )}
      </div>
      
      <div className="interview-view-content">
        <div className="interview-meta-header">
          <div className="interview-company">
            <Briefcase size={20} />
            <span>{interview.company}</span>
          </div>
          <div className="interview-date">
            <Calendar size={20} />
            <span>{formatDate(interview.createdAt)}</span>
          </div>
        </div>
        
        <h1 className="interview-title">{interview.title}</h1>
        <h2 className="interview-position">{interview.position}</h2>
        
        <div className="interview-stats">
          <span className={`interview-difficulty ${getDifficultyColor(interview.difficulty)}`}>
            {interview.difficulty}
          </span>
          <span className={`interview-result ${getResultColor(interview.result)}`}>
            {interview.result}
          </span>
        </div>
        
        <div className="interview-section">
          <h3>Interview Experience</h3>
          <div className="interview-content">
            {interview.experience.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        
        <div className="interview-section">
          <h3>Tips for Other Candidates</h3>
          <div className="interview-content">
            {interview.tips.split('\n').map((tip, index) => (
              <p key={index}>{tip}</p>
            ))}
          </div>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Delete Interview Experience</h3>
            <p>Are you sure you want to delete this interview experience? This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <Button 
                variant="ghost" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDelete}
              >
                Delete Experience
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewView;