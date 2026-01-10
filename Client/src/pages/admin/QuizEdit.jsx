import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import QuizForm from '../../components/admin/QuizForm';
import Notification from '../../components/common/Notification';
import { useData } from '../../context/DataContext';
import './QuizEdit.css';

const QuizEdit = ({ isCreating = false }) => {
  const { quizId } = useParams();
  const { getQuiz, addQuiz, updateQuiz, deleteQuiz } = useData();
  const [quiz, setQuiz] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isCreating && quizId) {
      const foundQuiz = getQuiz(quizId);
      if (foundQuiz) {
        setQuiz(foundQuiz);
      } else {
        navigate('/admin/quizzes');
      }
    }
  }, [quizId, getQuiz, isCreating, navigate]);
  
  const handleSubmit = async (quizData) => {
    try {
      if (isCreating) {
        await addQuiz(quizData);
        setNotification({
          message: 'Quiz created successfully!',
          type: 'success'
        });
        setTimeout(() => {
          navigate('/admin/quizzes');
        }, 1500);
      } else {
        await updateQuiz(quizData);
        setQuiz(quizData);
        setNotification({
          message: 'Quiz updated successfully!',
          type: 'success'
        });
      }
    } catch (error) {
      setNotification({
        message: error.message || 'Failed to save quiz',
        type: 'error'
      });
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteQuiz(quizId);
      setNotification({
        message: 'Quiz deleted successfully!',
        type: 'success'
      });
      setTimeout(() => {
        navigate('/admin/quizzes');
      }, 1500);
    } catch (error) {
      setNotification({
        message: error.message || 'Failed to delete quiz',
        type: 'error'
      });
    }
  };
  
  return (
    <div className="quiz-edit-page">
      <div className="quiz-edit-header">
        <Link to="/admin/quizzes" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Quizzes</span>
        </Link>
        <h1>{isCreating ? 'Create New Quiz' : 'Edit Quiz'}</h1>
        
        {!isCreating && (
          <Button 
            variant="danger" 
            onClick={() => setShowDeleteConfirm(true)}
            className="delete-button"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </Button>
        )}
      </div>
      
      {(isCreating || quiz) && (
        <QuizForm 
          onSubmit={handleSubmit}
          initialData={isCreating ? null : quiz}
        />
      )}
      
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Delete Quiz</h3>
            <p>Are you sure you want to delete this quiz? This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <Button 
                variant="ghost" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDelete}
              >
                Delete Quiz
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default QuizEdit;