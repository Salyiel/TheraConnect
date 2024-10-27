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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearMessages = () => {
    setError('');
    setOtpMessage('');
  };

  const handleRequestOtp = async () => {
    clearMessages();
    setLoading(true);
    try {
      // Check if the user is an admin
      const identifier = email === 'admin' || email === 'admin3' ? email : null;

      // Prepare the request URL based on whether it's an admin or a normal user
      const requestUrl = identifier
        ? `${process.env.REACT_APP_FLASK_API_URL}/api/request-admin-otp`
        : `${process.env.REACT_APP_FLASK_API_URL}/api/login`;

      // Prepare the request body based on whether it's an admin or a normal user
      const body = identifier
        ? { identifier } // For admin, just pass the email field
        : { email, password }; // For normal users, include the password

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        return;
      }

      setOtpRequested(true);
      setOtpMessage('OTP sent to your email! Please check your inbox.');
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      // Check if the user is an admin
    const identifier = email === 'admin' || email === 'admin a' || email === 'admin t' || email === 'admin b' || email === 'admin s' ? email : null;

      const requestUrl = identifier
        ? `${process.env.REACT_APP_FLASK_API_URL}/api/verify-admin-otp`
        : `${process.env.REACT_APP_FLASK_API_URL}/api/verify-otp`;

      const body = identifier
        ? { identifier, temporary_password: password, otp } // For admin
        : { email, otp }; // For normal users

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'OTP verification failed. Please try again.');
        return;
      }

      // Log the user data
      console.log('user data:', data.user);

      if (data.token && data.user) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userId', data.user.id);
        sessionStorage.setItem('userName', data.user.name);
        sessionStorage.setItem('userEmail', data.user.email);
        sessionStorage.setItem('therapist', data.user.therapist);
        sessionStorage.setItem('role', data.user.role);

        // Check if user is a therapist and their verification status
        if (data.user.role === 'therapist') {
          if (data.user.isVerified === 'yes') {
            navigate('/therapist');
          } else if (data.user.isVerified === 'waiting') {
            navigate('/waiting');
          } else if (data.user.isVerified === 'banned') {
            navigate('/banned');
          } else if (data.user.isVerified === 'terminated') {
            sessionStorage.removeItem('token');
            navigate('/');
          } else {
            navigate('/therapist-info');
          }
        } else if (data.role === 'admin'){
          navigate('/admin')
        }else {
          if (data.user.isVerified === 'banned') {
            navigate('/banned')
          } else if (data.user.isVerified === 'terminated') {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('therapist');
            sessionStorage.removeItem('role');
            navigate('/');
          } else{
            navigate(`/${data.user.role}`);
          }
          
        }
      } else {
        setError('Invalid response from server. Missing user details.');
      }
    } catch (err) {
      setError('An unexpected error occurred during OTP verification.');
    } finally {
      setLoading(false);
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
              type="text" // Change to text to allow 'admin' or 'admin3'
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
                disabled={otpRequested || loading}
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

          <p className="forgot-password-text">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>

          <p className="signup-text">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
