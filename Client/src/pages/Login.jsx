import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/user');
    } else {
      setErrorMessage(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel: Light Theme Illustration */}
      <div className="login-hero-section">
        <div className="hero-content">
          <Link to="/" className="hero-logo">
            <img src="/Logo.png" alt="LearnAssess Logo" className="hero-logo-img" />
            <span className="hero-brand">LearnAssess</span>
          </Link>
        </div>
      </div>

      {/* Right Panel: Form Section */}
      <div className="login-form-section">
        <div className="form-container">
          <div className="form-header">
            <Link to="/" className="mobile-logo">
              <img src="/Logo.png" alt="LearnAssess" className="mobile-logo-img" />
              <h1>LearnAssess</h1>
            </Link>
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
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
                <Mail size={18} className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <Lock size={18} className="input-icon" />
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="signup-prompt">
            Don't have an account? 
            <Link to="/signup" className="signup-link">Sign up for free</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;