import React, { useState, useEffect } from 'react';
import { Link,} from "react-router-dom";
import '../styles/ClientDashboard.css';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState('No notes yet...');
  const [loading, setLoading] = useState(true);


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulating data fetch delay
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('notes', notes); // Save notes to local storage
    }, 2000);
    return () => clearTimeout(timeoutId); // Clear timeout if user keeps typing
  }, [notes]);

  return loading ? (
    <div className="loader">Loading...</div>
  ) : (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="logo">Theraconnect</h1>
        <nav className="dashboard-nav">
          <button onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button><Link className = "find" to="/find-therapists">Change Therapist</Link></button>
          <button><Link to="/profile">Profile</Link></button>
          <button>Log out</button>
        </nav>
      </header>

      <div className="welcome-message">
        <h2>Hi Marvin, Welcome</h2>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>My Sessions</h3>
          <p>No current session</p>
        </div>

        <div className="card">
          <h3>My Therapist</h3>
          <p>Mr. Allan Njoroge</p>
          <p>Masters in Social Psychology</p>
          <p>7 years experience</p>
          <p>Email: <a href="mailto:therapist@example.com">therapist@example.com</a></p>
          <p>Phone: (123) 456-7890</p>
        </div>

        <div className="card my-notes">
          <h3>My Notes</h3>
          <textarea value={notes} onChange={handleNotesChange} className="notes-area" />
        </div>

        <div className="card">
          <h3>Resources</h3>
          <p>Access our resources here.</p>
        </div>

        <div className="card">
          <h3>Book Appointment</h3>
          <p>Schedule an appointment now with your therapist.</p>
        </div>

        <div className="card">
          <h3>Support</h3>
          <p>Contact support for assistance.</p>
        </div>
      </div>

      <div className="resource-videos">
        <h3>Resource Videos</h3>
        <div className="video-carousel">
          {/* Replace with dynamic content or other videos as needed */}
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID1"
            title="Therapy Video 1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID2"
            title="Therapy Video 2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID3"
            title="Therapy Video 3"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID3"
            title="Therapy Video 3"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID3"
            title="Therapy Video 3"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID3"
            title="Therapy Video 3"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID3"
            title="Therapy Video 3"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID3"
            title="Therapy Video 3"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID3"
            title="Therapy Video 3"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID3"
            title="Therapy Video 3"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
