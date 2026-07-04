import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Award } from 'lucide-react';
import './Home.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const Home = () => {

  return (
    <div className="home-container">
      {/* Navbar */}
      <motion.nav 
        className="home-navbar"
        initial={{ y: -50, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to="/" className="nav-brand">
          <img src="/Logo.png" alt="LearnAssess Logo" className="brand-logo" />
          <span className="brand-title">LearnAssess</span>
        </Link>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Log in</Link>
          <Link to="/signup" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.95rem' }}>Sign up free</Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 className="hero-title" variants={fadeInUp}>
            Master Your Skills with Intelligent Assessments
          </motion.h1>
          <motion.p className="hero-subtitle" variants={fadeInUp}>
            Elevate your learning journey. Access premium materials, take interactive quizzes, and track your progress with next-generation analytics.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link to="/signup" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Start Learning Free</Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-image-container"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <img 
            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1000&auto=format&fit=crop" 
            alt="Student studying with learning materials" 
            className="hero-image"
            style={{ borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div 
          className="features-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon-wrapper"><BookOpen size={24} color="#3b82f6" /></div>
            <h3 className="feature-card-title">Premium Study Materials</h3>
            <p className="feature-card-desc">Access a curated library of high-quality study materials, notes, and resources tailored specifically to your subjects and career goals.</p>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon-wrapper"><Award size={24} color="#3b82f6" /></div>
            <h3 className="feature-card-title">Progress Tracking</h3>
            <p className="feature-card-desc">Visualize your growth with detailed analytics and performance insights over time. Know exactly where you stand.</p>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon-wrapper"><Target size={24} color="#3b82f6" /></div>
            <h3 className="feature-card-title">Interactive Quizzes</h3>
            <p className="feature-card-desc">Engaging quizzes designed to reinforce learning and identify weak areas.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <motion.div
          className="how-it-works-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>How it works</h2>
        </motion.div>
        
        <motion.div 
          className="steps-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="step-card" variants={fadeInUp}>
            <span className="step-number">01</span>
            <h3 className="step-title">Create an Account</h3>
            <p className="step-desc">Sign up in seconds and get instant access to your personalized dashboard featuring sleek analytics.</p>
          </motion.div>

          <motion.div className="step-card" variants={fadeInUp}>
            <span className="step-number">02</span>
            <h3 className="step-title">Dive into Materials</h3>
            <p className="step-desc">Browse through extensive categories, find your niche, and consume knowledge in a distraction-free environment.</p>
          </motion.div>

          <motion.div className="step-card" variants={fadeInUp}>
            <span className="step-number">03</span>
            <h3 className="step-title">Test Your Knowledge</h3>
            <p className="step-desc">Challenge yourself with interactive assessments. Review detailed feedback to solidify your understanding.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Call To Action Section */}
      <section className="cta-section">
        <motion.div 
          className="cta-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="cta-title">Ready to level up?</h2>
          <p className="cta-desc">Join LearnAssess today and experience the future of learning and assessment. No credit card required.</p>
          <Link to="/signup" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Get Started Now
          </Link>
        </motion.div>
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo-container">
              <img src="/Logo.png" alt="LearnAssess Logo" className="footer-logo" />
              LearnAssess
            </Link>
          </div>
          
          <div className="footer-links-group">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/materials">Materials</Link></li>
              <li><Link to="/quizzes">Quizzes</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LearnAssess. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
