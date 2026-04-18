import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Brand & Socials Column */}
        <div className="footer-col footer-brand-col">
          <h2 className="footer-logo">UniSync™</h2>
          <p className="footer-desc">
            We provide a comprehensive ticket management solution for campus maintenance, 
            IT support, and facility issues. Streamline your campus operations with UniSync.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="4" x2="20" y2="20"></line>
                <line x1="20" y1="4" x2="4" y2="20"></line>
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="footer-col footer-links-col">
          <h3 className="footer-heading">Quick links</h3>
          <ul className="footer-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/create-ticket">Create Ticket</Link></li>
            <li><Link to="/my-tickets">My Tickets</Link></li>
            <li><Link to="/admin/tickets">Admin Panel</Link></li>
            <li><a href="#help-center">Help Center</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-col footer-contact-col">
          <h3 className="footer-heading">Contact</h3>
          <ul className="footer-list footer-contact-list">
            <li>Smart Campus</li>
            <li>Malabe, Sri Lanka</li>
            <li><a href="mailto:support@unisync.com">support@unisync.com</a></li>
            <li>+94 77 123 4567</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
