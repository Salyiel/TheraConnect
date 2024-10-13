import React from "react";
import { Link } from "react-router-dom";
import "../styles/TherapistLanding.css";

const TherapistLanding = () => {
  return (
    <div className="landing-page therapist-landing">
      <header className="navbar">
        <div className="logo">
          <h1>Theraconnect</h1>
        </div>
        <nav className="nav-links">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </ul>
        </nav>
      </header>

      <div className="content">
        <h2>Join Our Community of Therapists!</h2>
        <p>Help others on their journey to mental well-being. Sign up today and connect with clients who need your expertise.</p>
        <Link to="/signup" className="cta-button">Sign Up Now</Link>
      </div>
      <div className="floating-image">
        <img src="path/to/therapist-image.png" alt="Therapist illustration" />
      </div>
      <footer className="footer">
        <p>Looking for a client? <Link to="/client-landing">Switch to Client</Link></p>
      </footer>
    </div>
  );
};

export default TherapistLanding;
