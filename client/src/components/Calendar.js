import React from 'react';

const Calendar = ({ selectedDate, onDateChange }) => {
    const today = new Date();

    const handleDateClick = (date) => {
        onDateChange(date);
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
            <h3>{today.toLocaleString('default', { month: 'long' })} {today.getFullYear()}</h3>
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