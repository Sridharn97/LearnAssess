import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const result = await signup({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      navigate('/user');
    } else {
      setErrorMessage(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Left Panel: Light Theme Photo */}
      <div className="signup-hero-section">
        <div className="hero-overlay-gradient"></div>
        <div className="hero-content">
          <Link to="/" className="hero-logo">
            <img src="/Logo.png" alt="LearnAssess Logo" className="hero-logo-img" />
            <span className="hero-brand">LearnAssess</span>
          </Link>
          
          <div className="hero-features">
            <div className="feature-item">
              <CheckCircle size={28} className="feature-icon" weight="fill" />
              <span>AI-Powered Insights,</span>
            </div>
            <div className="feature-item">
              <CheckCircle size={28} className="feature-icon" weight="fill" />
              <span>Interactive Quizzes,</span>
            </div>
            <div className="feature-item">
              <CheckCircle size={28} className="feature-icon" weight="fill" />
              <span>Real-Time Feedback</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Form Section */}
      <div className="signup-form-section">
        <div className="form-container">
          <div className="form-header">
            <Link to="/" className="mobile-logo">
              <img src="/Logo.png" alt="LearnAssess" className="mobile-logo-img" />
              <h1>LearnAssess</h1>
            </Link>
            <h2 className="form-title">Create account</h2>
            <p className="form-subtitle">Get started with your free account</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="signup-error">
                {errorMessage}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                  <User size={18} className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    required
                  />
                  <User size={18} className="input-icon" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
                <Mail size={18} className="input-icon" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                  <Lock size={18} className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                  <Lock size={18} className="input-icon" />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <div className="login-prompt">
            Already have an account? 
            <Link to="/login" className="login-link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;