import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { Link } from "react-router-dom";
import '../styles/TherapistDashboard.css'; // Ensure this matches your CSS file

const TherapistDashboard = () => {
    const [therapistData, setTherapistData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [totalClients, setTotalClients] = useState(0);
    const [date, setDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [loadingAppointments, setLoadingAppointments] = useState(true);

    // Fetch therapist data from the backend
    useEffect(() => {
        const fetchTherapistData = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                alert('User is not logged in!');
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/therapist/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch therapist data');
                }

                const data = await response.json();
                setTherapistData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching therapist data:', error);
            }
        };

        fetchTherapistData();
    }, []);

    // Fetch therapist's appointments from the backend
    useEffect(() => {
        const fetchAppointments = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                alert('User is not logged in!');
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/therapist/appointments`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch appointments');
                }

                const data = await response.json();
                setAppointments(data);
                setLoadingAppointments(false);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    // Fetch total clients from the backend
    useEffect(() => {
        const fetchTotalClients = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                alert('User is not logged in!');
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/therapist/total-clients`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch total clients');
                }

                const data = await response.json();
                setTotalClients(data.total_clients);
            } catch (error) {
                console.error('Error fetching total clients:', error);
            }
        };

        fetchTotalClients();
    }, []);

    // Update current time every minute
    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            setCurrentTime(now);
        };

        const intervalId = setInterval(updateCurrentTime, 60000);
        updateCurrentTime(); // Initial call to set time immediately

        return () => clearInterval(intervalId);
    }, []);


    const handleVideo = (name) => {
        window.open('https://meet.google.com/', '_blank');
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('therapist');
        sessionStorage.removeItem('role');
        window.location.href = '/login';
    };

    if (loading || loadingAppointments) {
        return <div>Loading dashboard...</div>;
    }

    // Calculate total and upcoming appointments
    const totalAppointments = appointments.length;

    // Get today's date in YYYY-MM-DD format
    const todayDate = new Date().toISOString().split('T')[0];

    // Filter today's appointments
    const todaysAppointments = appointments.filter(appointment => appointment.date === todayDate);

    // Calculate upcoming appointments
    const upcomingAppointments = todaysAppointments.filter(appointment => {
        const appointmentTime = new Date(`${appointment.date} ${appointment.time}`);
        return appointmentTime >= currentTime;
    });

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <div className="logo">TheraConnect</div>
                <ul className="nav-links">
                    <li><Link to="/therapist">Dashboard</Link></li>
                    <li><Link to="/appointments">Appointments</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/conversations">Messages</Link></li>
                </ul>
                <div className="logout-button">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="content-wrapper">
                <div className="greeting-section">
                    <h2>Welcome, {therapistData?.name}</h2>
                    <div className="profile-photo">
                        <img src={therapistData?.image || 'path/to/default-profile.jpg'} alt="Profile" className="photo-frame" />
                    </div>
                </div>

                <div className="highlights">
                    <div className="highlight-box">
                        <h4>Total Clients</h4>
                        <p>{totalClients}</p>
                    </div>
                    <div className="highlight-box">
                        <h4>Upcoming Appointments</h4>
                        <p>{upcomingAppointments.length}</p>
                    </div>
                    <div className="highlight-box">
                        <h4>Total Appointments</h4>
                        <p>{totalAppointments}</p>
                    </div>
                </div>

                <div className="appointments-section">
                    <h3>Today's Appointments</h3>
                    {todaysAppointments.length > 0 ? (
                        todaysAppointments.map((appointment, index) => {
                            const appointmentTime = new Date(`${appointment.date} ${appointment.time}`);
                            const isPastByOneHour = appointmentTime < currentTime; // Check if the appointment is past

                            return (
                                <div className={`appointment-card ${isPastByOneHour ? 'past-appointment' : ''}`} key={index}>
                                    <div className="appointment-time">{appointment.time}</div>
                                    <div className="appointment-details">
                                        <h4>{appointment.client_name}</h4>
                                        <p>Counselling</p> {/* Service type is hardcoded for now */}
                                    </div>
                                    <div className="appointment-actions">
                                        <button className="video-button" onClick={() => handleVideo(appointment.client_name)}>📹</button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-appointments">No appointments today.</div>
                    )}
                </div>

                <div className="calendar-section">
                    <div className="current-time">Current Time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <Calendar onChange={setDate} value={date} />
                </div>
            </div>
        </div>
    );
};

export default TherapistDashboard;
