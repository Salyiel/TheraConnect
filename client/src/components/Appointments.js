import React, { useEffect, useState } from 'react';
import '../styles/Appointments.css'; // Ensure this matches your CSS file
import { Link, useNavigate } from "react-router-dom";
import Calendar from './Calendar'; // Import the Calendar component if needed

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

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
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch appointments');
                }

                const data = await response.json();
                setAppointments(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    // Update current time every minute
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const isPastAppointment = (appointmentDate, appointmentTime) => {
        const appointmentDateTime = new Date(`${appointmentDate} ${appointmentTime}`);
        return appointmentDateTime < currentTime;
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

    if (loading) {
        return <div>Loading appointments...</div>;
    }

    return (
        <div className="appointments-container">
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
                <h2>Your Appointments</h2>
                <div className="appointments-list">
                    {appointments.length > 0 ? (
                        appointments.map((appointment, index) => (
                            <div
                                key={index}
                                className={`appointment-card ${isPastAppointment(appointment.date, appointment.time) ? 'past-appointment' : ''}`}
                            >
                                <div className="appointment-time">
                                    {appointment.time} on {appointment.date}
                                </div>
                                <div className="appointment-details">
                                    <h4>{appointment.client_name}</h4>
                                    <p>{isPastAppointment(appointment.date, appointment.time) ? 'Past Appointment' : 'Upcoming Appointment'}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-appointments">No appointments found.</div>
                    )}
                </div>

                <div className="calendar-section">
                    <Calendar onChange={setCurrentTime} value={currentTime} />
                </div>
            </div>
        </div>
    );
};

export default Appointments;
