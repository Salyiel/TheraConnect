// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import FindTherapists from './components/FindTherapists';
import ClientLanding from './components/ClientLanding';
import ClientPage from './components/ClientPage';
import TherapistLanding from './components/TherapistLanding';
import TherapistDashboard from './pages/TherapistDashboard'; // Importing TherapistDashboard

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ClientLanding />} />
          <Route path="/client-landing" element={<ClientLanding />} />
          <Route path="/therapist-landing" element={<TherapistLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/clientpage" element={<ClientPage />} />
          <Route path="/find-therapists" element={<FindTherapists />} />
          <Route path="/therapist-dashboard/*" element={<TherapistDashboard />} /> {/* Use wildcard for nested routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
