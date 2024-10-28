import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TherapistList.css';
import { Link, useNavigate } from "react-router-dom";

const TherapistList = () => {
    const [therapists, setTherapists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTherapists = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Get the JWT token from localStorage
                const response = await axios.get(`${process.env.REACT_APP_FLASK_API_URL}/api/therapists`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTherapists(response.data.therapists);
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while fetching therapists.');
            } finally {
                setLoading(false);
            }
        };

        fetchTherapists();
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
                    <h2>Therapists List</h2>
                </div>

                {loading ? (
                    <p>Loading therapists...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : therapists.length > 0 ? (
                    <div className="therapists-section">
                        {therapists.map(therapist => (
                            <div className="therapist-card" key={therapist.id}>
                                <img src={therapist.image} alt={`${therapist.name}`} className="therapist-image" />
                                <h4>{therapist.name}</h4>
                                <p>Email: {therapist.email}</p>
                                <p>Phone: {therapist.phone}</p>
                                <p>Location: {therapist.location}</p>
                                <p>Qualification: {therapist.qualification}</p>
                                <p>Experience: {therapist.experience} years</p>
                                <p>License Number: {therapist.license_number}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-therapists">No therapists available.</div>
                )}
            </div>
        </div>
    );
};

export default TherapistList;
