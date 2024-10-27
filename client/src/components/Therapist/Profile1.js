import React, { useState } from 'react';
import '../../styles/Therapist/Profile.css'; // Make sure this file exists for styling
import Sidebar from './Sidebar';

const Profile = () => {
  // Initial profile state
  const [profile, setProfile] = useState({
    name: 'Dr. Robert Brown',
    createdAt: '2022-01-15',
    email: 'robert.brown@example.com',
    phone: '553334444',
    licenseNumber: 'MC98765',
    specialization: 'Marriage Counseling',
    photo: '/images/profile-placeholder.png', // default profile photo
  });

  // State to manage edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState(null); // Store new profile photo

  // Handle input change
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile picture change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); // Display the new photo
      setProfile({ ...profile, photo: file.name }); // Store the file name in the profile (for backend)
    }
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle form submission (save)
  const handleSave = () => {
    setIsEditing(false);

    // Backend team to handle the actual API call for saving profile updates.
    // eg:
    // fetch('/api/profile/update', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(profile),
    // }).then((response) => {
    //   // Handle the response from the server
    // });

    console.log('Profile saved', profile); // For now, just log the updated profile
  };

  return (
    <div className="profile-section">
      <div className="profile-container">
        {/* Profile Picture */}
        <div className="profile-photo">
          <img src={photo || profile.photo} alt="Profile" className="photo-frame" />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="photo-upload"
            />
          )}
        </div>

        {/* Profile Information */}
        <div className="profile-info">
          {/* Name */}
          <div className="input-group">
            <label>Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.name}</p>
            )}
          </div>

          {/* Created At */}
          <div className="input-group">
            <label>Created At</label>
            <p>{profile.createdAt}</p>
          </div>

          {/* Contact Information */}
          <h3>Contact Information</h3>

          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="input-group">
            <label>Phone</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.phone}</p>
            )}
          </div>

          {/* Professional Details */}
          <h3>Professional Details</h3>

          {/* License Number */}
          <div className="input-group">
            <label>License Number</label>
            {isEditing ? (
              <input
                type="text"
                name="licenseNumber"
                value={profile.licenseNumber}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.licenseNumber}</p>
            )}
          </div>

          {/* Specialization */}
          <div className="input-group">
            <label>Specialization</label>
            {isEditing ? (
              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.specialization}</p>
            )}
          </div>

          {/* Edit/Save Button */}
          <div className="profile-actions">
            {isEditing ? (
              <button onClick={handleSave} className="save-button">
                Save
              </button>
            ) : (
              <button onClick={handleEditToggle} className="edit-button">
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
