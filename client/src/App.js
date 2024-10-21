// src/App.js
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import FindTherapists from './components/FindTherapists';
import ClientLanding from './components/ClientLanding';
import ClientPage from './components/ClientPage';
import TherapistLanding from './components/TherapistLanding';
import Verification from './components/Verification';
import Clientdashboard from './components/ClientDashboard'
import Profile from './components/Profile'
import ForgotPassword from './components/ForgotPassword';
import AboutUs from './components/AboutUs'
import TherapistInfo from './components/TherapistInfo';
import TherapistProfile from './components/TherapistProfile';
import TherapistDashboard from './pages/TherapistDashboard';
import AdminPage from './components/AdminPage';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ClientLanding />} />
          <Route path="/client-landing" element={<ClientLanding />} />
          <Route path="/therapist-landing" element={<TherapistLanding />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/signup" 
            element={
              <SignUp 
                role={new URLSearchParams(window.location.search).get('role')} 
              />
            } 
          />
          <Route path="/find-therapists" element={<FindTherapists />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/client" element={<Clientdashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/therapist-info" element={<TherapistInfo />} />
          <Route path="/therapist-profile/:id" element={<TherapistProfile />} />
          <Route path="/therapist-dashboard" element={< TherapistDashboard />} />
          <Route path="/adminpage" element={<AdminPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
