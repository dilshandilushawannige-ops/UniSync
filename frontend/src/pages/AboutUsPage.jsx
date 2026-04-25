import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import sliitImage from '../assets/sliit.png';
import person1 from '../assets/person1.png';
import person2 from '../assets/person2.png';
import person3 from '../assets/person3.png';
import './AboutUsPage.css';

const AboutUsPage = () => {
    return (
        <div className="about-page">
            <Navbar />

            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <div className="about-hero-text">
                        <span className="about-subtitle">WELCOME TO UNISYNC</span>
                        <h1 className="about-title">
                            About <span className="highlight">UniSync</span>
                        </h1>
                        <p className="about-description">
                            We are bridging the gap between students and educational institutions through
                            innovative digital solutions. Our team empowers universities to be
                            more efficient, modern, and connected, creating a seamless experience
                            for students.
                        </p>
                        <Link to="/create-ticket" className="btn-learn-more">
                            <span>See How We Do It</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                    <div className="about-hero-image">
                        <img
                            src={sliitImage}
                            alt="SLIIT Campus"
                        />
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="mission-vision">
                <div className="mission-vision-container">
                    <div className="mission-card">
                        <div className="icon-wrapper blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h3>Our Mission</h3>
                        <p>
                            Our mission is simple: we aim to provide a centralized
                            campus management platform for universities, enabling students
                            to access essential services, submit tickets, book resources,
                            and receive real-time updates. We believe in the power of
                            technology to transform the student experience for students
                            worldwide.
                        </p>
                    </div>

                    <div className="mission-card">
                        <div className="icon-wrapper green">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                        <h3>Our Vision</h3>
                        <p>
                            We envision a future where every university and educational
                            institution has access to a world-class campus management
                            system. UniSync aims to become a trusted partner for universities
                            worldwide, enabling seamless interactions, data-driven insights,
                            and improved student satisfaction through our innovative platform
                            and tools.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="core-values">
                <div className="core-values-header">
                    <h2 className="section-title">Core Values</h2>
                    <p className="section-subtitle">
                        The principles that guide everything we do at UniSync
                    </p>
                </div>
                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-icon blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <h4>Innovation</h4>
                        <p>
                            We embrace change and continuously seek new ways to
                            improve our platform and deliver cutting-edge solutions.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon green">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h4>Integrity</h4>
                        <p>
                            We operate with honesty and transparency, building trust
                            with our users through ethical practices.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon orange">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <h4>Community</h4>
                        <p>
                            We foster a collaborative environment where students,
                            faculty, and staff can connect and thrive together.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon blue-light">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                        <h4>Excellence</h4>
                        <p>
                            We strive for the highest standards in everything we do,
                            delivering quality and value to our users.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Founders */}
            <section className="founders">
                <div className="founders-header">
                    <div>
                        <h2 className="section-title">The Founders</h2>
                        <p className="founders-subtitle">
                            Our passionate founders who brought together expertise in technology, education, and
                            user experience.
                        </p>
                    </div>
                    <button className="btn-view-team">
                        <span>View Our Team</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="founders-grid">
                    <div className="founder-card">
                        <div className="founder-image">
                            <img src={person1} alt="Dr. Helena Vance" />
                        </div>
                        <h4>Dr. Helena Vance</h4>
                        <p className="founder-role">Chief Executive Officer</p>
                    </div>

                    <div className="founder-card">
                        <div className="founder-image">
                            <img src={person2} alt="Julian Thorne" />
                        </div>
                        <h4>Julian Thorne</h4>
                        <p className="founder-role">Chief Technology Officer</p>
                    </div>

                    <div className="founder-card">
                        <div className="founder-image">
                            <img src={person3} alt="Marcus Sterling" />
                        </div>
                        <h4>Marcus Sterling</h4>
                        <p className="founder-role">Chief Operating Officer</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutUsPage;
