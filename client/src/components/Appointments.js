import React, { useEffect, useState } from 'react';
import '../styles/Appointments.css'; // Ensure this matches your CSS file
import Calendar from './Calendar'; // Import the Calendar component if needed

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

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

    if (loading) {
        return <div>Loading appointments...</div>;
    }

    return (
        <div className="appointments-container">
            <nav className="navbar">
                <div className="logo">TheraConnect</div>
                <ul className="nav-links">
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/appointments">Appointments</a></li>
                    <li><a href="/profile">Profile</a></li>
                    <li><a href="/settings">Settings</a></li>
                </ul>
                <div className="logout-button">
                    <button onClick={() => {
                        sessionStorage.removeItem('token');
                        window.location.href = '/login';
                    }}>Logout</button>
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
