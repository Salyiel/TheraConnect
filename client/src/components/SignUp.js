import React from "react";
import "../styles/SignUp.css";

const SignUp = () => {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Create an account</h1>
        <form className="signup-form">
          <div className="name-inputs">
            <input type="text" placeholder="Enter your first name" />
            <input type="text" placeholder="Enter your last name" />
          </div>
          <div className="details-inputs">
            <input type="text" placeholder="Select your gender" />
            <input type="date" placeholder="Enter your date of birth" />
          </div>
          <input type="text" placeholder="Choose your location" />
          <div className="contact-inputs">
            <input type="text" placeholder="Enter phone number" />
            <input type="email" placeholder="Enter your email" />
          </div>
          <input type="password" placeholder="Enter your password" />
          <input type="password" placeholder="Re-enter your password" />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <p className="login-text">
          Already have an account? <a href=".">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
