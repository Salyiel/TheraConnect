import React, { useState } from "react";
import "../styles/SignUp.css";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    try {
      // Call the backend to register user and send OTP
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName, lastName, gender, dob, location, phone, email, password,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setOtpSent(true); // OTP sent successfully
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      // Call the backend to verify OTP
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (data.success) {
        // OTP verified, proceed to login page or dashboard
        window.location.href = "/dashboard";
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while verifying OTP. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Create an account</h1>

        {!otpSent ? (
          <form className="signup-form" onSubmit={handleSignUp}>
            <div className="name-inputs">
              <input
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="details-inputs">
              <input
                type="text"
                placeholder="Select your gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              />
              <input
                type="date"
                placeholder="Enter your date of birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <input
              type="text"
              placeholder="Choose your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <div className="contact-inputs">
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="signup-btn">Sign Up</button>
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
            <button type="submit" className="signup-btn">Verify OTP</button>
          </form>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <p className="login-text">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;