import React, { useMemo } from 'react';
import { Award, Target, TrendingUp, Zap, Star, Trophy, Medal, Crown, Lock } from 'lucide-react';
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
      {/* Hero Overview */}
      <div className="hero-progress-card">
        <div className="hero-progress-content">
          <div className="hero-circle-container">
            <svg viewBox="0 0 120 120" className="circular-progress">
              <circle className="progress-bg" cx="60" cy="60" r="54" />
              <circle 
                className="progress-value" 
                cx="60" 
                cy="60" 
                r="54" 
                style={{ strokeDashoffset: 339.292 * (1 - achievements.stats.completionRate / 100) }}
              />
            </svg>
            <div className="hero-circle-text">
              <span className="hero-percentage">{achievements.stats.completionRate}%</span>
              <span className="hero-label">Completed</span>
            </div>
          </div>
          <div className="hero-stats-grid">
            <div className="hero-stat-widget">
              <div className="hero-stat-val">{achievements.stats.totalQuizzes}</div>
              <div className="hero-stat-name">Total Quizzes</div>
            </div>
            <div className="hero-stat-widget">
              <div className="hero-stat-val">{achievements.stats.averageScore}<span className="hero-stat-unit">%</span></div>
              <div className="hero-stat-name">Avg Score</div>
            </div>
            <div className="hero-stat-widget">
              <div className="hero-stat-val">{achievements.stats.perfectScores}</div>
              <div className="hero-stat-name">Perfect Scores</div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
      </div>

      {/* Collectible Badges Grid */}
      <div className="achievements-section">
        <div className="section-header">
          <Award size={24} className="section-icon" />
          <h2>Achievement Collection</h2>
        </div>
        <div className="collectible-grid">
          {achievements.badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div 
                key={index} 
                className={`collectible-card ${badge.earned ? 'earned' : 'locked'}`}
                style={{ '--badge-color': badge.earned ? badge.color : '#94a3b8' }}
              >
                <div className="collectible-inner">
                  <div className="collectible-gloss"></div>
                  
                  {!badge.earned && (
                    <div className="locked-overlay">
                      <Lock size={32} />
                    </div>
                  )}

                  <div className="collectible-icon-ring">
                    <Icon size={36} color={badge.earned ? '#fff' : '#cbd5e1'} />
                  </div>
                  
                  <div className="collectible-info">
                    <h4 className="collectible-title">{badge.title}</h4>
                    <p className="collectible-desc">{badge.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
