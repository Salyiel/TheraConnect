import React from 'react';
import '../styles/Booking.css';

const Booking = () => {
  return (
    <div className="booking-container">
      <div className="therapist-info">
        <img src="/therapist-photo.jpg" alt="Therapist" />
        <h2>Ms. Walls Ada MPhil, PhD</h2>
        <p>Licensed Psychologist</p>
        <p>15 years of experience in clinical psychology...</p>
      </div>

      <div className="booking-form">
        <h3>Book an Appointment with Ms. Walls Ada</h3>
        <select>
          <option>Select a service</option>
        </select>

        <input type="date" />
        <div className="time-selection">
          <button>4:00 PM</button>
          <button>4:15 PM</button>
          <button>4:30 PM</button>
          {/* Add other time slots */}
        </div>

        <button className="confirm-booking">Confirm booking</button>
      </div>
    </div>
  );
};

export default Booking;
