import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, BookOpen } from 'lucide-react';
import Button from './Button';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/Logo.png" alt="LearnAssess" className="navbar-logo-image" />
          <span>LearnAssess</span>
        </Link>
        
        {user ? (
          <>
            <div className="navbar-menu">
              <Link to="/interviews" className="navbar-link">Interview</Link>
            </div>
            <div className="navbar-user">
              <span className="navbar-username">
                {user.role === 'admin' ? 'Admin: ' : ''}{user.username}
              </span>
              <Button 
                variant="ghost" 
                size="small" 
                onClick={handleLogout}
                className="navbar-logout"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="navbar-actions">
            <Link to="/login">
              <Button variant="ghost" size="small"></Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;