import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './InterviewForm.css';

const InterviewForm = ({ initialData = null }) => {
  const { user } = useAuth();
  const { addInterview, updateInterview } = useData();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    company: initialData?.company || '',
    position: initialData?.position || '',
    experience: initialData?.experience || '',
    tips: initialData?.tips || '',
    difficulty: initialData?.difficulty || 'Medium',
    result: initialData?.result || 'Pending'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const interviewData = {
      ...formData,
      id: initialData?.id || Date.now().toString(),
      userId: user.id,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (initialData) {
      updateInterview(interviewData);
    } else {
      addInterview(interviewData);
    }
    
    navigate('/interviews');
  };
  
  return (
    <div className="interview-form-page">
      <div className="interview-form-header">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/interviews')}
          className="back-button"
        >
          <ArrowLeft size={16} />
          <span>Back to Interviews</span>
        </Button>
        <h1>{initialData ? 'Edit Interview Experience' : 'Share Interview Experience'}</h1>
      </div>
      
      <form className="interview-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., My Frontend Developer Interview at Tech Corp"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Job position"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="experience">Interview Experience</label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows="8"
            placeholder="Share your interview experience in detail..."
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="tips">Tips for Others</label>
          <textarea
            id="tips"
            name="tips"
            value={formData.tips}
            onChange={handleChange}
            rows="4"
            placeholder="Share your advice for other candidates..."
            required
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="difficulty">Interview Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="result">Interview Result</label>
            <select
              id="result"
              name="result"
              value={formData.result}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <Button 
            type="button" 
            variant="ghost"
            onClick={() => navigate('/interviews')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update Experience' : 'Share Experience'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InterviewForm;