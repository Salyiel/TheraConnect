import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ConversationMessages.css'; // Ensure the path is correct

const ConversationMessages = () => {
    const { conversationId } = useParams(); // Get the conversation ID from URL parameters
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
    const [otherUserName, setOtherUserName] = useState(''); // State to hold the other user's name

    useEffect(() => {
        const fetchMessages = async (conversationId) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/conversations/${conversationId}/messages`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const currentUserId = sessionStorage.getItem('userId'); // Fetch the current user's ID

                    // Set messages with type and sender name based on sender
                    const formattedMessages = data.map(msg => ({
                        ...msg,
                        type: msg.sender_id === parseInt(currentUserId) ? 'sent' : 'received', // Determine type based on sender ID
                        sender: msg.sender_id === parseInt(currentUserId) ? 'You' : msg.sender_name // Include sender's name
                    }));

                    setMessages(formattedMessages);
                } else {
                    console.error('Failed to fetch messages');
                }
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false); // Stop loading when done
            }
        };

        const fetchOtherUserName = async (conversationId) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/conversations/${conversationId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const conversation = await response.json();
                    console.log(conversation);
                    const otherUser = conversation.participants.find(participant => participant.id !== Number(sessionStorage.getItem('userId')));
                    console.log(otherUser);
                    setOtherUserName(otherUser ? otherUser.name : 'Unknown User');
                } else {
                    console.error('Failed to fetch conversation details');
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        // Fetch messages and other user name
        if (conversationId) {
            fetchMessages(conversationId);
            fetchOtherUserName(conversationId);
        }
    }, [conversationId]);

    const handleDeleteMessage = async (id) => {
        const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/messages/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            setMessages(messages.filter(message => message.id !== id));
            alert(`Deleted message with ID: ${id}`);
        } else {
            console.error('Failed to delete message');
        }
    };

    const handleReportMessage = async (id, reportedUserId) => {
        const reason = prompt('Please provide a reason for reporting this message:');
        if (reason) {
            const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/reports`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message_id: id, reason, reported_user_id: reportedUserId }) // Include reported_user_id
            });
    
            if (response.ok) {
                alert(`Reported message with ID: ${id}`);
            } else {
                console.error('Failed to report message');
            }
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') {
            alert('Message cannot be empty!');
            return;
        }

        const newMessageData = {
            content: newMessage
        };

        const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessageData)
        });

        if (response.ok) {
            const data = await response.json();
            setMessages([...messages, { id: data.message_id, sender: 'You', content: newMessage, type: 'sent' }]);
            setNewMessage(''); // Clear input field
        } else {
            console.error('Failed to send message');
        }
    };

    if (loading) {
        return <div>Loading messages...</div>; // Display loading message
    }

    return (
        <div className="conversation-messages-container">
            <h2>Messages with {otherUserName}</h2> {/* Displaying the other user's name here */}
            <div className="messages-list">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.type}`}
                        onClick={() => {
                            if (message.type === 'received') {
                                handleReportMessage(message.id, message.sender_id);
                            } else if (message.type === 'sent') {
                                handleDeleteMessage(message.id);
                            }
                        }}
                    >
                        <span className={message.type === 'received' ? 'sender-name' : 'sender-you'}>
                            {message.sender}:
                        </span>
                        <span>{message.content}</span>
                    </div>
                ))}
            </div>
            <div className="new-message-bar">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ConversationMessages;
