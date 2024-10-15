import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import FindTherapists from './components/FindTherapists';
import ClientLanding from './components/ClientLanding';
import TherapistLanding from './components/TherapistLanding';
import Verification from './components/Verification';
import Clientdashboard from './components/ClientDashboard'
import Profile from './components/Profile'

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
