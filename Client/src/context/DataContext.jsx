import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://learnassess.onrender.com/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = (includeContentType = true) => {
    const token = localStorage.getItem('token');
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      // No sample data - start with empty arrays
      setMaterials([]);
      setQuizzes([]);
      setUsers([]);
      setFeedbacks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [materialsRes, quizzesRes, quizResultsRes, feedbacksRes] = await Promise.all([
        fetch(`${API_BASE_URL}/materials`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/quizzes`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/quiz-results`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/feedbacks`, { headers: getAuthHeaders() }),
      ]);

      if (materialsRes.ok) {
        const materialsData = await materialsRes.json();
        // Normalize data to have id field
        const normalizedMaterials = materialsData.map(material => ({
          ...material,
          id: material._id || material.id
        }));
        setMaterials(normalizedMaterials);
      }
      if (quizzesRes.ok) {
        const quizzesData = await quizzesRes.json();
        // Normalize data to have id field
        const normalizedQuizzes = quizzesData.map(quiz => ({
          ...quiz,
          id: quiz._id || quiz.id
        }));
        setQuizzes(normalizedQuizzes);
      }
      if (quizResultsRes.ok) {
        const quizResultsData = await quizResultsRes.json();
        console.log('Fetched quiz results response:', quizResultsRes);
        console.log('Fetched quiz results data:', quizResultsData);
        // Normalize data to have id field
        const normalizedQuizResults = quizResultsData.map(result => ({
          ...result,
          id: result._id || result.id
        }));
        console.log('Normalized quiz results:', normalizedQuizResults);
        setQuizResults(normalizedQuizResults);
      } else {
        console.error('Failed to fetch quiz results:', quizResultsRes.status, quizResultsRes.statusText);
        const errorText = await quizResultsRes.text();
        console.error('Error response body:', errorText);
        setQuizResults([]);
      }
      if (feedbacksRes.ok) {
        const feedbacksData = await feedbacksRes.json();
        // Normalize data to have id field
        const normalizedFeedbacks = feedbacksData.map(feedback => ({
          ...feedback,
          id: feedback._id || feedback.id
        }));
        setFeedbacks(normalizedFeedbacks);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // No fallback data - set empty arrays
      setMaterials([]);
      setQuizzes([]);
      setQuizResults([]);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  // Materials CRUD
  const addMaterial = async (materialData) => {
    try {
      const isFormData = materialData instanceof FormData;
      const response = await fetch(`${API_BASE_URL}/materials`, {
        method: 'POST',
        headers: getAuthHeaders(!isFormData),
        body: isFormData ? materialData : JSON.stringify(materialData),
      });

      if (response.ok) {
        const newMaterial = await response.json();
        const normalizedMaterial = {
          ...newMaterial,
          id: newMaterial._id || newMaterial.id
        };
        setMaterials([...materials, normalizedMaterial]);
        return normalizedMaterial;
      } else {
        throw new Error('Failed to add material');
      }
    } catch (error) {
      console.error('Error adding material:', error);
      throw error;
    }
  };

  const updateMaterial = async (updatedMaterial) => {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/${updatedMaterial._id || updatedMaterial.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedMaterial),
      });

      if (response.ok) {
        const material = await response.json();
        setMaterials(materials.map(m =>
          (m._id || m.id) === (updatedMaterial._id || updatedMaterial.id) ? material : m
        ));
        return material;
      } else {
        throw new Error('Failed to update material');
      }
    } catch (error) {
      console.error('Error updating material:', error);
      // Fallback to local state
      setMaterials(materials.map(m =>
        (m._id || m.id) === (updatedMaterial._id || updatedMaterial.id) ? updatedMaterial : m
      ));
      return updatedMaterial;
    }
  };

  const deleteMaterial = async (materialId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/${materialId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setMaterials(materials.filter(m => (m._id || m.id) !== materialId));
      } else {
        throw new Error('Failed to delete material');
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      // Fallback to local state
      setMaterials(materials.filter(m => (m._id || m.id) !== materialId));
    }
  };

  const getMaterial = (materialId) => {
    return materials.find(material => material.id === materialId || material._id === materialId);
  };

  // Quizzes CRUD
  const addQuiz = async (quiz) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(quiz)
      });

      if (response.ok) {
        const newQuiz = await response.json();
        // Normalize data to have id field
        const normalizedQuiz = {
          ...newQuiz,
          id: newQuiz._id || newQuiz.id
        };
        setQuizzes([...quizzes, normalizedQuiz]);
        return normalizedQuiz;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create quiz');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  };

  const updateQuiz = async (updatedQuiz) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${updatedQuiz._id || updatedQuiz.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(updatedQuiz)
      });

      if (response.ok) {
        const updatedQuizData = await response.json();
        // Normalize data to have id field
        const normalizedQuiz = {
          ...updatedQuizData,
          id: updatedQuizData._id || updatedQuizData.id
        };
        setQuizzes(quizzes.map(quiz =>
          (quiz.id === normalizedQuiz.id || quiz._id === normalizedQuiz._id) ? normalizedQuiz : quiz
        ));
        return normalizedQuiz;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update quiz');
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setQuizzes(quizzes.filter(quiz => (quiz.id !== quizId && quiz._id !== quizId)));
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  };

  const getQuiz = (quizId) => {
    return quizzes.find(quiz => quiz.id === quizId || quiz._id === quizId);
  };

  // Quiz Results
  const addQuizResult = async (result) => {
    console.log('Saving quiz result:', result);
    console.log('Current quizResults before save:', quizResults);
    try {
      const response = await fetch(`${API_BASE_URL}/quiz-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(result)
      });

      console.log('Save response status:', response.status);
      if (response.ok) {
        const newResult = await response.json();
        console.log('Saved quiz result response:', newResult);
        // Normalize data to have id field
        const normalizedResult = {
          ...newResult,
          id: newResult._id || newResult.id
        };
        const updatedQuizResults = [...quizResults, normalizedResult];
        console.log('Updated quizResults after save:', updatedQuizResults);
        setQuizResults(updatedQuizResults);
        return normalizedResult;
      } else {
        const error = await response.json();
        console.error('Failed to save quiz result:', error);
        throw new Error(error.message || 'Failed to save quiz result');
      }
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  };

  const getUserQuizResults = (userId) => {
    return quizResults.filter(result => result.userId === userId);
  };

  const getQuizResultByUserAndQuiz = (userId, quizId) => {
    return quizResults.find(result =>
      result.userId === userId && (result.quizId._id === quizId || result.quizId === quizId)
    );
  };

  // Feedback CRUD
  const addFeedback = async (feedbackData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedbacks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(feedbackData)
      });

      if (response.ok) {
        const newFeedback = await response.json();
        const normalizedFeedback = {
          ...newFeedback,
          id: newFeedback._id || newFeedback.id
        };
        setFeedbacks([...feedbacks, normalizedFeedback]);
        return normalizedFeedback;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add feedback');
      }
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  };

  const updateFeedback = async (updatedFeedback) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedbacks/${updatedFeedback.id || updatedFeedback._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedFeedback)
      });

      if (response.ok) {
        const feedback = await response.json();
        const normalizedFeedback = {
          ...feedback,
          id: feedback._id || feedback.id
        };
        setFeedbacks(feedbacks.map(f =>
          (f.id === normalizedFeedback.id || f._id === normalizedFeedback._id) ? normalizedFeedback : f
        ));
        return normalizedFeedback;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update feedback');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      throw error;
    }
  };

  const deleteFeedback = async (feedbackId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedbacks/${feedbackId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setFeedbacks(feedbacks.filter(f => (f.id !== feedbackId && f._id !== feedbackId)));
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  };

  const getFeedback = (feedbackId) => {
    return feedbacks.find(feedback => feedback.id === feedbackId || feedback._id === feedbackId);
  };

  const getUserFeedbacks = (userId) => {
    return feedbacks.filter(feedback => feedback.userId === userId);
  };

  const value = {
    materials,
    quizzes,
    users,
    setUsers,
    quizResults,
    feedbacks,
    loading,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterial,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    getQuiz,
    addQuizResult,
    getUserQuizResults,
    getQuizResultByUserAndQuiz,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    getFeedback,
    getUserFeedbacks
  };

  return (
    <DataContext.Provider value={value}>
      {!loading && children}
    </DataContext.Provider>
  );
};