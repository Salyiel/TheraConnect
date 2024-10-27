import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for active link styling
import '../../styles/Therapist/Sidebar.css'; // Importing Sidebar CSS

const Sidebar = () => {
    const sidebarLinks = [
        { path: "/therapist-dashboard", label: "Dashboard", className: "dashboardParent" },
        { path: "/therapist-dashboard/profile", label: "Profile", className: "profileParent" },
        { path: "/therapist-dashboard/appointments", label: "Appointments", className: "appointmentsParent" },
        { path: "/therapist-dashboard/messages", label: "Messages", className: "messagesParent" },
        { path: "/therapist-dashboard/clients", label: "Clients", className: "clientsParent" },
        { path: "/therapist-dashboard/resources", label: "Resources", className: "resourcesParent" },
    ];

    return (
        <div className="sidebar">
            {sidebarLinks.map((link, index) => (
                <NavLink
                    key={index}
                    to={link.path}
                    className={`sidebarLink ${link.className}`}
                    activeClassName="active" // Class to apply for active links
                >
                    <b className={link.label.toLowerCase()}>{link.label}</b>
                </NavLink>
            ))}
        </div>
    );
};

export default Sidebar;