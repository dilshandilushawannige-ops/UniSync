import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar-landing">
      <div className="navbar-container">
        <Link to="/" className="brand-text">UniSync™</Link>
        
        <div className="nav-center">
          <Link to="/" className="nav-link">Home</Link>
          <a href="#how-it-works" className="nav-link">Features</a>
          <a href="#help-center" className="nav-link">Help</a>
          <a href="#faq" className="nav-link">FAQ</a>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/create-ticket" className="btn-get-started">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
