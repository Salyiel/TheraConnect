import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get therapist ID
import BookingForm from './BookingForm';
import '../styles/TherapistProfile.css'; 

const TherapistProfile = () => {
    const { id } = useParams(); // Extract therapist ID from the URL
    const [therapist, setTherapist] = useState(null); // Therapist data
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // Fetch therapist data from the API
    useEffect(() => {
        const fetchTherapist = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/therapist/${id}`);
                const data = await response.json();
                setTherapist(data);
            } catch (error) {
                console.error("Error fetching therapist data:", error);
            }
        };

        fetchTherapist();
    }, [id]);

    // Update the date and time
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };

    // Ensure therapist data is loaded
    if (!therapist) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-containerb">
            <header>
                <h1>{therapist.name} <span className="verified">✔ Verified</span></h1>
            </header>
            <section className="profile-details">
                <div className="profile-description">
                    <h2>{therapist.name}</h2>
                    <p className="subtitle">{therapist.qualification}</p>
                    <p className="experience">{therapist.experience} years experience. {therapist.description} <a href=".">Read more</a></p>
                </div>
                <div className="profile-image">
                    <img className="thera-image" src={therapist.image} alt="Therapist" />
                </div>
            </section>
            <BookingForm 
                therapistName={therapist.name}
                selectedDate={selectedDate} 
                selectedTime={selectedTime} 
                onDateChange={handleDateChange} 
                onTimeChange={handleTimeChange} 
            />
        </div>
    );
};

export default TherapistProfile;
