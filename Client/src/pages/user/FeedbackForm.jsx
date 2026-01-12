import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './FeedbackForm.css';

const FeedbackForm = ({ initialData = null }) => {
  const { user } = useAuth();
  const { addFeedback, updateFeedback } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'General Inquiry',
    message: initialData?.message || '',
    rating: initialData?.rating || 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      ...formData,
      id: initialData?.id || Date.now().toString(),
      userId: user._id,
      rating: parseInt(formData.rating),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (initialData) {
      await updateFeedback(feedbackData);
    } else {
      await addFeedback(feedbackData);
    }

    navigate('/feedbacks');
  };

  return (
    <div className="feedback-form-page">
      <div className="feedback-form-header">
        <Button
          variant="ghost"
          onClick={() => navigate('/feedbacks')}
          className="back-button"
        >
          <ArrowLeft size={16} />
          <span>Back to Feedbacks</span>
        </Button>
        <h1>{initialData ? 'Edit Feedback' : 'Submit Feedback'}</h1>
      </div>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Subject</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Suggestion for new feature"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Bug Report">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Content Quality">Content Quality</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Very Poor</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="8"
            placeholder="Describe your feedback in detail..."
            required
          ></textarea>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/feedbacks')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update Feedback' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;