import React, { useMemo } from 'react';
import { Award, Target, TrendingUp, Zap, Star, Trophy, Medal, Crown } from 'lucide-react';
import Card from '../common/Card';
import './ProgressTracker.css';

const ProgressTracker = ({ quizResults, quizzes, userId }) => {
  const achievements = useMemo(() => {
    const userResults = quizResults.filter(result => 
      (result.userId?._id || result.userId)?.toString() === userId?.toString()
    );

    const badges = [];
    const stats = {
      totalAttempts: userResults.length,
      totalQuizzes: new Set(userResults.map(r => r.quizId?._id || r.quizId)).size,
      perfectScores: userResults.filter(r => r.score === 100).length,
      averageScore: userResults.length > 0 
        ? (userResults.reduce((sum, r) => sum + r.score, 0) / userResults.length).toFixed(1)
        : 0,
      highScores: userResults.filter(r => r.score >= 90).length,
      completionRate: quizzes.length > 0 
        ? ((new Set(userResults.map(r => r.quizId?._id || r.quizId)).size / quizzes.length) * 100).toFixed(0)
        : 0
    };

    // Achievement badges
    if (stats.totalAttempts >= 1) {
      badges.push({ 
        icon: Star, 
        title: 'First Steps', 
        description: 'Completed your first quiz',
        color: '#3b82f6',
        earned: true
      });
    }

    if (stats.totalAttempts >= 5) {
      badges.push({ 
        icon: Zap, 
        title: 'Quiz Enthusiast', 
        description: 'Completed 5 quizzes',
        color: '#f59e0b',
        earned: true
      });
    }

    if (stats.totalAttempts >= 10) {
      badges.push({ 
        icon: Trophy, 
        title: 'Quiz Master', 
        description: 'Completed 10 quizzes',
        color: '#8b5cf6',
        earned: true
      });
    }

    if (stats.perfectScores >= 1) {
      badges.push({ 
        icon: Medal, 
        title: 'Perfect Score', 
        description: 'Achieved 100% on a quiz',
        color: '#10b981',
        earned: true
      });
    }

    if (stats.perfectScores >= 3) {
      badges.push({ 
        icon: Crown, 
        title: 'Perfectionist', 
        description: 'Achieved 3 perfect scores',
        color: '#ef4444',
        earned: true
      });
    }

    if (stats.averageScore >= 80) {
      badges.push({ 
        icon: TrendingUp, 
        title: 'High Achiever', 
        description: 'Maintained 80%+ average',
        color: '#06b6d4',
        earned: true
      });
    }

    if (stats.highScores >= 5) {
      badges.push({ 
        icon: Award, 
        title: 'Consistent Excellence', 
        description: 'Scored 90%+ on 5 quizzes',
        color: '#ec4899',
        earned: true
      });
    }

    if (stats.completionRate >= 50) {
      badges.push({ 
        icon: Target, 
        title: 'Halfway Hero', 
        description: 'Completed 50% of quizzes',
        color: '#6366f1',
        earned: true
      });
    }

    if (stats.completionRate >= 100) {
      badges.push({ 
        icon: Crown, 
        title: 'Quiz Champion', 
        description: 'Completed all quizzes',
        color: '#d97706',
        earned: true
      });
    }

    // Locked badges (coming soon)
    const lockedBadges = [
      { 
        icon: Star, 
        title: 'First Steps', 
        description: 'Complete your first quiz',
        color: '#9ca3af',
        earned: false
      },
      { 
        icon: Zap, 
        title: 'Quiz Enthusiast', 
        description: 'Complete 5 quizzes',
        color: '#9ca3af',
        earned: false
      },
      { 
        icon: Trophy, 
        title: 'Quiz Master', 
        description: 'Complete 10 quizzes',
        color: '#9ca3af',
        earned: false
      }
    ];

    const remainingSlots = 6 - badges.length;
    if (remainingSlots > 0) {
      badges.push(...lockedBadges.slice(0, remainingSlots));
    }

    return { badges, stats };
  }, [quizResults, quizzes, userId]);

  return (
    <div className="progress-tracker">
      {/* Stats Overview */}
      <Card className="progress-stats">
        <h3 className="progress-title">Your Progress</h3>
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value">{achievements.stats.totalQuizzes}</div>
            <div className="stat-label">Quizzes Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{achievements.stats.averageScore}%</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{achievements.stats.perfectScores}</div>
            <div className="stat-label">Perfect Scores</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{achievements.stats.completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="overall-progress">
          <div className="progress-bar-header">
            <span>Overall Completion</span>
            <span className="progress-percentage">{achievements.stats.completionRate}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${achievements.stats.completionRate}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="achievements-card">
        <h3 className="progress-title">
          <Award size={20} />
          Achievements
        </h3>
        <div className="achievements-grid">
          {achievements.badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div 
                key={index} 
                className={`achievement-badge ${badge.earned ? 'earned' : 'locked'}`}
                title={badge.description}
              >
                <div 
                  className="badge-icon" 
                  style={{ backgroundColor: badge.earned ? badge.color : '#e5e7eb' }}
                >
                  <Icon size={24} color={badge.earned ? '#fff' : '#9ca3af'} />
                </div>
                <div className="badge-info">
                  <div className="badge-title">{badge.title}</div>
                  <div className="badge-description">{badge.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ProgressTracker;
