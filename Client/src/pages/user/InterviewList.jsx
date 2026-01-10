import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import InterviewCard from '../../components/user/InterviewCard';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './InterviewList.css';

const InterviewList = () => {
  const { user } = useAuth();
  const { interviews } = useData();
  
  return (
    <div className="interview-list-page">
      <div className="interview-list-header">
        <div>
          <h1>Interview Experiences</h1>
          <p>Learn from others' experiences and share your own</p>
        </div>
        <Link to="/interviews/new">
          <Button variant="primary">
            <Plus size={16} />
            <span>Share Experience</span>
          </Button>
        </Link>
      </div>
      
      {user.role === 'user' && (
        <>
          <h2>My Experiences</h2>
          <div className="interview-grid">
            {interviews
              .filter(interview => interview.userId === user.id)
              .map(interview => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
          </div>
        </>
      )}
      
      <h2>All Experiences</h2>
      <div className="interview-grid">
        {interviews.length > 0 ? (
          interviews.map(interview => (
            <InterviewCard key={interview.id} interview={interview} />
          ))
        ) : (
          <div className="empty-state">
            <p>No interview experiences shared yet.</p>
            <Link to="/interviews/new">
              <Button variant="primary">Share Your Experience</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewList;