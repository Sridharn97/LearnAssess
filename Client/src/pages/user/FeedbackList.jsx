import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import FeedbackCard from '../../components/user/FeedbackCard';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './FeedbackList.css';

const FeedbackList = () => {
  const { user } = useAuth();
  const { feedbacks } = useData();

  return (
    <div className="feedback-list-page">
      <div className="feedback-list-header">
        <div>
          <h1>User Feedback</h1>
          <p>Share your suggestions, report bugs, or give general feedback</p>
        </div>
        <Link to="/feedbacks/new">
          <Button variant="primary">
            <Plus size={16} />
            <span>Submit Feedback</span>
          </Button>
        </Link>
      </div>

      {user.role === 'user' && (
        <>
          <h2>My Feedbacks</h2>
          <div className="feedback-grid">
            {feedbacks
              .filter(feedback => {
                const feedbackUserId = feedback.userId?._id || feedback.userId;
                return feedbackUserId === user._id;
              })
              .map(feedback => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))}
          </div>
        </>
      )}

      <h2>All Feedbacks</h2>
      <div className="feedback-grid">
        {feedbacks.length > 0 ? (
          feedbacks.map(feedback => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))
        ) : (
          <div className="empty-state">
            <p>No feedback submitted yet.</p>
            <Link to="/feedbacks/new">
              <Button variant="primary">Submit First Feedback</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;