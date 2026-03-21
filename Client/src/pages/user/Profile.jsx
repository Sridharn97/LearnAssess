import React, { useState } from 'react';
import { BarChart3, Award, User, Mail, Calendar, Shield } from 'lucide-react';
import QuizAnalytics from '../../components/user/QuizAnalytics';
import ProgressTracker from '../../components/user/ProgressTracker';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const { quizzes, quizResults } = useData();
  const [activeTab, setActiveTab] = useState('analytics');

  // Filter quiz results for current user
  const userQuizResults = quizResults.filter(result => {
    const resultUserId = (result.userId?._id || result.userId)?.toString();
    const currentUserId = (user?._id || user?.id)?.toString();
    return resultUserId === currentUserId;
  });

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info-card">
          <div className="profile-avatar-large">
            <User size={64} />
            <span className="user-tag-badge">USER</span>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{user.username}</h1>
            <div className="profile-meta">
              <div className="meta-item">
                <Mail size={16} />
                <span>{user.email || 'No email provided'}</span>
              </div>
              <div className="meta-item">
                <Shield size={16} />
                <span>Student ({user.role})</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={18} />
          <span>My Analytics</span>
        </button>
        <button
          className={`profile-tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <Award size={18} />
          <span>Achievements</span>
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'analytics' && (
          <div className="profile-section">
            <QuizAnalytics quizResults={userQuizResults} quizzes={quizzes} />
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="profile-section">
            <ProgressTracker quizResults={quizResults} quizzes={quizzes} userId={user?._id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
