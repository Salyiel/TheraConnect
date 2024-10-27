import React, { useState, useEffect } from 'react';
import '../../styles/Therapist/Header.css'; // Importing Header CSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Header = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [notifications, setNotifications] = useState([]); // State for notifications
    const [unreadCount, setUnreadCount] = useState(0); // State for unread notifications count

    // Function to handle logout
    const handleLogout = () => {
        // Clear user session or token
        localStorage.removeItem("userToken"); // Example: Remove token from localStorage
        // Navigate to login page
        navigate('/login'); // Redirect to login page
    };

    // Function to handle notifications click
    const handleNotifications = () => {
        console.log('Notifications clicked');
        setUnreadCount(0); // Reset unread count once notifications are viewed
        // Implement logic to show notification dropdown or modal
        alert(JSON.stringify(notifications, null, 2)); // Temporary: Display notifications as an alert
    };

    // Function to fetch notifications from the backend
    const fetchNotifications = async () => {
        try {
            // Replace with actual API call to fetch notifications
            const response = await fetch('/api/notifications'); // Sample backend endpoint
            const data = await response.json();
            setNotifications(data.notifications);
            // Count unread notifications
            const unread = data.notifications.filter(n => !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Fetch notifications on component mount
    useEffect(() => {
        fetchNotifications();
        // You can also set an interval to poll for new notifications periodically
        const interval = setInterval(() => {
            fetchNotifications(); // Polling every 60 seconds (adjust as needed)
        }, 60000);
        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, []);

    return (
        <div className="headerb">
            <div className="theraconnect">
                <div className="theraconnect1">
                    <span className="theraconnectTxt">
                        <span>Thera</span>
                        <span className="connect">Connect</span>
                    </span>
                </div>
            </div>
            <div className="notifications" onClick={handleNotifications}>
                <div className="notifications1">
                    Notifications
                    {unreadCount > 0 && (
                        <span className="unread-count">{unreadCount}</span> // Show unread count badge
                    )}
                </div>
            </div>
            <div className="logout" onClick={handleLogout}>
                <span className="logout1">Logout</span>
            </div>
        </div>
    );
};

export default Header;