import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import MaterialEdit from './pages/admin/MaterialEdit';
import QuizEdit from './pages/admin/QuizEdit';
import UserDashboard from './pages/user/UserDashboard';
import MaterialsList from './pages/user/MaterialsList';
import QuizzesList from './pages/user/QuizzesList';
import MaterialView from './pages/user/MaterialView';
import QuizView from './pages/user/QuizView';
import FeedbackList from './pages/user/FeedbackList';
import FeedbackView from './pages/user/FeedbackView';
import FeedbackForm from './pages/user/FeedbackForm';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import './styles/global.css';

// Protected routes
const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/user" />;
  }

  return children;
};

const UserRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/admin/materials" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/admin/quizzes" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/admin/materials/create" element={
        <AdminRoute>
          <MaterialEdit isCreating={true} />
        </AdminRoute>
      } />
      <Route path="/admin/materials/:materialId" element={
        <AdminRoute>
          <MaterialView />
        </AdminRoute>
      } />
      <Route path="/admin/materials/:materialId/edit" element={
        <AdminRoute>
          <MaterialEdit />
        </AdminRoute>
      } />
      <Route path="/admin/quizzes/create" element={
        <AdminRoute>
          <QuizEdit isCreating={true} />
        </AdminRoute>
      } />
      <Route path="/admin/quizzes/:quizId" element={
        <AdminRoute>
          <QuizView />
        </AdminRoute>
      } />
      <Route path="/admin/quizzes/:quizId/edit" element={
        <AdminRoute>
          <QuizEdit />
        </AdminRoute>
      } />
      <Route path="admin/feedbacks" element={
        <UserRoute>
          <FeedbackList />
        </UserRoute>
      } />

      <Route path="admin/feedbacks/:feedbackId" element={
        <UserRoute>
          <FeedbackView />
        </UserRoute>
      } />

      {/* User routes */}
      <Route path="/user" element={
        <UserRoute>
          <UserDashboard />
        </UserRoute>
      } />
      <Route path="/materials" element={
        <UserRoute>
          <MaterialsList />
        </UserRoute>
      } />
      <Route path="/quizzes" element={
        <UserRoute>
          <QuizzesList />
        </UserRoute>
      } />
      <Route path="/materials/:materialId" element={
        <UserRoute>
          <MaterialView />
        </UserRoute>
      } />
      <Route path="/quizzes/:quizId" element={
        <UserRoute>
          <QuizView />
        </UserRoute>
      } />

      {/* Feedback routes */}
      <Route path="/feedbacks" element={
        <UserRoute>
          <FeedbackList />
        </UserRoute>
      } />
      <Route path="/feedbacks/new" element={
        <UserRoute>
          <FeedbackForm />
        </UserRoute>
      } />
      <Route path="/feedbacks/:feedbackId" element={
        <UserRoute>
          <FeedbackView />
        </UserRoute>
      } />
      <Route path="/feedbacks/:feedbackId/edit" element={
        <UserRoute>
          <FeedbackForm />
        </UserRoute>
      } />


      <Route path="/" element={
        user ?
          (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/user" />) :
          <Navigate to="/login" />
      } />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <div className="page-container">
            <Navbar />
            <main className="page-content">
              <AppRoutes />
            </main>
          </div>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;