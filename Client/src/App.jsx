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
import InterviewList from './pages/user/InterviewList';
import InterviewView from './pages/user/InterviewView';
import InterviewForm from './pages/user/InterviewForm';
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
        <Route path="admin/interviews" element={
        <UserRoute>
          <InterviewList />
        </UserRoute>
      } />
   
      <Route path="admin/interviews/:interviewId" element={
        <UserRoute>
          <InterviewView />
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
      
      {/* Interview routes */}
      <Route path="/interviews" element={
        <UserRoute>
          <InterviewList />
        </UserRoute>
      } />
      <Route path="/interviews/new" element={
        <UserRoute>
          <InterviewForm />
        </UserRoute>
      } />
      <Route path="/interviews/:interviewId" element={
        <UserRoute>
          <InterviewView />
        </UserRoute>
      } />
      <Route path="/interviews/:interviewId/edit" element={
        <UserRoute>
          <InterviewForm />
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