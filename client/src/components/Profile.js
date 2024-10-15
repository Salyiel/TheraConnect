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
  const [showChangePassword, setShowChangePassword] = useState(false); // State for dropdown visibility
  const [showChangeEmail, setShowChangeEmail] = useState(false); // State for dropdown visibility
  const backend = process.env.REACT_APP_FLASK_API_URL;

  const fetchUserInfo = useCallback(async () => {
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
    } catch (error) {
      console.error("Error fetching user info", error);
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
    } catch (error) {
      console.error("Error saving profile", error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== retypePassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      await axios.put(`${backend}/api/change-password`, {
        currentPassword,
        newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`  // Include the token in the headers
        }
      });

      setCurrentPassword('');
      setNewPassword('');
      setRetypePassword('');
      setShowChangePassword(false); // Close dropdown after saving
    } catch (error) {
      console.error("Error changing password", error);
    }
  };

  const handleChangeEmail = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.put(`${backend}/api/change-email`, {
        oldEmail,
        newEmail
      }, {
        headers: {
          'Authorization': `Bearer ${token}`  // Include the token in the headers
        }
      });

      setNewEmail('');
      setOldEmail(''); // Clear old email field
      setShowChangeEmail(false); // Close dropdown after saving
    } catch (error) {
      console.error("Error changing email", error);
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
        {showChangeEmail && (
          <div>
            <input
              type="text"
              placeholder="Enter Old Email"
              value={oldEmail}
              onChange={(e) => setOldEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button onClick={handleChangeEmail}>Change Email</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
