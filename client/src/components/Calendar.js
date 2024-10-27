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
        const year = today.getFullYear();
        const month = today.getMonth();
        // Get the number of days in the current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let dates = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
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