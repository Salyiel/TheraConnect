import React, { useState } from "react";
import "../styles/Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [userType, setUserType] = useState("client");

  return (
    <div className="login-page">
      <header className="navbar">
        <div className="logo">
          <h1>Theraconnect</h1>
        </div>
        <nav className="nav-links">
          <ul>
            <li>About</li>
            <li>Services</li>
            <li>Careers</li>
            <li>Login</li>
            <button className="find-therapist-btn"><Link to="/find-therapists">Find a therapist</Link></button>
          </ul>
        </nav>
      </header>
      
      <div className="login-container">
        <div className="login-card">
          <div className="user-type-toggle">
            <button 
              className={userType === "client" ? "active" : ""} 
              onClick={() => setUserType("client")}
            >
              Client
            </button>
            <button 
              className={userType === "therapist" ? "active" : ""} 
              onClick={() => setUserType("therapist")}
            >
              Therapist
            </button>
          </div>

          <form className="login-form">
            <input type="email" placeholder="Email Address" />
            <input type="password" placeholder="Password" />
            <button type="submit" className="login-btn">Log in</button>
          </form>
          <p className="signup-text">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
