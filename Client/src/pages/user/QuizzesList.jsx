import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import QuizCard from '../../components/user/QuizCard';
import './QuizzesList.css';

const QuizzesList = () => {
  const { quizzes, getQuizzes } = useData();
  const [loading, setLoading] = useState(true);

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

      <div className="quizzes-grid">
        {quizzes.length > 0 ? (
          quizzes.map(quiz => (
            <QuizCard key={quiz._id || quiz.id} quiz={quiz} />
          ))
        ) : (
          <div className="empty-state">
            <p>No quizzes available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesList;