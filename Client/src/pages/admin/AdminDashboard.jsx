import React, { useMemo, useState, useEffect } from 'react';
import { BookOpen, FileText, HelpCircle, Plus, X, ChevronLeft, ChevronRight, Users, Target, Trophy, Award, Activity, Calendar, LayoutDashboard, MessageSquare, LogOut, ChevronDown, TrendingUp, TrendingDown, CheckCheck, Clock, Share2, ThumbsUp, ShoppingBag } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import QuizAnalyticsChart from '../../components/admin/QuizAnalyticsChart';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Profile from '../user/Profile';
import './AdminDashboard.css';

const ROWS_PER_PAGE = 8;

function usePagination(data) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / ROWS_PER_PAGE));
  const sliced = data.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const reset = () => setPage(1);
  return { page, setPage, totalPages, sliced, reset };
}

function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination-bar">
      <button
        className="pag-btn"
        disabled={page === 1}
        onClick={() => setPage(p => p - 1)}
      >
        <ChevronLeft size={15} />
      </button>
      <span className="pag-info">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>
      <button
        className="pag-btn"
        disabled={page === totalPages}
        onClick={() => setPage(p => p + 1)}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

// ── User Detail Drawer ────────────────────────────────────────────────────────
function UserDetailModal({ user, onClose }) {
  if (!user) return null;

  const totalAttempts = user.quizAttempts.reduce((s, q) => s + q.attempts, 0);
  const overallAvg = user.quizAttempts.length
    ? (
      user.quizAttempts.reduce((s, q) => s + q.avgScore, 0) /
      user.quizAttempts.length
    ).toFixed(1)
    : '0';
  const bestOverall = user.quizAttempts.length
    ? Math.max(...user.quizAttempts.map(q => q.bestScore))
    : 0;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="drawer-panel" onClick={e => e.stopPropagation()}>

        {/* ── Header Section ── */}
        <div className="drawer-header-premium">
          <button className="drawer-close-btn-premium" onClick={onClose} title="Close">
            <X size={20} />
          </button>

          <div className="drawer-user-profile">
            <div className="drawer-avatar-premium">
              {user.userName.charAt(0).toUpperCase()}
            </div>
            <div className="drawer-user-info">
              <h2 className="drawer-username-premium">{user.userName}</h2>
              <p className="drawer-useremail-premium">{user.userEmail}</p>
            </div>
          </div>
        </div>
        <div className="drawer-stats-row">
          <div className="drawer-stat-mini">
            <div className="drawer-stat-icon-wrap bg-blue-light">
              <BookOpen size={16} className="color-blue" />
            </div>
            <div>
              <span className="drawer-stat-val-premium">{user.quizAttempts.length}</span>
              <span className="drawer-stat-lbl-premium">Quizzes</span>
            </div>
          </div>
          <div className="drawer-stat-mini">
            <div className="drawer-stat-icon-wrap bg-purple-light">
              <Activity size={16} className="color-purple" />
            </div>
            <div>
              <span className="drawer-stat-val-premium">{totalAttempts}</span>
              <span className="drawer-stat-lbl-premium">Attempts</span>
            </div>
          </div>
          <div className="drawer-stat-mini">
            <div className="drawer-stat-icon-wrap bg-green-light">
              <Target size={16} className="color-green" />
            </div>
            <div>
              <span className="drawer-stat-val-premium">{overallAvg}%</span>
              <span className="drawer-stat-lbl-premium">Avg Score</span>
            </div>
          </div>
          <div className="drawer-stat-mini">
            <div className="drawer-stat-icon-wrap bg-orange-light">
              <Trophy size={16} className="color-orange" />
            </div>
            <div>
              <span className="drawer-stat-val-premium">{bestOverall}%</span>
              <span className="drawer-stat-lbl-premium">Best Score</span>
            </div>
          </div>
        </div>

        {/* ── Content Body ── */}
        <div className="drawer-body-premium">
          <div className="drawer-content-header">
            <h4 className="drawer-content-title">Performance Breakdown</h4>
            <span className="drawer-content-count">{user.quizAttempts.length} Quizzes</span>
          </div>

          <div className="drawer-quiz-list-premium">
            {user.quizAttempts.map((qa, idx) => (
              <div className="drawer-quiz-card-premium" key={qa.quizId || idx}>
                <div className="dqcp-header">
                  <div className="dqcp-title-wrap">
                    <span className="dqcp-index">{idx + 1}</span>
                    <span className="dqcp-title">{qa.quizTitle}</span>
                  </div>
                  <span className={`score-badge ${scoreClass(qa.bestScore)}`}>
                    Best: {qa.bestScore}%
                  </span>
                </div>

                <div className="dqcp-stats-grid">
                  <div className="dqcp-stat-item">
                    <span className="dqcp-label">Attempts</span>
                    <span className="dqcp-value">{qa.attempts}</span>
                  </div>
                  <div className="dqcp-stat-item">
                    <span className="dqcp-label">Average</span>
                    <span className="dqcp-value">{qa.avgScore.toFixed(1)}%</span>
                  </div>
                  <div className="dqcp-stat-item">
                    <span className="dqcp-label">Last Score</span>
                    <span className="dqcp-value">{qa.lastScore}%</span>
                  </div>
                  <div className="dqcp-stat-item">
                    <span className="dqcp-label">Completed On</span>
                    <span className="dqcp-value">
                      {qa.lastAttemptAt ? qa.lastAttemptAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                </div>

                <div className="dqcp-progress">
                  <div
                    className={`dqcp-progress-bar ${scoreClass(qa.bestScore)}`}
                    style={{ width: `${qa.bestScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function scoreClass(score) {
  if (score >= 80) return 'score-high';
  if (score >= 60) return 'score-mid';
  return 'score-low';
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { materials, quizzes, quizResults, feedbacks } = useData();
  const { logout } = useAuth();
  const { activeTab: tabFromUrl } = useParams();
  const navigate = useNavigate();
  const activeTab = tabFromUrl || 'overview';

  useEffect(() => {
    if (!tabFromUrl) {
      navigate('/admin/overview', { replace: true });
    }
  }, [tabFromUrl, navigate]);
  const [selectedUser, setSelectedUser] = useState(null);

  // ── Stats ──
  const totalMaterials = materials.length;
  const totalQuizzes = quizzes.length;
  const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);

  // ── Materials by category ──
  const materialsByCategory = materials.reduce((acc, material) => {
    const category = material.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(material);
    return acc;
  }, {});

  const recentMaterials = [...materials]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const recentQuizzes = [...quizzes]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  // ── Aggregate results: group by USER (not user+quiz) ──
  const userResultsMap = useMemo(() => {
    const byUser = new Map();

    quizResults.forEach(result => {
      const userId = typeof result.userId === 'object' ? result.userId?._id : result.userId;
      const quizId = typeof result.quizId === 'object' ? result.quizId?._id : result.quizId;
      const userName = result.userId?.name || result.userId?.username || 'Unknown User';
      const userEmail = result.userId?.email || '—';
      const quizTitle = result.quizId?.title || 'Unknown Quiz';
      const score = result.score || 0;
      const createdAt = result.createdAt ? new Date(result.createdAt) : null;

      if (!byUser.has(userId)) {
        byUser.set(userId, {
          userId,
          userName,
          userEmail,
          quizAttempts: new Map()
        });
      }

      const userEntry = byUser.get(userId);
      const quizKey = quizId || 'unknown';

      if (!userEntry.quizAttempts.has(quizKey)) {
        userEntry.quizAttempts.set(quizKey, {
          quizId: quizKey,
          quizTitle,
          attempts: 0,
          bestScore: 0,
          totalScore: 0,
          lastScore: 0,
          lastAttemptAt: null
        });
      }

      const qa = userEntry.quizAttempts.get(quizKey);
      qa.attempts += 1;
      qa.bestScore = Math.max(qa.bestScore, score);
      qa.totalScore += score;
      if (!qa.lastAttemptAt || (createdAt && createdAt > qa.lastAttemptAt)) {
        qa.lastAttemptAt = createdAt;
        qa.lastScore = score;
      }
    });

    // Convert quizAttempts Map to array, compute avg
    return Array.from(byUser.values()).map(u => ({
      ...u,
      quizAttempts: Array.from(u.quizAttempts.values()).map(qa => ({
        ...qa,
        avgScore: qa.attempts > 0 ? qa.totalScore / qa.attempts : 0
      }))
    }));
  }, [quizResults]);

  // Flat view for the old aggregatedResults (used by QuizAnalyticsChart unchanged)
  const aggregatedResults = useMemo(() => {
    const byUserQuiz = new Map();
    quizResults.forEach(result => {
      const userKey = typeof result.userId === 'object' ? result.userId?._id : result.userId;
      const quizKey = typeof result.quizId === 'object' ? result.quizId?._id : result.quizId;
      const key = `${userKey || 'unknown-user'}:${quizKey || 'unknown-quiz'}`;
      const createdAt = result.createdAt ? new Date(result.createdAt) : null;

      if (!byUserQuiz.has(key)) {
        byUserQuiz.set(key, {
          userId: userKey,
          userName: result.userId?.name || result.userId?.username || 'Unknown User',
          userEmail: result.userId?.email || '—',
          quizId: quizKey,
          quizTitle: result.quizId?.title || 'Unknown Quiz',
          quizCategory: result.quizId?.category || '—',
          attempts: 0,
          bestScore: 0,
          lastScore: 0,
          lastAttemptAt: null
        });
      }
      const entry = byUserQuiz.get(key);
      entry.attempts += 1;
      entry.bestScore = Math.max(entry.bestScore, result.score || 0);
      if (!entry.lastAttemptAt || (createdAt && createdAt > entry.lastAttemptAt)) {
        entry.lastAttemptAt = createdAt;
        entry.lastScore = result.score || 0;
      }
    });

    return Array.from(byUserQuiz.values()).sort((a, b) => {
      const aTime = a.lastAttemptAt ? a.lastAttemptAt.getTime() : 0;
      const bTime = b.lastAttemptAt ? b.lastAttemptAt.getTime() : 0;
      return bTime - aTime;
    });
  }, [quizResults]);

  // ── Pagination ──
  const matPag = usePagination(materials);
  const quizPag = usePagination(quizzes);
  const userPag = usePagination(userResultsMap);

  return (
    <div className="admin-dashboard-layout">
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
            onClick={() => navigate('/admin/overview')}
          >
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => navigate('/admin/materials')}
          >
            <BookOpen size={20} />
            <span>Materials</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => navigate('/admin/quizzes')}
          >
            <HelpCircle size={20} />
            <span>Quizzes</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => navigate('/admin/results')}
          >
            <Trophy size={20} />
            <span>Results</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => navigate('/admin/feedback')}
          >
            <MessageSquare size={20} />
            <span>Feedback</span>
          </button>
        </nav>

        <div className="sidebar-footer-premium">
          <button className="sidebar-logout-btn" onClick={logout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="admin-dashboard-content">
        {/* Modals */}
        {selectedUser && (
          <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}

      {/* ── Overview ── */}
      {activeTab === 'overview' && (
        <div className="dashboard-section animate-fade-in admin-overview-section">
          {/* Header row */}
          <div className="dashboard-header-premium">
            <div className="header-title-area">
              <h1>Welcome back, Admin!</h1>
              <p className="header-subtitle">Manage your platform and track performance</p>
            </div>
            <div className="dashboard-actions">
              <Link to="/admin/materials/create">
                <Button variant="primary">
                  <Plus size={16} />
                  <span>New Material</span>
                </Button>
              </Link>
              <Link to="/admin/quizzes/create">
                <Button variant="secondary">
                  <Plus size={16} />
                  <span>New Quiz</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Row 1: Sparkline Cards */}
          <div className="admin-sparkline-grid">
            {/* Card 1: Materials */}
            <Card className="sparkline-card">
              <div className="spark-header">
                <span className="spark-label">MATERIALS</span>
                <div className="spark-select-wrapper">
                  <span>Last 7 days</span>
                  <ChevronDown size={12} />
                </div>
              </div>
              <div className="spark-body">
                <div className="spark-value-row">
                  <h3 className="spark-value">{totalMaterials}</h3>
                  <span className="spark-badge text-green">12% ↑</span>
                </div>
                <div className="spark-progress-section">
                  <span className="spark-progress-label">Active coverage</span>
                  <div className="spark-progress-bar">
                    <div className="spark-progress-fill" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Card 2: Attempts */}
            <Card className="sparkline-card">
              <div className="spark-header">
                <span className="spark-label">ATTEMPTS</span>
                <div className="spark-select-wrapper">
                  <span>Last 7 days</span>
                  <ChevronDown size={12} />
                </div>
              </div>
              <div className="spark-body">
                <div className="spark-value-row">
                  <h3 className="spark-value">{quizResults.length}</h3>
                  <span className="spark-badge text-green">8% ↑</span>
                </div>
                <div className="spark-chart-container">
                  <svg className="sparkline-svg" viewBox="0 0 150 40">
                    <defs>
                      <linearGradient id="blue-grad-spark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(37, 99, 235, 0.15)" />
                        <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 30 C 20 15, 40 25, 60 10 C 80 20, 100 5, 120 22 C 135 15, 145 28, 150 25 L 150 40 L 0 40 Z" fill="url(#blue-grad-spark)" />
                    <path d="M 0 30 C 20 15, 40 25, 60 10 C 80 20, 100 5, 120 22 C 135 15, 145 28, 150 25" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </Card>

            {/* Card 3: Questions */}
            <Card className="sparkline-card">
              <div className="spark-header">
                <span className="spark-label">QUESTIONS</span>
                <div className="spark-select-wrapper">
                  <span>Last 7 days</span>
                  <ChevronDown size={12} />
                </div>
              </div>
              <div className="spark-body">
                <div className="spark-value-row">
                  <h3 className="spark-value">{totalQuestions}</h3>
                  <span className="spark-badge text-yellow">0% —</span>
                </div>
                <div className="spark-chart-container">
                  <svg className="sparkline-svg" viewBox="0 0 150 40">
                    <defs>
                      <linearGradient id="yellow-grad-spark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(234, 88, 12, 0.15)" />
                        <stop offset="100%" stopColor="rgba(234, 88, 12, 0)" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 32 C 15 28, 30 35, 45 22 C 60 15, 75 28, 90 12 C 105 18, 120 8, 135 25 C 145 22, 148 29, 150 28 L 150 40 L 0 40 Z" fill="url(#yellow-grad-spark)" />
                    <path d="M 0 32 C 15 28, 30 35, 45 22 C 60 15, 75 28, 90 12 C 105 18, 120 8, 135 25 C 145 22, 148 29, 150 28" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="3,3" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </Card>

            {/* Card 4: Active Users */}
            <Card className="sparkline-card">
              <div className="spark-header">
                <span className="spark-label">ACTIVE USERS</span>
                <div className="spark-select-wrapper">
                  <span>Last 7 days</span>
                  <ChevronDown size={12} />
                </div>
              </div>
              <div className="spark-body">
                <div className="spark-value-row">
                  <h3 className="spark-value">
                    {new Set(quizResults.map(r => typeof r.userId === 'object' ? r.userId?._id : r.userId).filter(Boolean)).size}
                  </h3>
                  <span className="spark-badge text-green">4% ↑</span>
                </div>
                <div className="spark-chart-container">
                  <svg className="sparkline-svg" viewBox="0 0 150 40">
                    <rect x="5" y="20" width="5" height="20" rx="1.5" fill="#10b981" />
                    <rect x="15" y="15" width="5" height="25" rx="1.5" fill="#10b981" />
                    <rect x="25" y="28" width="5" height="12" rx="1.5" fill="#10b981" />
                    <rect x="35" y="10" width="5" height="30" rx="1.5" fill="#10b981" />
                    <rect x="45" y="22" width="5" height="18" rx="1.5" fill="#10b981" />
                    <rect x="55" y="18" width="5" height="22" rx="1.5" fill="#10b981" />
                    <rect x="65" y="26" width="5" height="14" rx="1.5" fill="#10b981" />
                    <rect x="75" y="8" width="5" height="32" rx="1.5" fill="#10b981" />
                    <rect x="85" y="14" width="5" height="26" rx="1.5" fill="#10b981" />
                    <rect x="95" y="23" width="5" height="17" rx="1.5" fill="#10b981" />
                    <rect x="105" y="30" width="5" height="10" rx="1.5" fill="#10b981" />
                    <rect x="115" y="12" width="5" height="28" rx="1.5" fill="#10b981" />
                    <rect x="125" y="19" width="5" height="21" rx="1.5" fill="#10b981" />
                    <rect x="135" y="25" width="5" height="15" rx="1.5" fill="#10b981" />
                    <rect x="145" y="5" width="5" height="35" rx="1.5" fill="#10b981" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Row 2: Mini-Stats with Square Badges */}
          <div className="admin-mini-grid">
            <Card className="mini-stat-card">
              <div className="mini-icon-box bg-blue">
                <FileText size={18} />
              </div>
              <div className="mini-stat-details">
                <h4>{totalMaterials} Materials</h4>
                <p>{recentMaterials.length} new this week</p>
              </div>
            </Card>
            
            <Card className="mini-stat-card">
              <div className="mini-icon-box bg-green">
                <Trophy size={18} />
              </div>
              <div className="mini-stat-details">
                <h4>{quizResults.length} Submissions</h4>
                <p>12 waiting review</p>
              </div>
            </Card>

            <Card className="mini-stat-card">
              <div className="mini-icon-box bg-black">
                <Share2 size={18} />
              </div>
              <div className="mini-stat-details">
                <h4>{totalQuestions} Questions</h4>
                <p>16 today</p>
              </div>
            </Card>

            <Card className="mini-stat-card">
              <div className="mini-icon-box bg-blue-facebook">
                <ThumbsUp size={18} />
              </div>
              <div className="mini-stat-details">
                <h4>{feedbacks.length} Feedbacks</h4>
                <p>Active support</p>
              </div>
            </Card>
          </div>

          {/* Row 3: Performance Charts */}
          <div className="admin-charts-grid">
            {/* Card 1: Traffic summary / Scores distribution */}
            <Card className="performance-chart-card">
              <h3 className="dashboard-card-title">Performance summary</h3>
              <div className="traffic-chart-wrapper">
                <svg className="traffic-chart-svg" viewBox="0 0 500 240">
                  <line x1="40" y1="40" x2="480" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="40" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="40" y1="160" x2="480" y2="160" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="40" y1="200" x2="480" y2="200" stroke="#cbd5e1" strokeWidth="1" />
                  
                  <text x="15" y="44" fill="#94a3b8" fontSize="10">100</text>
                  <text x="15" y="84" fill="#94a3b8" fontSize="10">80</text>
                  <text x="15" y="124" fill="#94a3b8" fontSize="10">60</text>
                  <text x="15" y="164" fill="#94a3b8" fontSize="10">40</text>
                  <text x="15" y="204" fill="#94a3b8" fontSize="10">0</text>
                  
                  <text x="80" y="218" fill="#94a3b8" fontSize="10">24 Jun</text>
                  <text x="170" y="218" fill="#94a3b8" fontSize="10">Jul '20</text>
                  <text x="260" y="218" fill="#94a3b8" fontSize="10">08 Jul</text>
                  <text x="350" y="218" fill="#94a3b8" fontSize="10">16 Jul</text>
                  <text x="440" y="218" fill="#94a3b8" fontSize="10">24 Jul</text>
                  
                  <g>
                    <rect x="75" y="160" width="8" height="40" rx="1.5" fill="#2563eb" />
                    <rect x="75" y="152" width="8" height="8" rx="1.5" fill="#10b981" />
                    
                    <rect x="95" y="130" width="8" height="70" rx="1.5" fill="#2563eb" />
                    <rect x="95" y="120" width="8" height="10" rx="1.5" fill="#10b981" />
                    
                    <rect x="115" y="170" width="8" height="30" rx="1.5" fill="#2563eb" />
                    <rect x="115" y="166" width="8" height="4" rx="1.5" fill="#10b981" />
                    
                    <rect x="135" y="150" width="8" height="50" rx="1.5" fill="#2563eb" />
                    <rect x="135" y="142" width="8" height="8" rx="1.5" fill="#10b981" />
                    
                    <rect x="155" y="140" width="8" height="60" rx="1.5" fill="#2563eb" />
                    
                    <rect x="175" y="165" width="8" height="35" rx="1.5" fill="#2563eb" />
                    <rect x="175" y="155" width="8" height="10" rx="1.5" fill="#10b981" />
                    
                    <rect x="195" y="145" width="8" height="55" rx="1.5" fill="#2563eb" />
                    
                    <rect x="215" y="110" width="8" height="90" rx="1.5" fill="#2563eb" />
                    <rect x="215" y="102" width="8" height="8" rx="1.5" fill="#10b981" />
                    
                    <rect x="235" y="130" width="8" height="70" rx="1.5" fill="#2563eb" />
                    
                    <rect x="255" y="160" width="8" height="40" rx="1.5" fill="#2563eb" />
                    
                    <rect x="275" y="150" width="8" height="50" rx="1.5" fill="#2563eb" />
                    <rect x="275" y="146" width="8" height="4" rx="1.5" fill="#10b981" />
                    
                    <rect x="295" y="100" width="8" height="100" rx="1.5" fill="#2563eb" />
                    <rect x="295" y="92" width="8" height="8" rx="1.5" fill="#10b981" />
                    
                    <rect x="315" y="70" width="8" height="130" rx="1.5" fill="#2563eb" />
                    <rect x="315" y="60" width="8" height="10" rx="1.5" fill="#10b981" />
                    
                    <rect x="335" y="120" width="8" height="80" rx="1.5" fill="#2563eb" />
                    
                    <rect x="355" y="135" width="8" height="65" rx="1.5" fill="#2563eb" />
                    
                    <rect x="375" y="90" width="8" height="110" rx="1.5" fill="#2563eb" />
                    <rect x="375" y="80" width="8" height="10" rx="1.5" fill="#10b981" />
                    
                    <rect x="395" y="110" width="8" height="90" rx="1.5" fill="#2563eb" />
                    
                    <rect x="415" y="75" width="8" height="125" rx="1.5" fill="#2563eb" />
                    <rect x="415" y="65" width="8" height="10" rx="1.5" fill="#10b981" />
                    
                    <rect x="435" y="50" width="8" height="150" rx="1.5" fill="#2563eb" />
                    <rect x="435" y="42" width="8" height="8" rx="1.5" fill="#10b981" />
                    
                    <rect x="455" y="95" width="8" height="105" rx="1.5" fill="#2563eb" />
                  </g>
                </svg>
              </div>
            </Card>

            {/* Card 2: Locations / Demographics Map */}
            <Card className="performance-chart-card">
              <h3 className="dashboard-card-title">Student demographics</h3>
              <div className="demographics-map-wrapper">
                <svg className="demographics-map-svg" viewBox="0 0 500 240">
                  <g opacity="0.3">
                    {/* Simplified stylized vector world map outline */}
                    <path d="M 50 50 C 70 40, 120 50, 130 90 C 120 120, 80 130, 90 150 C 70 140, 60 110, 50 50 Z" fill="#cbd5e1" />
                    <path d="M 90 150 C 110 160, 130 180, 120 220 C 100 230, 90 200, 90 150 Z" fill="#cbd5e1" />
                    <path d="M 120 30 C 130 20, 150 25, 140 40 C 130 45, 125 35, 120 30 Z" fill="#cbd5e1" />
                    <path d="M 220 50 C 270 40, 360 45, 410 70 C 420 100, 380 130, 420 150 C 370 170, 300 130, 260 130 C 250 140, 240 180, 250 210 C 220 200, 200 120, 220 50 Z" fill="#cbd5e1" />
                    <path d="M 380 180 C 410 175, 430 190, 410 210 C 390 215, 380 195, 380 180 Z" fill="#cbd5e1" />
                  </g>
                  
                  {/* Hotspots */}
                  <path d="M 70 85 C 80 80, 95 82, 100 95 C 90 105, 80 100, 70 85 Z" fill="#3b82f6" opacity="0.85" />
                  <circle cx="85" cy="92" r="5" fill="#2563eb" />
                  <circle cx="85" cy="92" r="12" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
                  
                  <circle cx="250" cy="78" r="4" fill="#2563eb" />
                  <circle cx="250" cy="78" r="10" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.6" />
                  
                  <path d="M 345 85 C 360 80, 380 90, 375 105 C 360 115, 345 105, 345 85 Z" fill="#1d4ed8" opacity="0.9" />
                  <circle cx="360" cy="95" r="5" fill="#1e40af" />
                  
                  <circle cx="120" cy="170" r="4" fill="#3b82f6" opacity="0.8" />
                </svg>
              </div>
            </Card>
          </div>

          {/* Row 4: Storage Legends & Activities list, Activity Line Chart */}
          <div className="admin-bottom-grid">
            {/* Card 1: Storage Legend & Recent feedbacks */}
            <Card className="bottom-card-dashboard">
              <div className="storage-section-dashboard">
                <span className="storage-title">Using Storage <strong>6,854.45 MB</strong> of 8 GB</span>
                <div className="storage-segmented-bar">
                  <div className="seg-bar bg-blue" style={{ width: '45%' }}></div>
                  <div className="seg-bar bg-cyan" style={{ width: '25%' }}></div>
                  <div className="seg-bar bg-green" style={{ width: '15%' }}></div>
                  <div className="seg-bar bg-gray" style={{ width: '15%' }}></div>
                </div>
                <div className="storage-legends">
                  <span className="legend-item"><span className="legend-dot bg-blue"></span>Regular 915MB</span>
                  <span className="legend-item"><span className="legend-dot bg-cyan"></span>System 415MB</span>
                  <span className="legend-item"><span className="legend-dot bg-green"></span>Shared 201MB</span>
                  <span className="legend-item"><span className="legend-dot bg-gray"></span>Free 612MB</span>
                </div>
              </div>

              <div className="recent-activity-section">
                {feedbacks.slice(0, 2).map((fb, idx) => {
                  const userName = fb.userId?.name || fb.userId?.username || 'Student User';
                  const userInit = userName.charAt(0).toUpperCase();
                  return (
                    <div key={fb.id || idx} className="activity-item-dashboard">
                      <div className={`activity-avatar-dashboard ${idx === 0 ? 'bg-purple-light text-purple' : 'bg-pink-light text-pink'}`}>
                        {userInit}
                      </div>
                      <div className="activity-details-dashboard">
                        <p className="activity-text-dashboard">
                          <strong>{userName}</strong> shared suggestions: "{fb.message.length > 55 ? fb.message.slice(0, 55) + '...' : fb.message}"
                        </p>
                        <span className="activity-time-dashboard">{idx === 0 ? 'yesterday' : '2 days ago'}</span>
                      </div>
                    </div>
                  );
                })}
                {feedbacks.length === 0 && (
                  <p className="empty-message-dashboard">No activity yet</p>
                )}
              </div>
            </Card>

            {/* Card 2: Health donut & smooth filled activity line chart */}
            <Card className="bottom-card-dashboard relative-chart">
              <div className="donut-chart-dashboard">
                <svg width="36" height="36" viewBox="0 0 36 36" className="donut-ring-svg">
                  <circle className="donut-hole" cx="18" cy="18" r="15.915" fill="transparent"></circle>
                  <circle className="donut-ring" cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3"></circle>
                  <circle className="donut-segment" cx="18" cy="18" r="15.915" fill="transparent" stroke="#2563eb" strokeWidth="3" strokeDasharray="85 15" strokeDashoffset="25"></circle>
                </svg>
                <div className="donut-info-dashboard">
                  <h4 className="donut-title-dashboard">Development activity: 85%</h4>
                  <p className="donut-desc-dashboard">↑ 5% more than yesterday</p>
                </div>
              </div>

              <div className="activity-trend-chart">
                <svg className="trend-chart-svg" viewBox="0 0 500 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="trend-grad-dash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(37, 99, 235, 0.15)" />
                      <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 110 Q 75 100, 150 90 T 300 70 T 450 30 L 500 20 L 500 120 L 0 120 Z" fill="url(#trend-grad-dash)" />
                  <path d="M 0 110 Q 75 100, 150 90 T 300 70 T 450 30 L 500 20" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Materials ── */}
      {activeTab === 'materials' && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Learning Materials</h2>
            <Link to="/admin/materials/create">
              <Button variant="primary" size="small">
                <Plus size={16} />
                <span>New Material</span>
              </Button>
            </Link>
          </div>

          {materials.length > 0 ? (
            <>
              <div className="materials-table-container">
                <table className="materials-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Created</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matPag.sliced.map((material, idx) => (
                      <tr key={material.id}>
                        <td className="row-num">{(matPag.page - 1) * ROWS_PER_PAGE + idx + 1}</td>
                        <td className="title-cell">{material.title}</td>
                        <td><span className="cat-badge">{material.category}</span></td>
                        <td>{new Date(material.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(material.updatedAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/admin/materials/${material.id}`}>
                              <Button variant="ghost" size="small">View</Button>
                            </Link>
                            <Link to={`/admin/materials/${material.id}/edit`}>
                              <Button variant="outline" size="small">Edit</Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={matPag.page} totalPages={matPag.totalPages} setPage={matPag.setPage} />
            </>
          ) : (
            <div className="empty-state">
              <p>No learning materials yet</p>
              <Link to="/admin/materials/create">
                <Button variant="primary">Create your first material</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Quizzes ── */}
      {activeTab === 'quizzes' && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quizzes</h2>
            <Link to="/admin/quizzes/create">
              <Button variant="secondary" size="small">
                <Plus size={16} />
                <span>New Quiz</span>
              </Button>
            </Link>
          </div>

          {quizzes.length > 0 ? (
            <>
              <div className="materials-table-container">
                <table className="materials-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Questions</th>
                      <th>Time Limit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizPag.sliced.map((quiz, idx) => (
                      <tr key={quiz.id}>
                        <td className="row-num">{(quizPag.page - 1) * ROWS_PER_PAGE + idx + 1}</td>
                        <td className="title-cell">{quiz.title}</td>
                        <td><span className="cat-badge">{quiz.category}</span></td>
                        <td>{quiz.questions.length}</td>
                        <td>{quiz.timeLimit} min</td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/admin/quizzes/${quiz.id}`}>
                              <Button variant="ghost" size="small">View</Button>
                            </Link>
                            <Link to={`/admin/quizzes/${quiz.id}/edit`}>
                              <Button variant="outline" size="small">Edit</Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={quizPag.page} totalPages={quizPag.totalPages} setPage={quizPag.setPage} />
            </>
          ) : (
            <div className="empty-state">
              <p>No quizzes yet</p>
              <Link to="/admin/quizzes/create">
                <Button variant="secondary">Create your first quiz</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Results ── */}
      {activeTab === 'results' && (
        <div className="dashboard-section animate-fade-in">
          <div className="section-header">
            <h2>Results</h2>
          </div>

          {aggregatedResults.length > 0 ? (
            <>

              {/* Summary Metrics Cards */}
              <div className="stats-grid results-stats-grid">
                <Card className="stat-card">
                  <div className="stat-icon"><Users size={24} /></div>
                  <div className="stat-content">
                    <h3 className="stat-value">{userResultsMap.length}</h3>
                    <p className="stat-label">Active Users</p>
                  </div>
                </Card>
                <Card className="stat-card">
                  <div className="stat-icon"><Activity size={24} /></div>
                  <div className="stat-content">
                    <h3 className="stat-value">{quizResults.length}</h3>
                    <p className="stat-label">Total Attempts</p>
                  </div>
                </Card>
                <Card className="stat-card">
                  <div className="stat-icon"><Target size={24} /></div>
                  <div className="stat-content">
                    <h3 className="stat-value">
                      {(quizResults.reduce((acc, r) => acc + (r.score || 0), 0) / Math.max(1, quizResults.length)).toFixed(1)}%
                    </h3>
                    <p className="stat-label">Avg. Score</p>
                  </div>
                </Card>
                <Card className="stat-card">
                  <div className="stat-icon"><Award size={24} /></div>
                  <div className="stat-content">
                    <h3 className="stat-value">
                      {quizResults.length ? Math.max(...quizResults.map(r => r.score || 0)) : 0}%
                    </h3>
                    <p className="stat-label">Top Score</p>
                  </div>
                </Card>
              </div>

              {/* Charts Restored */}
              <QuizAnalyticsChart quizResults={quizResults} quizzes={quizzes} />

              {/* Per-user table (unique users only) */}
              <div className="results-section-header">
                <h3 className="results-table-title">👥 User Results</h3>
                <span className="results-count">{userResultsMap.length} unique users</span>
              </div>

              <div className="materials-table-container">
                <table className="materials-table results-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>No. of Attempts</th>
                      <th>Avg Score</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userPag.sliced.map((user, idx) => {
                      const totalAttempts = user.quizAttempts.reduce((s, q) => s + q.attempts, 0);
                      const avgScore = user.quizAttempts.length
                        ? (
                          user.quizAttempts.reduce((s, q) => s + q.avgScore, 0) /
                          user.quizAttempts.length
                        ).toFixed(1)
                        : '—';

                      return (
                        <tr key={user.userId || idx}>
                          <td className="row-num">{(userPag.page - 1) * ROWS_PER_PAGE + idx + 1}</td>
                          <td className="title-cell user-name-cell">
                            <span className="user-avatar-sm">
                              {user.userName.charAt(0).toUpperCase()}
                            </span>
                            {user.userName}
                          </td>
                          <td>{user.userEmail}</td>
                          <td>
                            <span className="badge-attempts">{totalAttempts}</span>
                          </td>
                          <td>
                            <span className={`score-chip ${scoreClass(parseFloat(avgScore))}`}>
                              {avgScore !== '—' ? `${avgScore}%` : '—'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="view-details-btn"
                              onClick={() => setSelectedUser(user)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination page={userPag.page} totalPages={userPag.totalPages} setPage={userPag.setPage} />
            </>
          ) : (
            <div className="empty-state">
              <p>No quiz attempts yet</p>
            </div>
          )}
        </div>
      )}
        {/* ── Feedback ── */}
        {activeTab === 'feedback' && (
          <div className="dashboard-section animate-fade-in">
            <div className="section-header">
              <h2>User Feedback</h2>
              <span className="results-count">{feedbacks.length} total entries</span>
            </div>

            {feedbacks.length > 0 ? (
              <div className="feedback-grid-admin">
                {feedbacks.map(feedback => (
                  <div key={feedback.id} className="admin-feedback-card-premium">
                    <div className="afcp-header">
                      <div className="afcp-user">
                        <div className="afcp-avatar">
                          {(feedback.userName || feedback.userId?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="afcp-info">
                          <span className="afcp-name">{feedback.userName || feedback.userId?.name || 'Unknown User'}</span>
                          <span className="afcp-date">{new Date(feedback.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`afcp-type-badge ${feedback.category?.toLowerCase().replace(' ', '-')}`}>
                        {feedback.category}
                      </span>
                    </div>
                    <div className="afcp-content">
                      <h4 className="afcp-title">{feedback.title}</h4>
                      <p className="afcp-text">{feedback.message}</p>
                    </div>
                    {feedback.rating && (
                      <div className="afcp-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < feedback.rating ? 'filled' : ''}`}>★</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No feedback received yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
