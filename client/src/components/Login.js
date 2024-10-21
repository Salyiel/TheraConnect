import React, { useState } from "react";
import "../styles/Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [userType, setUserType] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call backend API to authenticate user and send OTP
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpSent(true);  // OTP sent successfully
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      // Call backend API to verify OTP
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (data.success) {
        // OTP verified, proceed to dashboard
        window.location.href = "/dashboard";
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while verifying OTP. Please try again.");
    }
  };

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

          {!otpSent ? (
            <form className="login-form" onSubmit={handleLogin}>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="login-btn">Log in</button>
            </form>
          ) : (
            <form className="otp-form" onSubmit={handleVerifyOtp}>
              <input 
                type="text" 
                placeholder="Enter OTP" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" className="login-btn">Verify OTP</button>
            </form>
          )}

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <p className="signup-text">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;