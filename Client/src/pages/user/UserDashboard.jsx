import React, { useState } from 'react';
import { BookOpen, HelpCircle, CheckCircle, BookMarked, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import MaterialCard from '../../components/user/MaterialCard';
import QuizCard from '../../components/user/QuizCard';
import QuizAnalytics from '../../components/user/QuizAnalytics';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const { materials, quizzes, quizResults } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Filter quiz results for current user
  const userQuizResults = quizResults.filter(result => {
    const resultUserId = result.userId?.toString();
    const currentUserId = user?._id?.toString();
    const matches = resultUserId === currentUserId;
    console.log('Comparing result userId:', resultUserId, 'with current userId:', currentUserId, 'matches:', matches);
    return matches;
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
    <div className="user-dashboard">
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h1>Welcome back, {user.name}!</h1>
          <p>Continue your learning journey with our latest materials and quizzes.</p>
        </div>
        <div className="welcome-image">
          <BookMarked size={48} />
        </div>
      </div>
      
      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Materials
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          Quizzes
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={16} style={{ marginRight: '0.5rem' }} />
          Analytics
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <div className="dashboard-section">
          <div className="stats-grid">
            <Card className="stat-card">
              <div className="stat-icon materials-icon">
                <BookOpen size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{totalMaterials}</h3>
                <p className="stat-label">Learning Materials</p>
              </div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-icon quizzes-icon">
                <HelpCircle size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{totalQuizzes}</h3>
                <p className="stat-label">Available Quizzes</p>
              </div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-icon completed-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{completedQuizzes}</h3>
                <p className="stat-label">Completed Quizzes</p>
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
        <div className="dashboard-section">
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
        <div className="dashboard-section">
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

      {activeTab === 'analytics' && (
        <div className="dashboard-section">
          <h2 className="page-title">Quiz Analytics</h2>
          <QuizAnalytics quizResults={userQuizResults} quizzes={quizzes} />
        </div>
      )}
    </div>
  );
};

export default UserDashboard;