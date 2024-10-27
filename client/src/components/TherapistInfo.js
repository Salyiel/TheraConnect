import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/TherapistInfo.css";

const TherapistInfo = () => {
  const [formData, setFormData] = useState({
    bio: '',
    licenseno: '',
    specialties: '',
    experienceYears: '',
    qualifications: '',
    availability: '',
    contactNumber: '',
    consultationFee: '',
    languages: [],
    location: '',
    licenseNumber: '',
    image: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value} = e.target;

    if (name === 'languages') {
      setFormData({ ...formData, [name]: Array.from(e.target.selectedOptions, option => option.value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    for (let key in formData) {
      formPayload.append(key, formData[key]);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/therapist-info`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: formPayload,
      });

      if (response.ok) {
        alert("Your information has been submitted for approval!");
        setFormData({
          bio: '',
          specialties: '',
          experienceYears: '',
          qualifications: '',
          availability: '',
          contactNumber: '',
          consultationFee: '',
          languages: [],
          location: '',
          licenseNumber: '',
          image: '',
        });
        navigate("/waiting");
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
      <h1>Submit Your Therapist Profile</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Profile Image Url:</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>License Number:</label>
          <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Qualifications:</label>
          <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} required />
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
          <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Consultation Fee ($):</label>
          <input type="number" step="0.01" name="consultationFee" value={formData.consultationFee} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Bio:</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Availability:</label>
          <select name="availability" value={formData.availability} onChange={handleChange} required>
            <option value="">Select Availability</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="On-demand">On-demand</option>
          </select>
        </div>
        <div className="form-group">
          <label>Languages:</label>
          <select name="languages" onChange={handleChange} required>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Mandarin">Mandarin</option>
            <option value="Arabic">Arabic</option>
          </select>
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <button className="submit" type="submit">Submit for Approval</button>
      </form>
    </div>
  );
};

export default TherapistInfo;