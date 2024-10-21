import React from 'react';
import '../../styles/Therapist/Header.css'; // Importing Header CSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Header = () => {
    const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle logout
  const handleLogout = () => {
    // Clear user session or token
    localStorage.removeItem("userToken"); // Example: Remove token from localStorage
    // Navigate to login page
    navigate('/login'); // Redirect to login page
  };

  // Function to handle notifications
  const handleNotifications = () => {
    console.log('Notifications clicked');
    // Implement your notifications logic here
  };

  return (
    <div className="header">
      <div className="theraconnect">
        <div className="theraconnect1">
          <span className="theraconnectTxt">
            <span>Thera</span>
            <span className="connect">Connect</span>
          </span>
        </div>
      </div>
      <div className="notifications" onClick={handleNotifications}>
        <div className="notifications1">Notifications</div>
      </div>
      <div className="logout" onClick={handleLogout}>
        <span className="logout1">Logout</span>
      </div>
    </div>
  );
};

export default Header;
