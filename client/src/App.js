import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import FindTherapists from './components/FindTherapists';
import ClientLanding from './components/ClientLanding';
import TherapistLanding from './components/TherapistLanding';

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
          <Route path="/find-therapists" element={<FindTherapists />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
