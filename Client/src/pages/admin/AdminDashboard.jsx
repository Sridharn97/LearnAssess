import React, { useState } from 'react';
import { BookOpen, FileText, HelpCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useData } from '../../context/DataContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { materials, quizzes } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Stats
  const totalMaterials = materials.length;
  const totalQuizzes = quizzes.length;
  const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
  
  // Group materials by category
  const materialsByCategory = materials.reduce((acc, material) => {
    const category = material.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(material);
    return acc;
  }, {});
  
  const recentMaterials = [...materials]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);
  
  const recentQuizzes = [...quizzes]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);
  
  return (
    <div className="admin-dashboard">
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
      </div>
      
      {activeTab === 'overview' && (
        <div className="dashboard-section">
          <div className="stats-grid">
            <Card className="stat-card">
              <div className="stat-icon">
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{totalMaterials}</h3>
                <p className="stat-label">Learning Materials</p>
              </div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-icon">
                <HelpCircle size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{totalQuizzes}</h3>
                <p className="stat-label">Quizzes</p>
              </div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-icon">
                <BookOpen size={24} />
              </div>
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
              <Link to="/admin/materials" className="view-all-link">
                View all materials
              </Link>
            </Card>
            
            <Card className="recent-card">
              <h3 className="card-title">Recent Quizzes</h3>
              {recentQuizzes.length > 0 ? (
                <ul className="recent-list">
                  {recentQuizzes.map(quiz => (
                    <li key={quiz.id} className="recent-item">
                      <Link to={`/admin/quizzes/${quiz.id}`}>
                        <span className="recent-title">{quiz.title}</span>
                        <span className="recent-meta">
                          {quiz.questions.length} questions
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-message">No quizzes yet</p>
              )}
              <Link to="/admin/quizzes" className="view-all-link">
                View all quizzes
              </Link>
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
                      ></div>
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
            <div className="materials-table-container">
              <table className="materials-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Created</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map(material => (
                    <tr key={material.id}>
                      <td className="title-cell">{material.title}</td>
                      <td>{material.category}</td>
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
            <div className="materials-table-container">
              <table className="materials-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Questions</th>
                    <th>Time Limit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map(quiz => (
                    <tr key={quiz.id}>
                      <td className="title-cell">{quiz.title}</td>
                      <td>{quiz.category}</td>
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
    </div>
  );
};

export default AdminDashboard;