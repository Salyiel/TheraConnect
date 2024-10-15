// src/components/Therapist/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Therapist/Sidebar.css'; // Importing Sidebar CSS

const Sidebar = () => {
  const handleDashboardClick = () => {
    window.location.reload(); // Refresh the page
  };
  
  return (
    <div className="sidebarParent">
      <div className="dashboardWrapper" onClick={handleDashboardClick}>
        <b className="dashboard">Dashboard</b>
      </div>
    <Link to="/profile" className="sidebarLink profileParent">
        <b className="profile">Profile</b>
    </Link>
    <Link to="/appointments" className="sidebarLink appointmentsParent">
        <b className="appointments">Appointments</b>
    </Link>
    <Link to="/messages" className="sidebarLink messagesParent">
        <b className="messages">Messages</b>
    </Link>
    <Link to="/video-sessions" className="sidebarLink videocamParent">
        <b className="videoSessions">Video sessions</b>
    </Link>
    <Link to="/resources" className="sidebarLink resourcesParent">
        <b className="resources">Resources</b>
    </Link>
</div>
  );
};

export default Sidebar;
