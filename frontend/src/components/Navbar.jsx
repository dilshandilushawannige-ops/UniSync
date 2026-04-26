import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import bellIcon from '../assets/bell.png';

const Navbar = ({ onGetStartedClick }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (onGetStartedClick) {
      onGetStartedClick();
    } else {
      navigate('/login');
    }
  };

  const handleNotificationClick = () => {
    // Check if user is logged in by checking localStorage
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token || !userRole) {
      // User not logged in, redirect to login
      alert('Please login to view notifications');
      navigate('/login');
      return;
    }

    // Redirect based on user role
    switch (userRole) {
      case 'USER':
      case 'STUDENT':
        navigate('/my-notifications');
        break;
      case 'ADMIN':
        navigate('/admin/notifications');
        break;
      case 'TECHNICIAN':
        navigate('/technician/notifications');
        break;
      default:
        navigate('/login');
    }
  };

  return (
    <nav className="navbar-landing">
      <div className="navbar-container">
        <Link to="/" className="brand-text">UniSync™</Link>

        <div className="nav-center">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <a href="#achievements" className="nav-link">Achievements</a>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn-login">Login</Link>

          <button onClick={handleGetStarted} className="btn-get-started">Get Started</button>
          <button onClick={handleNotificationClick} className="btn-notification" title="Notifications">
            <img src={bellIcon} alt="Notifications" className="bell-icon-img" />
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
