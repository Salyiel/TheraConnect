import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import '../styles/AdminDashboard.css';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [date, setDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [declineRemark, setDeclineRemark] = useState('');
    const [showRemarkModal, setShowRemarkModal] = useState(false);
    const navigate = useNavigate();

    // Update current time every minute
    useEffect(() => {
        const intervalId = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(intervalId);
    }, []);

    // Fetch pending therapist requests
    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_FLASK_API_URL}/api/admin/pending-therapists`);
                setPendingRequests(response.data);
            } catch (error) {
                console.error('Error fetching pending requests:', error);
            }
        };

        fetchPendingRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/api/admin/approve/${id}`);
            alert(`Approved therapist with ID: ${id}`);
            // Refresh the pending requests
            const updatedRequests = pendingRequests.filter(request => request.user_id !== id);
            setPendingRequests(updatedRequests);
            setSelectedRequest(null);
        } catch (error) {
            console.error('Error approving therapist:', error);
        }
    };

    const handleDecline = () => {
        setShowRemarkModal(true);
    };

    const confirmDecline = async () => {
        if (!declineRemark) {
            alert('Please provide a remark before declining.');
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/api/admin/decline/${selectedRequest.user_id}`, { remarks: declineRemark });
            alert(`Declined therapist with ID: ${selectedRequest.user_id}`);
            // Refresh the pending requests
            const updatedRequests = pendingRequests.filter(request => request.user_id !== selectedRequest.user_id);
            setPendingRequests(updatedRequests);
            setSelectedRequest(null);
            setShowRemarkModal(false);
            setDeclineRemark('');
        } catch (error) {
            console.error('Error declining therapist:', error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('therapist');
        sessionStorage.removeItem('role');
        navigate('/login');
    };

    const admin = sessionStorage.getItem('userName')

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
                    <h2>Welcome, {admin}</h2>
                </div>

                <div className="requests-section">
                    <h3>Pending Therapist Applications</h3>
                    {pendingRequests.length > 0 ? (
                        pendingRequests.map((request) => (
                            <div className="request-card" key={request.user_id} onClick={() => setSelectedRequest(request)}>
                                <img src={request.image} alt={`${request.name}'s profile`} className="profile-image" />
                                <div className="request-summary">
                                    <h4>{request.name}</h4>
                                    <p>Specialties: {request.specialties}</p>
                                    <p>Qualifications: {request.qualifications}</p>
                                    <p>Experience: {request.experience_years} years</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-requests">No pending applications.</div>
                    )}
                </div>

                <div className="calendar-section">
                    <div className="current-time">
                        Current Time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <Calendar onChange={setDate} value={date} />
                </div>

                {selectedRequest && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-modal" onClick={() => setSelectedRequest(null)}>X</button>
                            <img src={selectedRequest.image} alt={`${selectedRequest.name}'s profile`} className="modal-profile-image" />
                            <h4>{selectedRequest.name}</h4>
                            <p>Email: {selectedRequest.email}</p>
                            <p>Gender: {selectedRequest.gender}</p>
                            <p>Date of Birth: {selectedRequest.dob}</p>
                            <p>Phone: {selectedRequest.phone}</p>
                            <p>Location: {selectedRequest.location}</p>
                            <p>Specialties: {selectedRequest.specialties}</p>
                            <p>Qualifications: {selectedRequest.qualifications}</p>
                            <p>Experience: {selectedRequest.experience_years} years</p>
                            <p>Availability: {selectedRequest.availability}</p>
                            <p>Consultation Fee: ${selectedRequest.consultation_fee}</p>
                            <p>Bio: {selectedRequest.bio}</p>
                            <p>Languages: {selectedRequest.languages}</p>
                            <p>License Number: {selectedRequest.license_number}</p>
                            <div className="request-actions">
                                <button className="approve-button" onClick={() => handleApprove(selectedRequest.user_id)}>Approve</button>
                                <button className="decline-button" onClick={handleDecline}>Decline</button>
                            </div>
                        </div>
                    </div>
                )}

                {showRemarkModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-modal" onClick={() => setShowRemarkModal(false)}>X</button>
                            <h4>Provide Remarks for Declining</h4>
                            <textarea
                                value={declineRemark}
                                onChange={(e) => setDeclineRemark(e.target.value)}
                                placeholder="Enter your remarks here..."
                            />
                            <div className="request-actions">
                                <button className="confirm-decline-button" onClick={confirmDecline}>Confirm Decline</button>
                                <button className="cancel-button" onClick={() => setShowRemarkModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
