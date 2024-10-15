// src/pages/TherapistDashboard.js
import React from 'react';
import Header from '../components/Therapist/Header'; // Importing Header
import Sidebar from '../components/Therapist/Sidebar'; // Importing Sidebar
import '../styles/Therapist/TherapistDashboard.css'; // Importing the CSS file

const TherapistDashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        {/* Main content can go here, like notifications, appointments, etc. */}
        <h2>Hello, Ada</h2>
        {/* Additional dashboard content */}
      </div>
    </div>
  );
};

export default TherapistDashboard;
