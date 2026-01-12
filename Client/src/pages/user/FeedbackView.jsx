import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Star, Edit, Trash2, Tag } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './FeedbackView.css';

const FeedbackView = () => {
  const { feedbackId } = useParams();
  const { user } = useAuth();
  const { getFeedback, deleteFeedback } = useData();
  const [feedback, setFeedback] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const foundFeedback = getFeedback(feedbackId);
    if (foundFeedback) {
      setFeedback(foundFeedback);
    } else {
      navigate('/feedbacks');
    }
  }, [feedbackId, getFeedback, navigate]);

  if (!feedback) {
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
    deleteFeedback(feedbackId);
    navigate('/feedbacks');
  };

  return (
    <div className="feedback-view-page">
      <div className="feedback-view-header">
        <Link to="/feedbacks" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Feedbacks</span>
        </Link>

        {(user._id === (feedback.userId?._id || feedback.userId)) && (
          <div className="feedback-actions">
            <Button
              variant="outline"
              onClick={() => navigate(`/feedbacks/${feedbackId}/edit`)}
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

      <div className="feedback-view-content">
        <div className="feedback-meta-header">
          <div className="feedback-category">
            <Tag size={20} />
            <span>{feedback.category}</span>
          </div>
          <div className="feedback-date">
            <span>{formatDate(feedback.createdAt)}</span>
          </div>
        </div>

        <h1 className="feedback-title">{feedback.title}</h1>

        {feedback.rating && (
          <div className="feedback-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                fill={i < feedback.rating ? "#FFD700" : "none"}
                color={i < feedback.rating ? "#FFD700" : "#cbd5e1"}
              />
            ))}
          </div>
        )}

        <div className="feedback-section">
          <div className="feedback-content">
            {feedback.message.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Delete Feedback</h3>
            <p>Are you sure you want to delete this feedback? This action cannot be undone.</p>
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
                Delete Feedback
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackView;