// src/pages/TherapistDashboard.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Therapist/Header'; // Importing Header
import Sidebar from '../components/Therapist/Sidebar'; // Importing Sidebar
import Profile from '../components/Therapist/Profile'; // Importing Profile component
import Appointments from '../components/Therapist/Appointments'; // Importing Appointments component
import Client from '../components/Therapist/Client'; // Importing Client component
import Dashboard from '../components/Therapist/Dashboard'; // Importing actual Dashboard component
import '../styles/Therapist/Dashboard.css'; // Importing the CSS file

const TherapistDashboard = () => {
  const location = useLocation();

  const renderContent = () => {
    if (location.pathname === '/therapist-dashboard') {
      return <Dashboard />; // Render Dashboard only on the main dashboard route
    } else {
      switch (location.pathname) {
        case '/therapist-dashboard/profile':
          return <Profile />;
        case '/therapist-dashboard/appointments':
          return <Appointments />;
        case '/therapist-dashboard/clients':
          return <Client />;
        default:
          return null; // Handle non-existent routes
      }
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        {renderContent()}
      </div>
    </div>
  );
};

export default TherapistDashboard;
