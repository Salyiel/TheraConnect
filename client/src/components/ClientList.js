import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ClientList.css'; // Assuming styles are similar to AdminDashboard
import { Link, useNavigate } from "react-router-dom";

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Get the JWT token from localStorage
                const response = await axios.get(`${process.env.REACT_APP_FLASK_API_URL}/api/clients`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setClients(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while fetching clients.');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('therapist');
        sessionStorage.removeItem('role');
        navigate('/login');
      };

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <div className="logo">TheraConnect</div>
                <ul className="nav-links">
                <li><Link to="/admin">Dashboard</Link></li>
                    <li><Link to="/client-list">Clients</Link></li>
                    <li><Link to="/therapist-list">Therapists</Link></li>
                    <li><Link to="/conversations">Messages</Link></li>
                    <li><Link to="/reports">Reports</Link></li>
                </ul>
                <div className="logout-button">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="content-wrapper">
                <div className="welcome-section">
                    <h2>Clients List</h2>
                </div>

                {loading ? (
                    <p>Loading clients...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : clients.length > 0 ? (
                    <div className="clients-section">
                        {clients.map(client => (
                            <div className="client-card" key={client.id}>
                                <p>Name: {client.name}</p>
                                <p>Email: {client.email}</p>
                                <p>Gender: {client.gender}</p>
                                <p>D.O.B: {client.dob}</p>
                                <p>Phone: {client.phone}</p>
                                <p>Location: {client.location}</p>
                                
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-clients">No clients available.</div>
                )}
            </div>
        </div>
    );
};

export default ClientList;
