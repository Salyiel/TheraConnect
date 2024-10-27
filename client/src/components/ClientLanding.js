import React from "react";
import { Link } from "react-router-dom";
import "../styles/ClientLanding.css";
import firstImage from "../images/istockphoto-1435001168-612x612.jpg";

const ClientLanding = () => {
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
            <li><Link to="/signup?role=client">Sign Up</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/adminpage"> AdminPage</Link></li>
          </ul>
        </nav>
      </header>

      <div className="content">
        <img src={firstImage} alt="Therapist" />
        <h1 className="head">Connect with a Therapist Today!</h1>
        <p className="message">
          Your mental health is a priority. Find the right therapist who suits your needs.
          Join our community of individuals who are taking the first step towards better mental health.
        </p>
        <ul className="button">
            <li><Link to='/login' className="cta-button">Log In</Link></li>
            <li><Link to="/signup?role=client" className="cta-button">Sign Up Now</Link></li>
        </ul>
      </div>

      <footer className="footer">
        <p>Are you a therapist? Switch to <Link to="/therapist-landing" className="therapist-link">Therapist</Link> </p>
      </footer>
    </div>
  );
};

export default ClientLanding;
