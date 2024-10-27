import React, { useState } from 'react';
import "../styles/TherapistInfo.css"; // Ensure the CSS file exists and is styled accordingly

const TherapistInfo = () => {
  const [formData, setFormData] = useState({
    bio: '',
    licenseno: '',
    specialties: '',
    experience: '',
    qualifications: '',
    availability: '',
    contactNumber: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

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
        alert("Your information has been submitted for approval!");
        setFormData({
          bio: '',
          licenseno: '',
          specialties: '',
          experience: '',
          qualifications: '',
          availability: '',
          contactNumber: '',
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting therapist info:", error);
      alert("There was an error submitting your information. Please try again later.");
    } finally {
      setLoading(false); // Set loading state to false after submission is complete
    }
  };

  return (
    <div className="therapist-info-container">
      <h1>Submit Your Information</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Bio:</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
            placeholder="Tell us about yourself"
          />
        </div>
        <div className="form-group">
          <label>License Number:</label>
          <input
            type="text"
            name="licenseno"
            value={formData.licenseno}
            onChange={handleChange}
            required
            placeholder="Your License Number"
          />
        </div>
        <div className="form-group">
          <label>Specialties:</label>
          <input
            type="text"
            name="specialties"
            value={formData.specialties}
            onChange={handleChange}
            required
            placeholder="Your specialties"
          />
        </div>
        <div className="form-group">
          <label>Experience (Years):</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            placeholder="Years of experience"
          />
        </div>
        <div className="form-group">
          <label>Qualifications:</label>
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            required
            placeholder="Your qualifications"
          />
        </div>
        <div className="form-group">
          <label>Availability:</label>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            required
            placeholder="Your availability"
          />
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            placeholder="Your contact number"
          />
        </div>
        <button className="submit" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </form>
    </div>
  );
};

export default TherapistInfo;