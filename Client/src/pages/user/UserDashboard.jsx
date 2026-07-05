import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, CheckCircle, BookMarked, BarChart3, Award, MessageSquare, LayoutDashboard, User as UserIcon, ChevronLeft, LogOut, Plus, Sparkles, Library, Target, TrendingUp, Clock, CheckCheck } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import MaterialCard from '../../components/user/MaterialCard';
import QuizCard from '../../components/user/QuizCard';
import FeedbackCard from '../../components/user/FeedbackCard';
import Profile from './Profile';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { materials, quizzes, quizResults, feedbacks } = useData();
  const { activeTab: tabFromUrl } = useParams();
  const navigate = useNavigate();
  const activeTab = tabFromUrl || 'overview';
  
  // Navigate to default if no tab (optional but good for consistency)
  useEffect(() => {
    if (!tabFromUrl) {
      navigate('/user/overview', { replace: true });
    }
  }, [tabFromUrl, navigate]);
  
  // Filter quiz results for current user
  const userQuizResults = quizResults.filter(result => {
    const resultUserId = (result.userId?._id || result.userId)?.toString();
    const currentUserId = (user?._id || user?.id)?.toString();
    return resultUserId === currentUserId;
  });
  const completedQuizIds = [...new Set(userQuizResults.map(result => {
    const quizId = result.quizId._id || result.quizId;
    const quizIdStr = quizId?.toString();
    console.log('Processing quiz result:', result, 'quizId:', quizId, 'quizIdStr:', quizIdStr);
    return quizIdStr;
  }).filter(Boolean))];
  
  // Debug logging
  console.log('User:', user);
  console.log('User _id:', user?._id);
  console.log('Quiz results:', quizResults);
  console.log('User quiz results:', userQuizResults);
  console.log('Completed quiz IDs:', completedQuizIds);
  console.log('Completed quizzes count:', completedQuizIds.length);
  
  // Calculate stats
  const totalMaterials = materials.length;
  const totalQuizzes = quizzes.length;
  const completedQuizzes = completedQuizIds.length;
  
  const userFeedbacks = feedbacks.filter(f => {
    const fUserId = (f.userId?._id || f.userId)?.toString();
    const currentUserId = (user?._id || user?.id)?.toString();
    return fUserId === currentUserId;
  });
  
  // Recent materials and quizzes
  const recentMaterials = [...materials]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);
  
  const pendingQuizzes = quizzes
    .filter(quiz => {
      const quizId = (quiz._id || quiz.id)?.toString();
      return !completedQuizIds.includes(quizId);
    })
    .slice(0, 3);
  
  return (
    <div className="user-dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar-premium">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <img src="/Logo.png" alt="LearnAssess" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="brand-name">LearnAssess</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => navigate('/user/overview')}
          >
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => navigate('/user/materials')}
          >
            <BookOpen size={20} />
            <span>Materials</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => navigate('/user/quizzes')}
          >
            <HelpCircle size={20} />
            <span>Quizzes</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => navigate('/user/feedback')}
          >
            <MessageSquare size={20} />
            <span>Feedback</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => navigate('/user/profile')}
          >
            <UserIcon size={20} />
            <span>Profile</span>
          </button>
        </nav>

        <div className="sidebar-footer-premium">
          <button className="sidebar-logout-btn" onClick={logout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="user-dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-section animate-fade-in">
            <div className="dashboard-welcome-premium split-layout">
              <div className="welcome-text-section">
                <h1 className="welcome-title-premium">
                  Hello, {user.name}!
                </h1>
                <p className="welcome-subtitle-premium">Ready to crush your goals today? Your learning progress and materials are all here.</p>
                
                <div className="welcome-actions">
                  <button className="btn-primary welcome-btn" onClick={() => navigate('/user/materials')}>
                    Continue Learning
                  </button>
                  <button className="btn-secondary welcome-btn-outline" onClick={() => navigate('/user/quizzes')}>
                    Take a Quiz
                  </button>
                </div>
              </div>

              <div className="welcome-graphic-section">
                <img src="/dashboard_hero_illustration.png" alt="Dashboard Hero Graphic" className="welcome-hero-image" />
              </div>
            </div>
            <div className="stats-grid five-cards">
              {/* Card 1 (Materials) - Solid Indigo Theme */}
              <Card className="stat-card solid-theme">
                <div className="stat-header">
                  <span className="stat-label">Learning Materials</span>
                  <div className="stat-icon-wrapper white-bg">
                    <BarChart3 size={20} />
                  </div>
                </div>
                <div className="stat-body">
                  <div className="stat-value-row">
                    <span className="stat-value">{totalMaterials}</span>
                    <span className="stat-badge transparent-white-badge">
                      <span>↑ 12%</span>
                    </span>
                  </div>
                  <span className="stat-bottom-text">Last month: {Math.max(0, totalMaterials - 1)}</span>
                </div>
              </Card>

              {/* Card 2 (Completed) - White Theme, Purple Icon */}
              <Card className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Quizzes Done</span>
                  <div className="stat-icon-wrapper solid-purple">
                    <CheckCircle size={20} />
                  </div>
                </div>
                <div className="stat-body">
                  <div className="stat-value-row">
                    <span className="stat-value">
                      {completedQuizzes}
                      <span className="stat-divider">/</span>
                      <span className="stat-total">{totalQuizzes}</span>
                    </span>
                    <span className="stat-badge purple-badge">
                      <span>{completedQuizzes === totalQuizzes ? '↑ 100%' : 'In progress'}</span>
                    </span>
                  </div>
                  <span className="stat-bottom-text">Last month: {Math.max(0, completedQuizzes - 1)}</span>
                </div>
              </Card>

              {/* Card 3 (Average Score) - White Theme, Green Icon */}
              <Card className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Average Score</span>
                  <div className="stat-icon-wrapper solid-green">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="stat-body">
                  <div className="stat-value-row">
                    <span className="stat-value">
                      {userQuizResults.length > 0
                          ? (userQuizResults.reduce((sum, r) => sum + r.score, 0) / userQuizResults.length).toFixed(1)
                          : 0}
                      <span className="stat-unit">%</span>
                    </span>
                    <span className="stat-badge green-badge">
                      <span>↑ 5.2%</span>
                    </span>
                  </div>
                  <span className="stat-bottom-text">Last month: 75.0%</span>
                </div>
              </Card>

              {/* Card 4 (Pending) - White Theme, Orange Icon */}
              <Card className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Pending Quizzes</span>
                  <div className="stat-icon-wrapper solid-orange">
                    <Clock size={20} />
                  </div>
                </div>
                <div className="stat-body">
                  <div className="stat-value-row">
                    <span className="stat-value">{pendingQuizzes.length}</span>
                    <span className={`stat-badge ${pendingQuizzes.length === 0 ? 'green-badge' : 'orange-badge'}`}>
                      <span>{pendingQuizzes.length === 0 ? '✓ Done' : `↓ ${pendingQuizzes.length} left`}</span>
                    </span>
                  </div>
                  <span className="stat-bottom-text">Last month: 2</span>
                </div>
              </Card>

              {/* Card 5 (Feedbacks) - White Theme, Pink Icon */}
              <Card className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Feedbacks Shared</span>
                  <div className="stat-icon-wrapper solid-pink">
                    <MessageSquare size={20} />
                  </div>
                </div>
                <div className="stat-body">
                  <div className="stat-value-row">
                    <span className="stat-value">{userFeedbacks.length}</span>
                    <span className="stat-badge pink-badge">
                      <span>Active</span>
                    </span>
                  </div>
                  <span className="stat-bottom-text">Last month: 0</span>
                </div>
              </Card>
            </div>

            <div className="section-title-row">
              <h2 className="section-title">Recent Materials</h2>
              <Link to="/materials" className="section-link">View All</Link>
            </div>

            <div className="materials-grid">
              {recentMaterials.length > 0 ? (
                recentMaterials.map(material => (
                  <MaterialCard key={material._id || material.id} material={material} />
                ))
              ) : (
                <div className="empty-state">
                  <p>No learning materials available yet</p>
                </div>
              )}
            </div>

            <div className="section-title-row">
              <h2 className="section-title">Quizzes to Take</h2>
              <Link to="/quizzes" className="section-link">View All</Link>
            </div>

            <div className="quizzes-grid">
              {pendingQuizzes.length > 0 ? (
                pendingQuizzes.map(quiz => (
                  <QuizCard key={quiz._id || quiz.id} quiz={quiz} />
                ))
              ) : (
                <div className="empty-state">
                  <p>No pending quizzes available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="dashboard-section animate-fade-in">
            <h2 className="page-title">Learning Materials</h2>

            {materials.length > 0 ? (
              <div className="materials-grid materials-grid-full">
                {materials.map(material => (
                  <MaterialCard key={material._id || material.id} material={material} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No learning materials available yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="dashboard-section animate-fade-in">
            <h2 className="page-title">Available Quizzes</h2>

            {quizzes.length > 0 ? (
              <>
                <div className="section-title-row">
                  <h3 className="section-subtitle">Pending Quizzes</h3>
                </div>

                <div className="quizzes-grid quizzes-grid-full">
                  {pendingQuizzes.length > 0 ? (
                    quizzes
                      .filter(quiz => !completedQuizIds.includes(quiz._id || quiz.id))
                      .map(quiz => (
                        <QuizCard key={quiz._id || quiz.id} quiz={quiz} />
                      ))
                  ) : (
                    <div className="empty-state">
                      <p>You've completed all available quizzes!</p>
                    </div>
                  )}
                </div>

                {completedQuizzes > 0 && (
                  <>
                    <div className="section-title-row">
                      <h3 className="section-subtitle">Completed Quizzes</h3>
                    </div>

                    <div className="quizzes-grid quizzes-grid-full">
                      {quizzes
                        .filter(quiz => completedQuizIds.includes(quiz._id || quiz.id))
                        .map(quiz => (
                          <QuizCard key={quiz._id || quiz.id} quiz={quiz} />
                        ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="empty-state">
                <p>No quizzes available yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="dashboard-section animate-fade-in">
            <div className="section-header-user">
              <div>
                <h2>User Feedback</h2>
                <p>Share your suggestions, report bugs, or give general feedback</p>
              </div>
              <Link to="/feedbacks/new">
                <button className="new-feedback-btn">
                  <Plus size={16} />
                  <span>Submit Feedback</span>
                </button>
              </Link>
            </div>

            <div className="feedback-sections-wrapper">
              <h3 className="section-subtitle-premium">My Feedbacks</h3>
              <div className="feedback-grid-user">
                {feedbacks
                  .filter(f => {
                    const fUserId = (f.userId?._id || f.userId)?.toString();
                    const currentUserId = (user?._id || user?.id)?.toString();
                    return fUserId === currentUserId;
                  })
                  .map(feedback => (
                    <FeedbackCard key={feedback.id} feedback={feedback} clickable={false} />
                  ))}
                {feedbacks.filter(f => {
                  const fUserId = (f.userId?._id || f.userId)?.toString();
                  const currentUserId = (user?._id || user?.id)?.toString();
                  return fUserId === currentUserId;
                }).length === 0 && (
                  <div className="empty-state">
                    <p>You haven't submitted any feedback yet.</p>
                  </div>
                )}
              </div>

              <h3 className="section-subtitle-premium" style={{ marginTop: '40px' }}>All Feedbacks</h3>
              <div className="feedback-grid-user">
                {feedbacks.length > 0 ? (
                  feedbacks.map(feedback => (
                    <FeedbackCard key={feedback.id} feedback={feedback} clickable={false} />
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No other feedback submitted yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="dashboard-section animate-fade-in">
            <Profile />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;