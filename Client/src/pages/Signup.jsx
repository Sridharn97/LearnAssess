import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, User, Lock, Mail, UserCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    role: 'user'
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
      name: formData.name,
      role: formData.role
    };

    const result = await signup(userData);

    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/user');
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <div className="signup-logo">
            <img src="/Logo.png" alt="LearnAssess" className="signup-logo-image" />
            <h1>LearnAssess</h1>
          </div>
          <p className="signup-subtitle">Create your account</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="signup-error">
              {errorMessage}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="signup-label">
              <User size={18} />
              <span>Username</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="signup-input"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="signup-label">
              <Mail size={18} />
              <span>Email</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="signup-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" className="signup-label">
              <UserCircle size={18} />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="signup-input"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="signup-label">
              <Lock size={18} />
              <span>Password</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="signup-input"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="signup-label">
              <Lock size={18} />
              <span>Confirm Password</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="signup-input"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="signup-label">
              <User size={18} />
              <span>Account Type</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="signup-input"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button type="submit" variant="primary" fullWidth className="signup-button">
            Create Account
          </Button>

          <div className="login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;