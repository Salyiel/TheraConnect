// TherapistInfo.js
import React, { useState } from 'react';
import "../styles/TherapistInfo.css"; // Create a separate CSS file for styles

const TherapistInfo = () => {
  const [formData, setFormData] = useState({
    bio: '',
    specialties: '',
    experience: '',
    qualifications: '',
    availability: '',
    contactNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/therapist-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Use your authentication method
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful submission (e.g., redirect or show a success message)
        alert("Your information has been submitted for approval!");
      } else {
        // Handle error
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting therapist info:", error);
      alert("There was an error submitting your information. Please try again later.");
    }
  };

  return (
    <div className="therapist-info-container">
      <h1>Submit Your Information</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Bio:</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Specialties:</label>
          <input type="text" name="specialties" value={formData.specialties} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Experience (Years):</label>
          <input type="number" name="experience" value={formData.experience} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Qualifications:</label>
          <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Availability:</label>
          <input type="text" name="availability" value={formData.availability} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
        </div>
        <button cclassName="submit" type="submit">Submit for Approval</button>
      </form>
    </div>
  );
};

export default TherapistInfo;
