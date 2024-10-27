import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { useParams } from 'react-router-dom';
import SetPrimaryTherapistModal from './SetPrimaryTherapistModal'; // Import the modal
import "../styles/Booking.css"

const BookingPage = ({ therapistName }) => {
    const { id } = useParams(); // Get therapistId from URL parameters
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    // Fetch available times when selectedDate changes
    useEffect(() => {
        const fetchAvailableTimes = async () => {
            if (selectedDate && id) { // Ensure therapistId is available
                try {
                    const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/availability/${id}?date=${selectedDate.toISOString().split('T')[0]}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setAvailableTimes(data.available_slots || []); // Adjust based on your actual API response
                } catch (error) {
                    console.error("Error fetching available times:", error);
                }
            }
        };

        fetchAvailableTimes();
    }, [selectedDate, id]); // Depend on therapistId as well

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTime(null); // Reset time selection when date changes
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select both a date and a time.');
            return;
        }
    
        const bookingData = {
            therapist_id: id, // Use the therapistId from URL params
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
        };
    
        const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
        console.log("token: ", token);
        
        try {
            const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the token in the headers
                },
                body: JSON.stringify(bookingData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert(data.message);
                setIsModalOpen(true); // Open the modal after successful booking
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error booking appointment:", error);
        }
    };

    const handleModalConfirm = async () => {
        // Logic to set the therapist as the primary therapist
        const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
        const clientId = sessionStorage.getItem('userId');

        console.log(clientId);
        
        
        try {
            const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/set-primary-therapist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ client_id: clientId, therapist_id: id }), // Send therapist ID
            });

            const data = await response.json();

            if (response.ok) {
                alert('Therapist set as primary successfully.');
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error setting primary therapist:", error);
        }

        setIsModalOpen(false); // Close the modal after confirming
    };

    return (
        <div className="booking-container">
            <h2>Book an Appointment with {therapistName}</h2>
            <label>Select a service</label>
            <select className="service-select">
                <option value="counseling">Counseling</option>
                <option value="therapy">Therapy</option>
            </select>

            <Calendar selectedDate={selectedDate} onDateChange={handleDateChange} />

            <div className="time-selection">
                <label>Select a time</label>
                <div className="time-buttons">
                    {availableTimes.length > 0 ? (
                        availableTimes.map(time => (
                            <button 
                                key={time} 
                                className={`time-button ${selectedTime === time ? 'selected' : ''}`} 
                                onClick={() => handleTimeChange(time)}
                            >
                                {time}
                            </button>
                        ))
                    ) : (
                        <p>No available times for this date</p>
                    )}
                </div>
            </div>

            <div className="summary">
                <p><strong>{selectedDate ? selectedDate.toDateString() : "Select a date"}</strong></p>
                <p><strong>{selectedTime ? selectedTime : "Select a time"}</strong></p>
            </div>

            <button className="confirm-button" onClick={handleBooking}>Confirm booking</button>

            {/* Set Primary Therapist Modal */}
            <SetPrimaryTherapistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Close modal
                onConfirm={handleModalConfirm} // Handle confirmation
            />
        </div>
    );
};

export default BookingPage;
