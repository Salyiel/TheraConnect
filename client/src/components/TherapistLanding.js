import React from "react";
import { Link } from "react-router-dom";
import "../styles/ClientLanding.css";
import firstImage from "../images/istockphoto-1435001168-612x612.jpg";

const TherapistLanding = () => {
  return (
    <div className="landing-page client-landing">
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
        <img src={firstImage} alt="Therapist" />
        <h1 className="head">Connect with a Client Today!</h1>
        <p className="message">
            Help others on their journey to mental well-being.
            Sign up today and connect with clients who need your expertise.
        </p>
        <ul className="button">
            <li><Link to='/login' className="cta-button">Log In</Link></li>
            <li><Link to="/signup?role=therapist" className="cta-button">Sign Up Now</Link></li>
        </ul>
      </div>

      <footer className="footer">
        <p>Are you looking foa a therapist? Switch to <Link to="/client-landing" className="therapist-link">Client</Link> </p>
      </footer>
    </div>
  );
};

export default TherapistLanding;
