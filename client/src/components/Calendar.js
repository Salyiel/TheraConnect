import React from 'react';

const Calendar = ({ selectedDate, onDateChange }) => {
    const today = new Date();

    const handleDateClick = (date) => {
        onDateChange(date);
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
            <h3>June 2024</h3>
            <div className="calendar-grid">
                {generateDates().map(date => (
                    <div 
                        key={date}
                        className={`calendar-date ${selectedDate && selectedDate.getDate() === date.getDate() ? 'selected' : ''}`}
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
