import React, { useState } from 'react';
import '../../styles/Therapist/Appointments.css'; // Ensure this file exists for styling

const Appointments = () => {
  const [appointments] = useState([
    {
      id: 1,
      clientName: 'John Doe',
      visitType: 'Chronic care visit',
      date: '2024-10-17',
      time: '11:30 AM - 12:00 PM',
      status: 'Confirmed',
    },
    {
      id: 2,
      clientName: 'Leela Kearney',
      visitType: 'New symptom visit',
      date: '2024-10-18',
      time: '10:00 AM - 10:30 AM',
      status: 'Pending',
    },
    {
      id: 3,
      clientName: 'Neel Galvan',
      visitType: 'Follow-up visit',
      date: '2024-10-19',
      time: '1:00 PM - 1:30 PM',
      status: 'Completed',
    },
    {
      id: 4,
      clientName: 'Alice Johnson',
      visitType: 'Annual check-up',
      date: '2024-10-16',
      time: '9:00 AM - 9:30 AM',
      status: 'Completed',
    },
    {
      id: 5,
      clientName: 'Bob Smith',
      visitType: 'Initial Consultation',
      date: '2024-10-20',
      time: '2:00 PM - 2:30 PM',
      status: 'Request',
    },
  ]);
   
    const [searchTerm, setSearchTerm] = useState('');
    const today = new Date().toISOString().split('T')[0];
  
    const sortedAppointments = appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    const filteredAppointments = sortedAppointments.filter(appointment =>
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.visitType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleAction = (id, action) => {
      alert(`${action} appointment request ID: ${id}`);
      // Logic for the action (send reminder, accept, reschedule)
    };
  
    return (
      <div className="appointments-container">
        <h2>Appointments</h2>
  
        <div className="appointments-header">
          <input
            type="text"
            placeholder="Search by client's name or visit type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="schedule-btn" onClick={() => alert('Schedule a new appointment')}>
            Schedule an Appointment
          </button>
        </div>
  
        {/* Upcoming Appointments */}
        <div className="appointments-section">
          <h3>Upcoming Appointments</h3>
          <table>
            <thead>
              <tr>
                <th>Client's Name</th>
                <th>Visit Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appointment => (
                appointment.status === 'Confirmed' && (
                  <tr key={appointment.id} className={appointment.date === today ? 'today-appointment' : 'hover-row'}>
                    <td>{appointment.clientName}</td>
                    <td>{appointment.visitType}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.status}</td>
                    <td>
                      {appointment.date === today && (
                        <button className="action-btn" onClick={() => handleAction(appointment.id, 'Send Reminder')}>
                          Send Reminder
                        </button>
                      )}
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
          {filteredAppointments.filter(app => app.status === 'Confirmed').length > 0 && (
            <button className="view-all-btn">View All Upcoming</button>
          )}
        </div>
  
        {/* Appointment Requests */}
        <div className="appointments-section">
          <h3>Appointment Requests</h3>
          <table>
            <thead>
              <tr>
                <th>Client's Name</th>
                <th>Visit Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appointment => (
                appointment.status === 'Pending' && (
                  <tr key={appointment.id} className="hover-row">
                    <td>{appointment.clientName}</td>
                    <td>{appointment.visitType}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.status}</td>
                    <td>
                      <button className="action-btn" onClick={() => handleAction(appointment.id, 'Accept')}>Accept</button>
                      <button className="action-btn" onClick={() => handleAction(appointment.id, 'Reschedule')}>Reschedule</button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
          {filteredAppointments.filter(app => app.status === 'Request').length > 0 && (
            <button className="view-all-btn">View All Requests</button>
          )}
        </div>
  
        {/* Previous Appointments */}
        <div className="appointments-section">
          <h3>Previous Appointments</h3>
          <table>
            <thead>
              <tr>
                <th>Client's Name</th>
                <th>Visit Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appointment => (
                appointment.status === 'Completed' && (
                  <tr key={appointment.id} className="hover-row">
                    <td>{appointment.clientName}</td>
                    <td>{appointment.visitType}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.status}</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
          {filteredAppointments.filter(app => app.status === 'Completed').length > 0 && (
            <button className="view-all-btn">View All Previous</button>
          )}
        </div>
      </div>
    );
  };
  
  export default Appointments;
  