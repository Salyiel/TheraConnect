import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/AdminPage.css";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState('therapists');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceLink, setResourceLink] = useState('');
  const [resources, setResources] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/resources')
      .then(response => setResources(response.data))
      .catch(error => console.error('Error fetching resources:', error));
  }, []);

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    setIsAuthenticated(true);
  };

  const handlePostResource = () => {
    axios.post('http://localhost:5000/resources', {
      title: resourceTitle,
      link: resourceLink
    })
    .then(response => {
      alert(response.data.message);
      // Optionally refresh the list of resources after posting
      setResources([...resources, { title: resourceTitle, link: resourceLink }]);
      setResourceTitle('');
      setResourceLink('');
    })
    .catch(error => console.error('Error posting resource:', error));
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
                  <button className="btn-approve">Approve</button>
                  <button className="btn-disapprove">Disapprove</button>
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
      case 'resources':
        return (
          <div id="resources">
            <h2 className="page-title">Resources</h2>
            <div className="form-group">
              <label htmlFor="resourceTitle">Resource Title</label>
              <input
                type="text"
                id="resourceTitle"
                className="input"
                placeholder="Enter resource title"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="resourceLink">Resource Link</label>
              <input
                type="text"
                id="resourceLink"
                className="input"
                placeholder="Enter downloadable resource link"
                value={resourceLink}
                onChange={(e) => setResourceLink(e.target.value)}
              />
            </div>
            <button type="button" className="btn send" onClick={handlePostResource}>
              Post Resource
            </button>
            {/* List of resources will be shown below */}
            <h3 className="section-title">Posted Resources</h3>
            <ul className="resource-list">
              {resources.length > 0 ? (
                resources.map((resource, index) => (
                  <li key={index}>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                      {resource.title}
                    </a>
                  </li>
                ))
              ) : (
                <p>No resources posted yet.</p>
              )}
            </ul>
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
              <input
                type="email"
                id="email"
                className="input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                className="input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
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
              <li onClick={() => setActivePage('resources')}>Resources</li>
            </ul>
          </nav>
          <div className="content">{renderPage()}</div>
        </div>
      )}
    </div>
  );
};

export default AdminPage