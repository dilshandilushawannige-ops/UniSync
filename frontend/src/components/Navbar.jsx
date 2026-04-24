import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onGetStartedClick }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (onGetStartedClick) {
      onGetStartedClick();
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar-landing">
      <div className="navbar-container">
        <Link to="/" className="brand-text">UniSync™</Link>

        <div className="nav-center">
          <Link to="/" className="nav-link">Home</Link>
          <a href="#services" className="nav-link">Services</a>
          <a href="#achievements" className="nav-link">Achievements</a>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn-login">Login</Link>
          <button onClick={handleGetStarted} className="btn-get-started">Get Started</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
