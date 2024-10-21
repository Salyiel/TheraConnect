import React, { useState } from 'react';
import "../styles/AdminPage.css";

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activePage, setActivePage] = useState('therapists');
  
    const handleAuthSubmit = (event) => {
      event.preventDefault();
      setIsAuthenticated(true);
    };
  
    const renderPage = () => {
      switch (activePage) {
        case 'therapists':
          return (
            <div id="therapists">
              <h2 className="page-title">Therapists</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialty</th>
                    <th>Contact</th>
                    <th>License Number</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Dr. John Doe</td>
                    <td>Psychiatrist</td>
                    <td>john@example.com</td>
                    <td>123456</td>
                  </tr>
                  {/* Add other therapist rows here */}
                </tbody>
              </table>
              <div className="profile-cards">
                <div className="profile-card">
                  <img src="https://placehold.co/150x150" alt="Dr. John Doe" className="profile-img" />
                  <h3 className="profile-name">Dr. John Doe</h3>
                  <p className="profile-details">Psychiatrist</p>
                  <p className="profile-details">john@example.com</p>
                  <p className="profile-details">License: 123456</p>
                  <div className="profile-actions">
                    <button className="btn approve">Approve</button>
                    <button className="btn disapprove">Disapprove</button>
                  </div>
                </div>
                {/* Add other profile cards here */}
              </div>
            </div>
          );
        case 'clients':
          return (
            <div id="clients">
              <h2 className="page-title">Clients</h2>
              <div className="profile-cards">
                <div className="profile-card">
                  <img src="https://placehold.co/150x150" alt="Jane Smith" className="profile-img" />
                  <h3 className="profile-name">Jane Smith</h3>
                  <p className="profile-details">janesmith@example.com</p>
                  <p className="profile-details">Client ID: 789456</p>
                </div>
                {/* Add other client cards here */}
              </div>
            </div>
          );
        case 'statistics':
          return (
            <div id="statistics">
              <h2 className="page-title">Statistics</h2>
              <h3 className="section-title">Therapists</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>License Number</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Dr. John Doe</td>
                    <td>123456</td>
                  </tr>
                  {/* Add other therapist rows here */}
                </tbody>
              </table>
              <h3 className="section-title">Clients</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>janesmith@example.com</td>
                  </tr>
                  {/* Add other client rows here */}
                </tbody>
              </table>
            </div>
          );
        case 'announcements':
          return (
            <div id="announcements">
              <h2 className="page-title">Announcements</h2>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="4" placeholder="Type your announcement here..." className="input"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="recipient">Send To</label>
                <select id="recipient" className="input">
                  <option value="therapists">Therapists</option>
                  <option value="clients">Clients</option>
                </select>
              </div>
              <button className="btn send">Send Announcement</button>
            </div>
          );
        default:
          return null;
      }
    };
  
    return (
      <div className="admin-page">
        {!isAuthenticated ? (
          <div className="auth-page">
            <h2 className="auth-title">Sign Up / Log In</h2>
            <form onSubmit={handleAuthSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" className="input" placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" className="input" placeholder="Enter your password" />
              </div>
              <div className="form-group">
                <label htmlFor="otp">OTP</label>
                <input type="text" id="otp" className="input" placeholder="Enter OTP" />
              </div>
              <button type="submit" className="btn submit">Submit</button>
            </form>
          </div>
        ) : (
          <div className="dashboard">
            <nav className="nav">
              <h2 className="nav-title">TheraConnect</h2>
              <ul className="nav-links">
                <li onClick={() => setActivePage('therapists')}>Therapists</li>
                <li onClick={() => setActivePage('clients')}>Clients</li>
                <li onClick={() => setActivePage('statistics')}>Statistics</li>
                <li onClick={() => setActivePage('announcements')}>Announcements</li>
              </ul>
            </nav>
            <div className="content">{renderPage()}</div>
          </div>
        )}
      </div>
    );
  };
  
  export default AdminPage;