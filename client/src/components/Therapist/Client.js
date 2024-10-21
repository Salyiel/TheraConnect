// src/components/Therapist/Client.js

import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Import the calendar component
import 'react-calendar/dist/Calendar.css'; // Import styles for the calendar
import '../../styles/Therapist/Client.css'; // Ensure this file exists for styling

const Client = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newClient, setNewClient] = useState({
        name: '',
        lastVisit: '',
        condition: '',
        phone: '',
        email: '',
    });
    const [clients, setClients] = useState([]); // State to store added clients
    const [selectedClient, setSelectedClient] = useState(null); // To track selected client for scheduling
    const [appointmentDate, setAppointmentDate] = useState(new Date()); // State for selected date

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient({ ...newClient, [name]: value });
    };

    const handleAddClient = () => {
        setClients([...clients, newClient]); // Add new client to the list
        setShowModal(false); // Close modal
        setNewClient({ name: '', lastVisit: '', condition: '', phone: '', email: '' }); // Reset form
    };

    const filteredClients = clients.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleScheduleAppointment = (client) => {
        setSelectedClient(client);
        setShowModal(true); // Show the modal for scheduling
    };

    const handleAppointmentSubmit = () => {
        alert(`Appointment scheduled for ${selectedClient.name} on ${appointmentDate.toLocaleDateString()}`);
        setShowModal(false); // Close modal after scheduling
        setSelectedClient(null); // Reset selected client
    };

    return (
        <div className="client-container">
            <h1>Client Management</h1>
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Search Clients"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                <button className="add-client-btn" onClick={() => setShowModal(true)}>
                    Add New
                </button>
            </div>

            {/* Client List as a Table */}
            <div className="client-list">
                <h2>Registered Clients</h2>
                {filteredClients.length === 0 ? (
                    <p>No clients found</p>
                ) : (
                    <table className="client-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Last Visit</th>
                                <th>Condition</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((client, index) => (
                                <tr key={index} className="client-item">
                                    <td>{client.name}</td>
                                    <td>{client.lastVisit}</td>
                                    <td>{client.condition}</td>
                                    <td>{client.phone}</td>
                                    <td>{client.email}</td>
                                    <td>
                                        <button className="schedule-appointment-btn" onClick={() => handleScheduleAppointment(client)}>
                                            Schedule Appointment
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal for Adding New Client */}
            {showModal && !selectedClient && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New Client</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newClient.name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="lastVisit"
                            placeholder="Last Visit"
                            value={newClient.lastVisit}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="condition"
                            placeholder="Condition"
                            value={newClient.condition}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={newClient.phone}
                            onChange={handleInputChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={newClient.email}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleAddClient}>Submit</button>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* Modal for Scheduling Appointment */}
            {showModal && selectedClient && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Schedule Appointment for {selectedClient.name}</h3>
                        <Calendar
                            onChange={setAppointmentDate}
                            value={appointmentDate}
                        />
                        <button onClick={handleAppointmentSubmit}>Schedule</button>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Client;
