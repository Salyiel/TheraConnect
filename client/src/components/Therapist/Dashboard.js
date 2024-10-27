import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../../styles/Therapist/Dashboard.css'; // Ensure this matches your CSS file

const Dashboard = () => {
    const [date, setDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState("");
    
    const appointments = [
        { time: "9:41 AM", name: "Ella Smith", service: "Counselling" },
        { time: "11:41 AM", name: "Ella Smith", service: "Counselling" },
    ];

    // Update the current time every minute
    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };

        const intervalId = setInterval(updateCurrentTime, 60000); // Update every minute
        updateCurrentTime(); // Initial call to set the time right away

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    // Handle calling action
    const handleCall = (name) => {
        alert(`Calling ${name}...`);
    };

    // Handle video call action
    const handleVideo = () => {
        window.open('https://meet.google.com/', '_blank');
    };

    return (
        <div className="dashboard-containera">
            <div className="greeting-section">
                <h2>Hello, Walls Ada</h2>
                <div className="profile-photo">
                    <img src="path/to/profile.jpg" alt="Profile" className="photo-frame" />
                </div>
            </div>

            <div className="highlights">
                <div className="highlight-box">
                    <h4>Total Clients</h4>
                    <p>24</p>
                </div>
                <div className="highlight-box">
                    <h4>Upcoming Appointments</h4>
                    <p>08</p>
                </div>
                <div className="highlight-box">
                    <h4>Pending Requests</h4>
                    <p>20</p>
                </div>
            </div>

            <div className="todays-appointments">
                <h3>Today's Appointments</h3>
                {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                        <div className="appointment-card" key={index}>
                            <div className="appointment-time">{appointment.time}</div>
                            <div className="appointment-details">
                                <h4>{appointment.name}</h4>
                                <p>{appointment.service}</p>
                            </div>
                            <div className="appointment-actions">
                                <button className="call-button" onClick={() => handleCall(appointment.name)}>📞</button>
                                <button className="video-button" onClick={handleVideo}>📹</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-appointments">No appointments today.</div>
                )}
            </div>

            <div className="calendar-section">
                <div className="current-time">Current Time: {currentTime}</div>
                <div className="calendar">
                    <Calendar onChange={setDate} value={date} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;