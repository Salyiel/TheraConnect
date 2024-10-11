// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Update this line
import Home from './pages/Home'; // Ensure you import your Home component
import './index.css'; // Ensure this line is present

const App = () => {
  return (
    <Router>
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<Home />} /> {/* Use element prop for the route */}
        {/* Add other routes here if needed */}
      </Routes>
    </Router>
  );
};

export default App;
