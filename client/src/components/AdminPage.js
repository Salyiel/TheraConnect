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
  const [therapists, setTherapists] = useState([]);
  const [clients, setClients] = useState([]);
  const [notification, setNotification] = useState(''); // Therapist form submission notification
  const [announcementMessage, setAnnouncementMessage] = useState(''); // For announcements
  const [announcementRole, setAnnouncementRole] = useState('therapist'); // Role selection
  const [statistics, setStatistics] = useState({
    clients: 10, // Dummy data
    therapists: 5, // Dummy data
    users: 15 // Dummy data (clients + therapists)
  });

  useEffect(() => {
    // Fetch resources
    axios.get('http://127.0.0.1:5000/resources')
      .then(response => setResources(response.data))
      .catch(error => console.error('Error fetching resources:', error));

    // Fetch pending therapists for admin approval
    axios.get('/api/therapist-pending')
      .then(response => setTherapists(response.data))
      .catch(error => console.error('Error fetching pending therapists:', error));

    // Fetch clients and therapists for statistics
    axios.get('/api/clients')
      .then(response => setClients(response.data))
      .catch(error => console.error('Error fetching clients:', error));
    
    axios.get('/api/therapists')
      .then(response => setTherapists(response.data))
      .catch(error => console.error('Error fetching therapists:', error));

  }, []);

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    setIsAuthenticated(true);
  };

  const handlePostResource = () => {
    axios.post('http://127.0.0.1:5000/resources', {
      title: resourceTitle,
      link: resourceLink
    })
    .then(response => {
      alert(response.data.message);
      setResources([...resources, { title: resourceTitle, link: resourceLink }]);
      setResourceTitle('');
      setResourceLink('');
    })
    .catch(error => console.error('Error posting resource:', error));
  };

  const handleApproveDisapprove = (id, action) => {
    axios.patch(`/api/therapist-status/${id}`, { status: action })
      .then(response => {
        alert(response.data.message);
        setTherapists(therapists.filter(t => t.id !== id));
      })
      .catch(error => console.error('Error updating therapist status:', error));
  };

  const handleAnnouncementSubmit = () => {
    axios.post('/api/announcements', {
      role: announcementRole,
      message: announcementMessage
    })
    .then(response => {
      alert('Announcement sent successfully!');
      setAnnouncementMessage('');
    })
    .catch(error => console.error('Error sending announcement:', error));
  };

  const renderPage = () => {
    switch (activePage) {
      case 'therapists':
        return (
          <div id="therapists">
            <h2 className="page-title">Pending Therapist Approvals</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialty</th>
                  <th>Contact</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {therapists.map(therapist => (
                  <tr key={therapist.id}>
                    <td>{therapist.name}</td>
                    <td>{therapist.specialties}</td>
                    <td>{therapist.contactNumber}</td>
                    <td>
                      <button className="btn-approve" onClick={() => handleApproveDisapprove(therapist.id, 'approved')}>Approve</button>
                      <button className="btn-disapprove" onClick={() => handleApproveDisapprove(therapist.id, 'rejected')}>Disapprove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {notification && <div className="notification">{notification}</div>}
          </div>
        );
      
      case 'statistics':
        return (
          <div id="statistics">
            <h2 className="page-title">Platform Statistics</h2>
            <ul>
              <li>Clients: {statistics.clients}</li>
              <li>Therapists: {statistics.therapists}</li>
              <li>Total Users: {statistics.users}</li>
            </ul>

            <h3 className="section-title">Therapists</h3>
            <ul className="therapist-list">
              {therapists.length > 0 ? (
                therapists.map(therapist => (
                  <li key={therapist.id}>
                    <p><strong>Name:</strong> {therapist.name}</p>
                    <p><strong>Specialty:</strong> {therapist.specialties}</p>
                    <p><strong>Contact:</strong> {therapist.contactNumber}</p>
                  </li>
                ))
              ) : (
                <p>No therapists available.</p>
              )}
            </ul>

            <h3 className="section-title">Clients</h3>
            <ul className="client-list">
              {clients.length > 0 ? (
                clients.map(client => (
                  <li key={client.id}>
                    <p><strong>Name:</strong> {client.name}</p>
                    <p><strong>Email:</strong> {client.email}</p>
                  </li>
                ))
              ) : (
                <p>No clients available.</p>
              )}
            </ul>
          </div>
        );
      
      case 'announcements':
        return (
          <div id="announcements">
            <h2 className="page-title">Send Announcement</h2>
            <div className="form-group">
              <label htmlFor="announcementRole">Role</label>
              <select
                id="announcementRole"
                value={announcementRole}
                onChange={(e) => setAnnouncementRole(e.target.value)}
              >
                <option value="therapist">Therapists</option>
                <option value="client">Clients</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="announcementMessage">Message</label>
              <textarea
                id="announcementMessage"
                className="input"
                placeholder="Enter your announcement"
                value={announcementMessage}
                onChange={(e) => setAnnouncementMessage(e.target.value)}
              />
            </div>
            <button className="btn send" onClick={handleAnnouncementSubmit}>
              Send Announcement
            </button>
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
                placeholder="Enter your OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button type="submit" className="btn submit">Submit</button>
          </form>
        </div>
      ) : (
        <div className="content">
          <nav className="sidebar">
            <ul>
              <li onClick={() => setActivePage('therapists')}>Pending Therapists</li>
              <li onClick={() => setActivePage('statistics')}>Statistics</li>
              <li onClick={() => setActivePage('announcements')}>Announcements</li>
              <li onClick={() => setActivePage('resources')}>Resources</li>
            </ul>
          </nav>
          <div className="main-content">{renderPage()}</div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;