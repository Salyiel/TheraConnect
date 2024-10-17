// src/components/Therapist/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Therapist/Sidebar.css'; // Importing Sidebar CSS

const Sidebar = () => {
   
  return (
    <div className="sidebar">
      <Link to="/therapist-dashboard" className="sidebarLink dashboardParent">
        <b className="dashboard">Dashboard</b>
      </Link>
      <Link to="/therapist-dashboard/profile" className="sidebarLink profileParent">
        <b className="profile">Profile</b>
      </Link>
      <Link to="/therapist-dashboard/appointments" className="sidebarLink appointmentsParent">
        <b className="appointments">Appointments</b>
      </Link>
      <Link to="/therapist-dashboard/messages" className="sidebarLink messagesParent">
        <b className="messages">Messages</b>
      </Link>
      <Link to="/therapist-dashboard/clients" className="sidebarLink clientsParent">
        <b className="clients">Clients</b>
      </Link>
      <Link to="/therapist-dashboard/resources" className="sidebarLink resourcesParent">
        <b className="resources">Resources</b>
      </Link>
    </div>
  );
};

export default Sidebar;
