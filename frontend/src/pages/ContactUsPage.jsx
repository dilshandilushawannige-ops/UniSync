import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import sliit1Background from '../assets/sliit1.png';
import './ContactUsPage.css';

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page">
            <Navbar />

            {/* Hero Section */}
            <section className="contact-hero" style={{ backgroundImage: `url(${sliit1Background})` }}>
                <div className="contact-hero-content">
                    <div className="hero-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>UniSync</span>
                    </div>
                    <h1 className="contact-hero-title">
                        Streamline Your Campus<br />Support with UniSync
                    </h1>
                    <div className="hero-actions">
                        <Link to="/create-ticket" className="btn-hero-primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            Report an Issue
                        </Link>
                        <Link to="/my-tickets" className="btn-hero-secondary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                            View My Tickets
                        </Link>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="contact-info-section">
                <div className="contact-info-grid">
                    <div className="contact-info-card">
                        <div className="contact-icon blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <h3>Visit Us</h3>
                        <p>SLIIT Campus, Malabe</p>
                        <p>New Kandy Rd, Malabe</p>
                        <p>Sri Lanka</p>
                    </div>

                    <div className="contact-info-card">
                        <div className="contact-icon green">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </div>
                        <h3>Call Us</h3>
                        <p>Connect with IT Support</p>
                        <p className="contact-link">+94 11 413 3000</p>
                    </div>

                    <div className="contact-info-card">
                        <div className="contact-icon orange">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <h3>Email Us</h3>
                        <p className="contact-link">info@unisync.edu</p>
                        <p className="contact-link">support@unisync.edu</p>
                    </div>

                    <div className="contact-info-card">
                        <div className="contact-icon blue-light">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <h3>Working Hours</h3>
                        <p>Mon-Fri: 8:00 AM - 5:00 PM</p>
                        <p>Sat-Sun: 9:00 AM - 1:00 PM</p>
                    </div>
                </div>
            </section>

            {/* Message Form & Map Section */}
            <section className="contact-form-section">
                <div className="contact-form-container">
                    {/* Send Message Form */}
                    <div className="message-form-wrapper">
                        <h2>Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>YOUR NAME</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>EMAIL ADDRESS</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="info@example.info"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>SUBJECT</label>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="What can we help you with?"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>YOUR MESSAGE</label>
                                <textarea
                                    name="message"
                                    placeholder="How can we help you?"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-send-message">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Location Map */}
                    <div className="location-wrapper">
                        <h2>Location</h2>
                        <div className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798994114287!2d79.97036931477296!3d6.914682995007204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae256db1a6771c5%3A0x2c63e344ab9a7536!2sSri%20Lanka%20Institute%20of%20Information%20Technology!5e0!3m2!1sen!2slk!4v1234567890123!5m2!1sen!2slk"
                                width="100%"
                                height="350"
                                style={{ border: 0, borderRadius: '12px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="SLIIT Location"
                            ></iframe>
                        </div>

                        <div className="quick-help">
                            <h3>Quick Help</h3>
                            <p>Need to answer right away? Check our documentation or contact our support team.</p>
                            <a href="#" className="link-help-center">Visit Help Center →</a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ContactUsPage;
