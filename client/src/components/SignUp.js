import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

// Simple Eye icon component
const EyeIcon = ({ isVisible, onClick }) => (
  <span onClick={onClick} style={{ cursor: 'pointer' }}>
    {isVisible ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12s2-4.5 9-4.5S21 12 21 12s-2 4.5-9 4.5S3 12 3 12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75c-1.5 0-2.25.75-2.25 2.25S10.5 14.25 12 14.25 14.25 13.5 14.25 12 13.5 9.75 12 9.75z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12s2-4.5 9-4.5S21 12 21 12s-2 4.5-9 4.5S3 12 3 12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c-5.25 0-9.3 3.75-11.5 8.25C2.7 17.25 6.75 21 12 21c5.25 0 9.3-3.75 11.5-8.25C21.3 8.25 17.25 4.5 12 4.5z" />
      </svg>
    )}
  </span>
);

const SignUp = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("client"); // Default to "client"
  const backend = process.env.REACT_APP_FLASK_API_URL;
  const navigate = useNavigate(); // Initialize navigate

  // Use useLocation to get the query params from the URL
  const locationData = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(locationData.search);
    const userRole = params.get("role");
    if (userRole) {
      setRole(userRole); // Set the role based on query param
    }
  }, [locationData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backend}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirm_password: confirmPassword,
          role,
          gender,
          location,
          phone,
          dob,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "An error occurred during registration");
      } else {
        const data = await response.json();
        setSuccessMessage(data.message);
        
        // Store email in local storage
        localStorage.setItem('email', email);
        
        // Redirect to verification page after successful registration
        navigate('/verify'); // Change this to the verification route
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Create an account</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="name-inputs">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="details-inputs">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="" disabled>Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <select
            className="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="" disabled>Select your location</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
          </select>
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
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <EyeIcon isVisible={showPassword} onClick={() => setShowPassword(!showPassword)} />
          </div>
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <EyeIcon isVisible={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
          </div>
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <p className="login-text">
          Already have an account? <a href="/">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
