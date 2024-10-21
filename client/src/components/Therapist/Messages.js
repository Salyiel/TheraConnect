import React, { useState, useEffect, useRef } from 'react';
import '../../styles/Therapist/Messages.css'; // Importing the CSS for styling

const Messages = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'therapist', text: 'Hello, how are you feeling today?', time: '10:00 AM' },
        { id: 2, sender: 'client', text: 'I’m feeling a bit better, thank you.', time: '10:05 AM' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messageEndRef = useRef(null);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const messageObj = {
                id: messages.length + 1,
                sender: 'client',
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([...messages, messageObj]);
            setNewMessage(''); // Clear the input
        }
    };

    // Scroll to the latest message when it changes
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="messages-container">
            <div className="message-list">
                {messages.map((message) => (
                    <div key={message.id} className={`message ${message.sender}`}>
                        <div className="message-text">{message.text}</div>
                        <div className="message-time">{message.time}</div>
                    </div>
                ))}
                <div ref={messageEndRef} /> {/* For auto-scrolling */}
            </div>

            <div className="message-input-container">
                <input
                    type="text"
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()} // Disable button if input is empty
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Messages;
