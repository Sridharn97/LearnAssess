import React, { useMemo, useState } from 'react';
import { BookOpen, FileText, HelpCircle, Plus, X, ChevronLeft, ChevronRight, Users, Target, Trophy, Award, Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import QuizAnalyticsChart from '../../components/admin/QuizAnalyticsChart';
import { useData } from '../../context/DataContext';
import './AdminDashboard.css';

// ── Pagination Helper ─────────────────────────────────────────────────────────
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

        {/* ── Summary Stats Grid ── */}
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
  const { materials, quizzes, quizResults } = useData();
  const [activeTab, setActiveTab] = useState('overview');
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
    <div className="admin-dashboard">
      {/* Modals */}
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
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

      <div className="dashboard-tabs">
        {['overview', 'materials', 'quizzes', 'results'].map(tab => (
          <button
            key={tab}
            className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === 'overview' && (
        <div className="dashboard-section">
          <div className="stats-grid">
            <Card className="stat-card">
              <div className="stat-icon"><FileText size={24} /></div>
              <div className="stat-content">
                <h3 className="stat-value">{totalMaterials}</h3>
                <p className="stat-label">Learning Materials</p>
              </div>
            </Card>
            <Card className="stat-card">
              <div className="stat-icon"><HelpCircle size={24} /></div>
              <div className="stat-content">
                <h3 className="stat-value">{totalQuizzes}</h3>
                <p className="stat-label">Quizzes</p>
              </div>
            </Card>
            <Card className="stat-card">
              <div className="stat-icon"><BookOpen size={24} /></div>
              <div className="stat-content">
                <h3 className="stat-value">{totalQuestions}</h3>
                <p className="stat-label">Quiz Questions</p>
              </div>
            </Card>
          </div>

          <div className="dashboard-grid">
            <Card className="recent-card">
              <h3 className="card-title">Recent Materials</h3>
              {recentMaterials.length > 0 ? (
                <ul className="recent-list">
                  {recentMaterials.map(material => (
                    <li key={material.id} className="recent-item">
                      <Link to={`/admin/materials/${material.id}`}>
                        <span className="recent-title">{material.title}</span>
                        <span className="recent-category">{material.category}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-message">No materials yet</p>
              )}
              <Link to="/admin/materials" className="view-all-link">View all materials</Link>
            </Card>

            <Card className="recent-card">
              <h3 className="card-title">Recent Quizzes</h3>
              {recentQuizzes.length > 0 ? (
                <ul className="recent-list">
                  {recentQuizzes.map(quiz => (
                    <li key={quiz.id} className="recent-item">
                      <Link to={`/admin/quizzes/${quiz.id}`}>
                        <span className="recent-title">{quiz.title}</span>
                        <span className="recent-meta">{quiz.questions.length} questions</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-message">No quizzes yet</p>
              )}
              <Link to="/admin/quizzes" className="view-all-link">View all quizzes</Link>
            </Card>
          </div>

          <Card className="category-card">
            <h3 className="card-title">Materials by Category</h3>
            <div className="category-list">
              {Object.keys(materialsByCategory).length > 0 ? (
                Object.entries(materialsByCategory).map(([category, items]) => (
                  <div key={category} className="category-item">
                    <div className="category-header">
                      <h4 className="category-name">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </h4>
                      <span className="category-count">{items.length}</span>
                    </div>
                    <div className="category-progress">
                      <div
                        className="category-progress-bar"
                        style={{ width: `${(items.length / totalMaterials) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-message">No categories yet</p>
              )}
            </div>
          </Card>
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
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quiz Attempts &amp; Scores</h2>
          </div>

          {aggregatedResults.length > 0 ? (
            <>
              <div className="section-header">
                <h2>Quiz Results Analytics</h2>
              </div>

              {/* Summary Metrics Cards */}
              <div className="stats-grid">
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
    </div>
  );
};

export default AdminDashboard;