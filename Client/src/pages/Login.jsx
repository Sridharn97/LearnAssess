import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { BookOpen, Lock, Mail, CheckCircle, ArrowRight } from 'lucide-react';
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
      {/* Left Panel: Hero Section */}
      <div className="login-hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-logo">
            <div className="logo-badge">
              <img src="/Logo.png" alt="LearnAssess" className="hero-logo-img" />
            </div>
            <span className="hero-brand">LearnAssess</span>
          </div>

          <div className="hero-text-group">
            <h2 className="hero-title">Master Your Skills.<br />Elevate Your Learning.</h2>
            <p className="hero-subtitle">
              Access course materials, challenge yourself with interactive quizzes, and receive personalized AI-driven feedback.
            </p>
          </div>

          <div className="hero-features">
            <div className="feature-item">
              <CheckCircle size={20} className="feature-icon" />
              <span>AI-Powered Assessments & Insights</span>
            </div>
            <div className="feature-item">
              <CheckCircle size={20} className="feature-icon" />
              <span>Interactive Quizzes & Resources</span>
            </div>
            <div className="feature-item">
              <CheckCircle size={20} className="feature-icon" />
              <span>Real-Time Feedback & Analytics</span>
            </div>
          </div>

          <div className="hero-footer">
            <p>© {new Date().getFullYear()} LearnAssess. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Panel: Form Section */}
      <div className="login-form-section">
        <div className="form-container">
          <div className="form-header">
            <div className="mobile-logo">
              <img src="/Logo.png" alt="LearnAssess" className="mobile-logo-img" />
              <h1>LearnAssess</h1>
            </div>
            <h2 className="form-title">Welcome back</h2>
            <p className="form-subtitle">Please enter your details to sign in</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="login-error">
                {errorMessage}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
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
            </div>

            <Button type="submit" variant="primary" fullWidth className="login-button">
              <span>Sign In</span>
              <ArrowRight size={16} className="button-arrow" />
            </Button>

            <div className="signup-prompt">
              <span>Don't have an account?</span>{' '}
              <Link to="/signup" className="signup-link">
                Sign up for free
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;