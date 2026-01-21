import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  LayoutDashboard,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import Button from './Button';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardLink = user?.role === 'admin' ? '/admin' : '/user';

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Simplified navigation to avoid duplication with Dashboard tabs
  // "Feedback" is kept as requested
  const getNavLinks = () => {
    // Admin specific links if needed, otherwise simplified
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Feedback', path: '/feedbacks', icon: MessageSquare },
      ];
    }
    return [
      { name: 'Dashboard', path: '/user', icon: LayoutDashboard },
      { name: 'Feedback', path: '/feedbacks', icon: MessageSquare },
    ];
  };

  const currentLinks = user ? getNavLinks() : [];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-wrapper">
            <img src="/Logo.png" alt="LearnAssess" className="navbar-logo-image" />
          </div>
          <span className="brand-name">LearnAssess</span>
        </Link>

        {user ? (
          <>
            {/* Desktop Menu */}
            <div className="navbar-menu desktop-only">
              {currentLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
                >
                  <link.icon size={18} className="nav-icon" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="navbar-user desktop-only">
              <div className="user-info">
                <span className="user-role-badge">
                  {user.role}
                </span>
                <span className="navbar-username">
                  {user.username}
                </span>
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={handleLogout}
                className="navbar-logout"
                title="Logout"
              >
                <LogOut size={18} />
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        ) : (
          <div className="navbar-actions">
            <Link to="/login">
              <Button variant="primary" size="small">Login</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {user && isMobileMenuOpen && (
        <div className="mobile-menu">
          {currentLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <link.icon size={18} />
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="mobile-user-actions">
            <div className="mobile-user-info">
              <span className="navbar-username">{user.username}</span>
              <span className="user-role-badge">{user.role}</span>
            </div>
            <Button
              variant="outline"
              size="small"
              onClick={handleLogout}
              className="mobile-logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;