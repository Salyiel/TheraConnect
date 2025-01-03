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
import TherapistDashboard from './components/TherapistDashboard';
import Appointments from './components/Appointments';
import Conversations from './components/Conversations';
import ConversationMessages from './components/ConversationMessages';
import Waiting from './components/Waiting';
import AdminDashboard from './components/AdminDashboard';
import ClientList from './components/ClientList';
import TherapistList from './components/TherapistList';
import Reports from './components/Reports';
import Banned from './components/Banned';

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
          <Route path="/therapist" element={<TherapistDashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/chats/:conversationId" element={<ConversationMessages />} />
          <Route path="/waiting" element={<Waiting />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/client-list" element={<ClientList />} />
          <Route path="/therapist-list" element={<TherapistList />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/banned" element={<Banned />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
