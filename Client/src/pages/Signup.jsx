import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, UserCircle, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    const userData = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      name: formData.name
    };

    const result = await signup(userData);

    if (result.success) {
      navigate('/user');
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="signup-page">
      {/* Left Panel: Hero Section */}
      <div className="signup-hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-logo">
            <div className="logo-badge">
              <img src="/Logo.png" alt="LearnAssess" className="hero-logo-img" />
            </div>
            <span className="hero-brand">LearnAssess</span>
          </div>

          <div className="hero-text-group">
            <h2 className="hero-title">Start Your Learning<br />Journey Today.</h2>
            <p className="hero-subtitle">
              Join thousands of students learning and assessing their progress with our smart assessment dashboard.
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
      <div className="signup-form-section">
        <div className="form-container">
          <div className="form-header">
            <div className="mobile-logo">
              <img src="/Logo.png" alt="LearnAssess" className="mobile-logo-img" />
              <h1>LearnAssess</h1>
            </div>
            <h2 className="form-title">Create account</h2>
            <p className="form-subtitle">Get started with your free account</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="signup-error">
                {errorMessage}
              </div>
            )}

            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <UserCircle size={18} className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="signup-input"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="signup-input"
                    placeholder="johndoe"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="signup-input"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="signup-input"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="signup-input"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth className="signup-button">
              <span>Create Account</span>
              <ArrowRight size={16} className="button-arrow" />
            </Button>

            <div className="login-prompt">
              <span>Already have an account?</span>{' '}
              <Link to="/login" className="login-link">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;