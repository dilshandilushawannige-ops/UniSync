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
          <a href="#services" className="nav-link">Services</a>
          <a href="#achievements" className="nav-link">Achievements</a>
          <Link to="/about" className="nav-link">About Us</Link>
          <a href="#contact" className="nav-link">Contact Us</a>
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
