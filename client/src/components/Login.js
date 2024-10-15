import React, { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  const clearMessages = () => {
    setError('');
    setOtpMessage('');
  };

  const handleRequestOtp = async () => {
    clearMessages();
    setLoading(true); // Set loading to true
    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Capture the response data

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        return;
      }

      setOtpRequested(true);
      setOtpMessage('OTP sent to your email! Please check your inbox.');
      if (data.role) {
        setRole(data.role);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true); // Set loading to true

    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'OTP verification failed. Please try again.');
        return;
      }

      // Store the token in sessionStorage
      sessionStorage.setItem('token', data.token);

      console.log('token: ', data.token )

      // Navigate based on user role
      navigate(`/${role}`);
    } catch (err) {
      setError('An unexpected error occurred during OTP verification.');
    } finally {
      setLoading(false); // Set loading to false
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
            <button className="find-therapist-btn">
              <Link to="/find-therapists">Find a therapist</Link>
            </button>
          </ul>
        </nav>
      </header>

      <div className="login-container">
        <div className="login-card">
          <form className="login-form" onSubmit={otpRequested ? handleVerifyOtp : handleRequestOtp}>
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

            <div className="otp-section">
              <input
                type="text"
                placeholder="Enter OTP"
                className="otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={!otpRequested}
              />
              <button
                type="button"
                className="request-otp-btn"
                onClick={handleRequestOtp}
                disabled={otpRequested || loading} // Disable if OTP requested or loading
              >
                {loading ? 'Requesting...' : 'Request OTP'}
              </button>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Processing...' : (otpRequested ? 'Verify OTP' : 'Log in')}
            </button>

            {error && <p className="error">{error}</p>}
            {otpMessage && <p className="otp-message">{otpMessage}</p>}
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
