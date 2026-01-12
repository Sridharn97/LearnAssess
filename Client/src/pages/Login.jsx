import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { BookOpen, User, Lock, Mail } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, user } = useAuth();
  const { users } = useData();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const result = await login(email, password);

    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/user');
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <img src="/Logo.png" alt="LearnAssess" className="login-logo-image" />
            <h1>LearnAssess</h1>
          </div>
          <p className="login-subtitle">Your Learning Journey Starts here</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="login-error">
              {errorMessage}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="login-label">
              <Mail size={18} />
              <span>Email</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="login-label">
              <Lock size={18} />
              <span>Password</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth className="login-button">
            Login
          </Button>

          <div className="signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;