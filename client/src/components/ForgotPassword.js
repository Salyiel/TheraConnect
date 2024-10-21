// ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/ForgotPassword.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [token, setToken] = useState(''); // State to hold the JWT token
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to request OTP.');
        return;
      }

      setOtpRequested(true);
      setMessage('OTP sent to your email! Please check your inbox.');
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/verify-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'OTP verification failed.');
        return;
      }

      // Set the token after successful OTP verification
      setToken(data.token); // Assuming the token is returned in the response
      setOtpVerified(true);
      setMessage('OTP verified! You can now set a new password.');
    } catch (err) {
      setError('An unexpected error occurred during OTP verification.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== retypePassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token here
        },
        
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to change password.');
        return;
      }

      setMessage('Password changed successfully!');
      navigate('/login');
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <form className="forgot-password-form" onSubmit={otpRequested ? (otpVerified ? handleChangePassword : handleVerifyOtp) : handleRequestOtp}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {otpRequested && !otpVerified && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" className="change-password-btn">Verify OTP</button>
            </>
          )}

          {otpVerified && (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Repeat New Password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                required
              />
              <button type="submit" className="change-password-btn">Change Password</button>
            </>
          )}

          {!otpRequested && (
            <button type="submit" className="request-otp-btn">Request OTP</button>
          )}

          {error && <p className="error">{error}</p>}
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
