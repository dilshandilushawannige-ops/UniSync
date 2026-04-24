import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './HomePage.css';
import heroImage from '../assets/hero.png';
import arrow1 from '../assets/arrow1.png';
import schoolGroupNarrow from '../assets/school-group-narrow.png';
import computerGroup from '../assets/computer-group.png';
import smartResourcesIcon from '../assets/SmartResources.png';
import studyPlansIcon from '../assets/StudyPlans.png';
import liveClassesIcon from '../assets/LiveClasses.png';
import mcqPracticeIcon from '../assets/MCQPractice.png';
import helpGettingStarted from '../assets/help-getting-started.png';
import helpUsingPlatform from '../assets/help-using-platform.png';
import helpProfile from '../assets/help-profile.png';
import helpTools from '../assets/help-tools.png';
import helpAdmin from '../assets/help-admin.png';
import helpTips from '../assets/help-tips.png';
import studentImg from '../assets/student.png';
import adminImg from '../assets/admin.png';
import techImg from '../assets/tech.png';

const HomePage = () => {
  const [typedText, setTypedText] = React.useState('');
  const [openFaqIndex, setOpenFaqIndex] = React.useState(0);
  const [showRoleModal, setShowRoleModal] = React.useState(false);
  const [showSignupForm, setShowSignupForm] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [signupData, setSignupData] = React.useState({
    username: '',
    email: '',
    password: '',
    contact: ''
  });
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleModal(false);
    setShowSignupForm(true);
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          contact: signupData.contact,
          role: selectedRole
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Account created successfully! Please login.');
        setShowSignupForm(false);
        navigate('/login');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRoles = () => {
    setShowSignupForm(false);
    setShowRoleModal(true);
    setSelectedRole('');
  };

  React.useEffect(() => {
    const word = 'UniSync';
    let index = 0;
    let isDeleting = false;
    let timer;

    const typeLoop = () => {
      if (!isDeleting) {
        setTypedText(word.substring(0, index + 1));
        index++;
        if (index === word.length) {
          isDeleting = true;
          timer = setTimeout(typeLoop, 2500);
        } else {
          timer = setTimeout(typeLoop, 150);
        }
      } else {
        setTypedText(word.substring(0, index - 1));
        index--;
        if (index === 0) {
          isDeleting = false;
          timer = setTimeout(typeLoop, 800);
        } else {
          timer = setTimeout(typeLoop, 75);
        }
      }
    };

    timer = setTimeout(typeLoop, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page">
      <Navbar onGetStartedClick={() => setShowRoleModal(true)} />

      {/* Hero Section */}
      <section className="hero-landing">
        <div className="hero-container">
          <div className="hero-left">
            <h1 className="hero-main-title">
              Streamline Your<br />
              Campus Support with<br />
              <span className="hero-brand">
                {typedText}
                <span className="typing-cursor">|</span>
              </span>
            </h1>
            <p className="hero-description">
              A unified platform for reporting issues, tracking tickets, and managing campus maintenance.
              Designed for seamless communication between students, staff, and technicians.
            </p>
            <div className="hero-cta">
              <Link to="/create-ticket" className="btn-hero-primary">
                Report an Issue
              </Link>
              <Link to="/my-tickets" className="btn-hero-secondary">
                View My Tickets
              </Link>
            </div>
          </div>
          <div className="hero-right">
            <img src={heroImage} alt="Campus support" className="hero-image" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="features-section-wrapper">
        <section className="features-section" id="how-it-works">
          <div className="arrow-decoration">
            <img src={arrow1} alt="" className="arrow-img" />
          </div>
          <h2 className="section-heading">How It Works</h2>
          <p className="section-subheading">
            From reporting to resolution, manage all campus support tickets in one place
          </p>
          <div className="section-cta-wrapper">
            <button onClick={() => setShowRoleModal(true)} className="section-cta-btn">Get Started</button>
          </div>

          <div className="features-grid-landing">
            <div className="feature-card-landing">
              <div className="feature-header">
                <div className="feature-icon">
                  <img src={smartResourcesIcon} alt="Report Issues" className="feature-icon-img" />
                </div>
                <h3 className="feature-title">Report Issues</h3>
              </div>
              <p className="feature-description">
                Quickly submit maintenance requests, IT support tickets, or facility issues.
                Attach photos, specify location, and set priority levels. Our intuitive form
                ensures all necessary information is captured for fast resolution.
              </p>
              <Link to="/create-ticket" className="feature-btn">Create Ticket</Link>
            </div>

            <div className="feature-card-landing">
              <div className="feature-header">
                <div className="feature-icon">
                  <img src={studyPlansIcon} alt="Track Progress" className="feature-icon-img" />
                </div>
                <h3 className="feature-title">Track Progress</h3>
              </div>
              <p className="feature-description">
                Monitor your tickets in real-time from submission to resolution. Get instant
                updates on status changes, view assigned technicians, and receive notifications
                when your issues are being addressed or completed.
              </p>
              <Link to="/my-tickets" className="feature-btn">View Tickets</Link>
            </div>

            <div className="feature-card-landing">
              <div className="feature-header">
                <div className="feature-icon">
                  <img src={liveClassesIcon} alt="Collaborate" className="feature-icon-img" />
                </div>
                <h3 className="feature-title">Collaborate</h3>
              </div>
              <p className="feature-description">
                Communicate directly with technicians through ticket comments. Share additional
                details, provide updates, and get clarifications. Our comment system keeps all
                conversations organized and accessible in one place.
              </p>
              <button className="feature-btn">Learn More</button>
            </div>

            <div className="feature-card-landing">
              <div className="feature-header">
                <div className="feature-icon">
                  <img src={mcqPracticeIcon} alt="Admin Dashboard" className="feature-icon-img" />
                </div>
                <h3 className="feature-title">Admin Dashboard</h3>
              </div>
              <p className="feature-description">
                Comprehensive management tools for administrators and technicians. Assign tickets,
                update statuses, manage priorities, and generate reports. Keep your campus running
                smoothly with powerful oversight capabilities.
              </p>
              <Link to="/admin/tickets" className="feature-btn">Admin Panel</Link>
            </div>
          </div>
        </section>
      </div>

      {/* Promo Banner Section */}
      <section className="promo-banner-section">
        <div className="promo-banner-container">
          <img src={schoolGroupNarrow} alt="" className="promo-banner-path promo-path-left" />
          <div className="promo-banner-content">
            <h2 className="promo-banner-heading">UniSync for Smart Campus</h2>
            <p className="promo-banner-subheading">
              Our comprehensive platform empowers students, staff, and technicians to efficiently
              manage campus maintenance, IT support, and facility issues through streamlined ticket
              management and real-time collaboration.
            </p>
            <button className="promo-banner-btn">Find out more</button>
          </div>
          <img src={computerGroup} alt="" className="promo-banner-path promo-path-right" />
        </div>
      </section>

      {/* Help Center Section */}
      <section className="help-section" id="help-center">
        <h2 className="section-heading">How can we help?</h2>
        <p className="section-subheading" style={{ marginBottom: '3.5rem' }}>
          Explore our guides, tips, and resources designed to help you make the most out of UniSync.
        </p>

        <div className="help-grid">
          <div className="help-card">
            <img src={helpGettingStarted} alt="Getting started" className="help-card-icon" />
            <h3 className="help-card-title">Getting started</h3>
            <p className="help-card-desc">
              Welcome to UniSync! Learn how to create your first ticket and navigate the platform.
            </p>
          </div>

          <div className="help-card">
            <img src={helpUsingPlatform} alt="Using UniSync" className="help-card-icon" />
            <h3 className="help-card-title">Using UniSync</h3>
            <p className="help-card-desc">
              From ticket creation to resolution tracking, learn how UniSync works from top to bottom.
            </p>
          </div>

          <div className="help-card">
            <img src={helpProfile} alt="Your profile" className="help-card-icon" />
            <h3 className="help-card-title">Your profile &amp; settings</h3>
            <p className="help-card-desc">
              Manage your account preferences and notification settings for a personalized experience.
            </p>
          </div>

          <div className="help-card">
            <img src={helpTools} alt="Ticket management" className="help-card-icon" />
            <h3 className="help-card-title">Ticket management</h3>
            <p className="help-card-desc">
              Master the art of creating detailed tickets, adding attachments, and tracking progress.
            </p>
          </div>

          <div className="help-card">
            <img src={helpAdmin} alt="Admin features" className="help-card-icon" />
            <h3 className="help-card-title">Admin features</h3>
            <p className="help-card-desc">
              Learn about ticket assignment, status management, and administrative tools.
            </p>
          </div>

          <div className="help-card">
            <img src={helpTips} alt="Tips & tricks" className="help-card-icon" />
            <h3 className="help-card-title">Tips, tricks &amp; more</h3>
            <p className="help-card-desc">
              Best practices for efficient ticket management and faster issue resolution.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="faq-layout">
          {/* Left Column */}
          <div className="faq-left">
            <div className="faq-badge">
              <span className="faq-badge-icon">#</span> Frequently asked questions
            </div>
            <h2 className="faq-heading-large">
              Frequently asked
              <span className="faq-heading-highlight">questions</span>
            </h2>
            <p className="faq-left-desc">
              Find answers to common questions about UniSync's ticket management system,
              features, and how to get the most out of our platform.
            </p>
          </div>

          {/* Right Column (Accordion) */}
          <div className="faq-right">
            {[
              {
                q: "What is UniSync?",
                a: "UniSync is a comprehensive campus support ticket management system designed to streamline maintenance requests, IT support, and facility issues. It connects students, staff, and technicians in one unified platform."
              },
              {
                q: "How do I create a ticket?",
                a: "Simply click 'Report an Issue' or 'Create Ticket', fill in the details including title, category, description, priority, and location. You can also attach images to help technicians understand the issue better."
              },
              {
                q: "Can I track my ticket status?",
                a: "Yes! You can view all your tickets in the 'My Tickets' section. Each ticket shows its current status (Open, In Progress, Resolved, etc.), assigned technician, and any comments or updates."
              },
              {
                q: "How do I communicate with technicians?",
                a: "Use the comment section on each ticket to communicate directly with assigned technicians. You can ask questions, provide updates, or share additional information about your issue."
              }
            ].map((faq, idx) => (
              <div key={idx} className={`faq-item-modern ${openFaqIndex === idx ? 'open' : ''}`}>
                <button
                  className="faq-question-btn"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                >
                  {faq.q}
                  <span className="faq-icon-btn">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transition: 'transform 0.3s' }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
                {openFaqIndex === idx && (
                  <div className="faq-answer-modern">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="role-modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="role-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="role-modal-close" onClick={() => setShowRoleModal(false)}>×</button>

            <p className="role-modal-overline">GET STARTED</p>
            <h2 className="role-modal-title">Choose Your Role</h2>
            <p className="role-modal-subtitle">Select how you'll be using UniSync</p>

            <div className="role-modal-grid">
              <div
                className="role-modal-card"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('USER');
                }}
              >
                <img src={studentImg} alt="Student" className="role-modal-image" />
                <h3 className="role-modal-card-title">Student</h3>
                <p className="role-modal-card-desc">
                  Report issues, track tickets, and manage campus support requests
                </p>
              </div>

              <div
                className="role-modal-card"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('TECHNICIAN');
                }}
              >
                <img src={techImg} alt="Technician" className="role-modal-image" />
                <h3 className="role-modal-card-title">Technician</h3>
                <p className="role-modal-card-desc">
                  Manage assigned tickets, update status, and resolve campus issues
                </p>
              </div>

              <div
                className="role-modal-card"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('ADMIN');
                }}
              >
                <img src={adminImg} alt="Admin" className="role-modal-image" />
                <h3 className="role-modal-card-title">Admin</h3>
                <p className="role-modal-card-desc">
                  Oversee all operations, manage users, and configure system settings
                </p>
              </div>
            </div>

            <p className="role-modal-helper">
              Already have an account? <Link to="/login" className="role-modal-link">Sign in</Link>
            </p>
          </div>
        </div>
      )}

      {/* Signup Form Modal */}
      {showSignupForm && (
        <div className="role-modal-overlay" onClick={() => setShowSignupForm(false)}>
          <div className="role-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="role-modal-close" onClick={() => setShowSignupForm(false)}>×</button>

            <button className="signup-back-btn" onClick={handleBackToRoles}>← Back</button>

            <p className="role-modal-overline">
              {selectedRole === 'USER' ? 'STUDENT' : selectedRole} REGISTRATION
            </p>
            <h2 className="role-modal-title">Create Your Account</h2>
            <p className="role-modal-subtitle">Fill in your details to get started</p>

            <form onSubmit={handleSignupSubmit} className="signup-form">
              {error && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  border: '1px solid #fecaca'
                }}>
                  {error}
                </div>
              )}

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={signupData.username}
                onChange={handleSignupChange}
                className="signup-input"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={signupData.email}
                onChange={handleSignupChange}
                className="signup-input"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signupData.password}
                onChange={handleSignupChange}
                className="signup-input"
                required
                minLength="6"
              />

              <input
                type="tel"
                name="contact"
                placeholder="Contact Number"
                value={signupData.contact}
                onChange={handleSignupChange}
                className="signup-input"
                required
              />

              <button type="submit" className="signup-submit-btn">
                Create Account
              </button>
            </form>

            <p className="role-modal-helper">
              Already have an account? <Link to="/login" className="role-modal-link">Sign in</Link>
            </p>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default HomePage;
