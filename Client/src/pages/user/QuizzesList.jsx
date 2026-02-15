import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Search, Filter } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import QuizCard from '../../components/user/QuizCard';
import './QuizzesList.css';

const QuizzesList = () => {
  const { quizzes, quizResults, getQuizzes } = useData();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        await getQuizzes();
        setLoading(false);
      } catch (error) {
        console.error('Error loading quizzes:', error);
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [getQuizzes]);

  // Get user's completed quiz IDs
  const completedQuizIds = useMemo(() => {
    return new Set(
      quizResults
        .filter(result => result.userId?.toString() === user?._id?.toString())
        .map(result => (result.quizId._id || result.quizId)?.toString())
        .filter(Boolean)
    );
  }, [quizResults, user]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(quizzes.map(q => q.category))];
    return cats.sort();
  }, [quizzes]);

  // Filter and sort quizzes
  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
      
      const quizId = (quiz._id || quiz.id)?.toString();
      const isCompleted = completedQuizIds.has(quizId);
      let matchesStatus = true;
      
      if (filterStatus === 'completed') {
        matchesStatus = isCompleted;
      } else if (filterStatus === 'pending') {
        matchesStatus = !isCompleted;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'questions':
          return (b.questions?.length || 0) - (a.questions?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [quizzes, searchTerm, selectedCategory, filterStatus, sortBy, completedQuizIds]);

  if (loading) {
    return (
      <div className="quizzes-list-page">
        <div className="loading">Loading quizzes...</div>
      </div>
    );
  }

  return (
    <div className="quizzes-list-page">
      <div className="page-header">
        <Link to="/user" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>

        <div className="page-title">
          <HelpCircle size={24} />
          <h1>All Quizzes</h1>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Not Started</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Sort:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title (A-Z)</option>
              <option value="questions">Most Questions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="results-info">
        Showing {filteredQuizzes.length} of {quizzes.length} quizzes
      </div>

      <div className="quizzes-grid">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map(quiz => (
            <QuizCard key={quiz._id || quiz.id} quiz={quiz} />
          ))
        ) : (
          <div className="empty-state">
            <p>No quizzes found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesList;