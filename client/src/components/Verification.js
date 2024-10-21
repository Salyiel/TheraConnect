import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Verification.css';

const Verification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }

    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1);
      } else {
        setIsResendEnabled(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validate verification code length
    if (verificationCode.length < 6) {
      setError('Please enter a valid verification code.');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email, 
          verification_code: verificationCode 
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error && data.error.includes("No pending registration")) {
          setError("No pending registration for this email! Please register first.");
        } else {
          setError(data.error || 'Verification failed. Please try again.');
        }
      } else {
        const data = await response.json();
        setSuccessMessage(data.message);

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccessMessage('');
    
    setLoading(true); // Start loading

    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/resend_verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to resend code. Please try again.');
      } else {
        setSuccessMessage('Verification code resent successfully.');
        setCountdown(60); // Reset countdown
        setIsResendEnabled(false); // Disable resend button
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="verification-page" role="alert">
      <div className="verification-container">
        <h1>Email Verification</h1>
        <form className="verification-form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            required
            readOnly
            aria-label="Email address"
          />
          <input
            type="text"
            placeholder="Enter the verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            aria-label="Verification code"
          />
          {error && <p className="error" role="alert">{error}</p>}
          {successMessage && <p className="success" role="alert">{successMessage}</p>}
          <button type="submit" className="verification-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button 
            type="button" 
            className="resend-btn" 
            onClick={handleResendCode} 
            disabled={!isResendEnabled || loading}
          >
            {isResendEnabled ? 'Resend Code' : `Resend Code in ${countdown}s`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;
