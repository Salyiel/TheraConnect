import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [oldEmail, setOldEmail] = useState(''); // State for old email
  const [otp, setOtp] = useState(''); // State for OTP
  const [showChangePassword, setShowChangePassword] = useState(false); // State for dropdown visibility
  const [showChangeEmail, setShowChangeEmail] = useState(false); // State for dropdown visibility
  const [changeEmailPassword, setChangeEmailPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false); // State to track OTP sent status
  const [message, setMessage] = useState(''); // State for feedback messages
  const backend = process.env.REACT_APP_FLASK_API_URL;

  const fetchUserInfo = useCallback(async () => {
    setLoading(true);
    setMessage('Loading user info...');
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${backend}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`  // Include the token in the headers
        }
      });

      const { user, profileCompletion } = response.data;
      setUserInfo(user);
      setProfileCompletion(profileCompletion);
      setMessage('User info loaded successfully!');
    } catch (error) {
      console.error("Error fetching user info", error);
      setMessage("Error loading user info. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const handleEditProfile = () => {
    setEditMode(true);
    setNewName(userInfo.name);
    setNewLocation(userInfo.location);
    setNewPhone(userInfo.phone);
  };

  const handleSaveProfile = async () => {
    setMessage('Saving profile...');
    try {
      const token = sessionStorage.getItem('token');
      await axios.put(`${backend}/api/profile`, {
        name: newName,
        location: newLocation,
        phone: newPhone
      }, {
        headers: {
          'Authorization': `Bearer ${token}`  // Include the token in the headers
        }
      });

      await fetchUserInfo();
      setEditMode(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error("Error saving profile", error);
      setMessage("Error saving profile. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== retypePassword) {
      setMessage("New passwords do not match.");
      return;
    }

    setMessage('Changing password...');
    try {
      const token = sessionStorage.getItem('token');
      await axios.put(`${backend}/api/change-password`, {
        currentPassword: currentPassword,
        newPassword: newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`  // Include the token in the headers
        }
      });

      setCurrentPassword('');
      setNewPassword('');
      setRetypePassword('');
      setShowChangePassword(false); // Close dropdown after saving
      setMessage("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password", error);
      setMessage("Error changing password. Please check your current password and try again.");
    }
  };

  const handleChangeEmail = async () => {
    setMessage('Sending verification code for email change...');
    try {
      const oldEmail = sessionStorage.getItem('userEmail');  // Get old email from session storage
      
      await axios.put(`${backend}/api/change-email`, {
        oldEmail,
        newEmail,
        currentPassword: changeEmailPassword,
      });
  
      setIsOtpSent(true); // Set the flag to indicate verification code was sent
      setShowChangeEmail(false); // Close dropdown after sending verification code
      setMessage("Verification code sent! Please check your email.");
      
    } catch (error) {
      console.error("Error sending verification code for email change", error);
      setMessage("Error sending verification code. Please try again.");
    }
  };
  
  const handleVerifyEmailChange = async () => {
    setMessage('Verifying email change...');
    try {
      await axios.post(`${backend}/api/verify-email-change`, {
        oldEmail, 
        newEmail,
        verification_code: otp,  // Change 'otp' to 'verification_code'
      });
  
      alert("Email changed successfully!");
      setNewEmail('');
      setOldEmail('');// Clear old email field
      setChangeEmailPassword('') 
      setOtp(''); // Clear verification code field
      setIsOtpSent(false); // Reset verification code sent status
      setMessage("Email changed successfully!");
    } catch (error) {
      console.error("Error verifying verification code", error);
      setMessage("Error verifying verification code. Please check your OTP and try again.");
    }
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>

      <div className="profile-info">
        <div className="profile-item">
          <strong>Name:</strong> <span>{userInfo.name}</span>
        </div>
        <div className="profile-item">
          <strong>Email:</strong> <span>{userInfo.email}</span>
        </div>
        <div className="profile-item">
          <strong>Gender:</strong> <span>{userInfo.gender || 'Not specified'}</span>
        </div>
        <div className="profile-item">
          <strong>Location:</strong> <span>{userInfo.location || 'Not specified'}</span>
        </div>
        <div className="profile-item">
          <strong>Date of Birth:</strong> <span>{userInfo.dob || 'Not specified'}</span>
        </div>
        <div className="profile-item">
          <strong>Phone:</strong> <span>{userInfo.phone || 'Not specified'}</span>
        </div>
      </div>

      <div className="profile-completion">
        <h3>Profile Completion</h3>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <p>{profileCompletion}% completed</p>
      </div>

      {editMode ? (
        <div className="edit-profile">
          <h3>Edit Profile</h3>
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
          <button onClick={handleSaveProfile}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={handleEditProfile}>Edit Profile</button>
      )}

      <div className="change-password">
        <h3 onClick={() => setShowChangePassword(!showChangePassword)} style={{ cursor: 'pointer' }}>
          Change Password
        </h3>
        {showChangePassword && (
          <div>
            <input
              type="password"
              placeholder="Enter Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Re-enter New Password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Change Password</button>
          </div>
        )}
      </div>

      <div className="change-email">
        <h3 onClick={() => setShowChangeEmail(!showChangeEmail)} style={{ cursor: 'pointer' }}>
          Change Email
        </h3>
        {showChangeEmail && !isOtpSent && (
          <div>
            <input
              type="text"
              placeholder="Enter Old Email"
              value={oldEmail}
              onChange={(e) => setOldEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              type="password" // Changed to type="password"
              placeholder="Verify Password"
              value={changeEmailPassword} // Use the separate state
              onChange={(e) => setChangeEmailPassword(e.target.value)}
            />
            <button onClick={handleChangeEmail}>Send Verification Code</button>
          </div>
        )}

        {isOtpSent && (
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyEmailChange}>Verify Email Change</button>
          </div>
        )}
      </div>

      {message && <div className="feedback-message">{message}</div>} {/* Display feedback messages */}
    </div>
  );
};

export default Profile;
