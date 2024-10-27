import React from 'react';
import '../styles/Calendar.css'; // Make sure to import the CSS file for styles

const Calendar = ({ selectedDate, onDateChange }) => {
    const today = new Date();
    
    const handleDateClick = (date) => {
        if (date >= today) { // Only allow clicks on today's date or future dates
            onDateChange(date);
        }
    };

    const generateDates = () => {
        let dates = [];
        for (let i = 1; i <= 30; i++) {
            const date = new Date(today.getFullYear(), today.getMonth(), i);
            dates.push(date);
        }
        return dates;
    };

    return (
        <div className="calendar-container">
            <h3>{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <div className="calendar-grid">
                {generateDates().map(date => (
                    <div 
                        key={date}
                        className={`calendar-date ${selectedDate && selectedDate.getDate() === date.getDate() ? 'selected' : ''} ${date < today ? 'past-date' : ''}`}
                        onClick={() => handleDateClick(date)}
                    >
                        {date.getDate()}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
