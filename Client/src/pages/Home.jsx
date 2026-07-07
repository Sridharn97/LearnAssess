import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Award, Sparkles, Zap, ChartBar, ArrowRight, Sun, Moon } from 'lucide-react';
import './Home.css';
import { useTheme } from '../context/ThemeContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const Home = () => {
  const { theme, toggleTheme } = useTheme();
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
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/login" className="nav-link">Log in</Link>
          <Link to="/signup" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.95rem' }}>Sign up free</Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.div 
            className="hero-pill"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles size={16} />
            <span>Discover the new standard in learning</span>
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Master your skills with <span>intelligent assessments.</span>
          </motion.h1>

          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Elevate your learning journey. Access premium study materials, challenge yourself with interactive quizzes, and track your progress with next-generation analytics—all in one beautiful platform.
          </motion.p>

          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/signup" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Start Learning Free <ArrowRight size={20} style={{ marginLeft: '8px' }}/>
            </Link>
            <Link to="/login" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              View Demo
            </Link>
          </motion.div>
        </div>

        <motion.div 
          className="hero-image-wrapper"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img 
            src="/students_learning.png" 
            alt="Students Learning"
            style={{ width: '100%', maxWidth: '600px', height: 'auto', borderRadius: '24px', filter: 'drop-shadow(0 24px 48px rgba(59,130,246,0.3))' }}
            animate={{ y: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* Logos Section */}
      <section className="logos-section">
        <h3 className="logos-title">Trusted by students from top institutions</h3>
        <div className="logos-grid">
          {/* Placeholder for logos to build trust */}
          <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'serif' }}>Harvard</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'serif' }}>Stanford</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'sans-serif' }}>MIT</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'serif' }}>Oxford</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'sans-serif' }}>Cambridge</div>
        </div>
      </section>

      {/* Bento Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Everything you need to succeed</h2>
          <p>A complete suite of tools designed to accelerate your learning and maximize your potential.</p>
        </div>

        <motion.div 
          className="bento-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="bento-card large" variants={fadeInUp}>
            <div className="bento-content">
              <div className="bento-icon"><ChartBar size={28} /></div>
              <h3>Advanced Progress Tracking</h3>
              <p>Visualize your growth with detailed analytics, performance insights over time, and automated skill mapping. Know exactly where you stand and what to focus on next.</p>
              <ul className="bento-feature-list">
                <li><Zap size={16} /> Real-time performance metrics</li>
                <li><Target size={16} /> AI-driven goal predictions</li>
                <li><Award size={16} /> Detailed cohort comparisons</li>
              </ul>
            </div>
            <div className="bento-image-grid">
              <div className="bento-image-wrapper main-img">
                <img src="/progress_tracking.png" alt="Progress Tracking Dashboard" />
              </div>
              <div className="bento-image-wrapper sub-img-1">
                <img src="/analytics_chart.png" alt="Analytics Chart" />
              </div>
              <div className="bento-image-wrapper sub-img-2">
                <img src="/performance_metric.png" alt="Performance Metric" />
              </div>
            </div>
          </motion.div>

          <motion.div className="bento-card" variants={fadeInUp}>
            <div className="bento-icon"><BookOpen size={28} /></div>
            <h3>Premium Materials</h3>
            <p>Access a curated library of high-quality study materials, notes, and resources tailored specifically to your goals.</p>
            <div className="bento-image-wrapper">
              <img src="/premium_materials.png" alt="Premium Study Materials" />
            </div>
          </motion.div>

          <motion.div className="bento-card" variants={fadeInUp}>
            <div className="bento-icon"><Target size={28} /></div>
            <h3>Interactive Quizzes</h3>
            <p>Engaging quizzes designed to reinforce learning, identify weak areas, and adapt to your learning pace.</p>
            <div className="bento-image-wrapper">
              <img src="/interactive_quizzes.png" alt="Interactive Quizzes" />
            </div>
          </motion.div>

          <motion.div className="bento-card large" variants={fadeInUp}>
            <div className="bento-content">
              <div className="bento-icon"><Zap size={28} /></div>
              <h3>Lightning Fast Interface</h3>
              <p>Experience a buttery-smooth, distraction-free environment that lets you focus entirely on your studies without any lag or clutter.</p>
              <ul className="bento-feature-list">
                <li><Zap size={16} /> Zero-latency interactions</li>
                <li><Sparkles size={16} /> Clutter-free minimal design</li>
                <li><Target size={16} /> Optimized for all devices</li>
              </ul>
            </div>
            <div className="bento-image-wrapper">
              <img src="/fast_interface.png" alt="Lightning Fast Interface" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section">
        <div className="workflow-container">
          <div className="section-header">
            <h2>How it works</h2>
            <p>Get started in minutes and transform the way you study.</p>
          </div>

          <motion.div 
            className="workflow-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className="workflow-step" variants={fadeInUp}>
              <div className="step-number-bubble">1</div>
              <h3>Create an Account</h3>
              <p>Sign up securely in seconds. No credit card required. Instantly unlock your personalized learning dashboard.</p>
            </motion.div>

            <motion.div className="workflow-step" variants={fadeInUp}>
              <div className="step-number-bubble">2</div>
              <h3>Dive into Materials</h3>
              <p>Browse through extensive categories, find your specific niche, and consume knowledge effortlessly with our built-in reader.</p>
            </motion.div>

            <motion.div className="workflow-step" variants={fadeInUp}>
              <div className="step-number-bubble">3</div>
              <h3>Test Your Knowledge</h3>
              <p>Challenge yourself with assessments. Review detailed scoring feedback to solidify your understanding and ace your exams.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>Loved by ambitious students</h2>
          <p>Join thousands who have already upgraded their learning.</p>
        </div>

        <motion.div 
          className="testimonials-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="testimonial-card" variants={fadeInUp}>
            <p className="testimonial-text">"LearnAssess completely changed how I prepare for my finals. The interactive quizzes and clean interface make studying actually enjoyable."</p>
            <div className="testimonial-author">
              <div className="author-avatar">S</div>
              <div className="author-info">
                <h4>Sarah Jenkins</h4>
                <span>Computer Science Student</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="testimonial-card" variants={fadeInUp}>
            <p className="testimonial-text">"Finally, a platform that doesn't feel cluttered. The analytics help me pinpoint exactly what topics I need to review before the test."</p>
            <div className="testimonial-author">
              <div className="author-avatar">M</div>
              <div className="author-info">
                <h4>Michael Chang</h4>
                <span>Medical Student</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="testimonial-card" variants={fadeInUp}>
            <p className="testimonial-text">"The built-in PDF viewer combined with immediate assessment is a game changer. I've abandoned all my other study apps for this."</p>
            <div className="testimonial-author">
              <div className="author-avatar">E</div>
              <div className="author-info">
                <h4>Elena Rodriguez</h4>
                <span>Engineering Major</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div 
          className="cta-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2>Ready to unlock your potential?</h2>
          <p>Join LearnAssess today and experience the most intelligent way to learn, study, and test your knowledge.</p>
          <Link to="/signup" className="btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}>
            Create Your Free Account
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="nav-brand">
              <img src="/Logo.png" alt="LearnAssess Logo" className="brand-logo" />
              <span className="brand-title">LearnAssess</span>
            </Link>
            <p className="footer-desc">
              Empowering students globally with intelligent assessments and premium study materials for a brighter future.
            </p>
          </div>
          <div className="footer-column">
            <h4>Product</h4>
            <ul className="footer-links">
              <li><Link to="/">Features</Link></li>
              <li><Link to="/">Assessments</Link></li>
              <li><Link to="/">Analytics</Link></li>
              <li><Link to="/">Pricing</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><Link to="/">Blog</Link></li>
              <li><Link to="/">Help Center</Link></li>
              <li><Link to="/">Community</Link></li>
              <li><Link to="/">Study Guides</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
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
