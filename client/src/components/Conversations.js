// src/components/Conversations.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Conversations.css';
import { Link } from "react-router-dom";

const Conversations = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);

    useEffect(() => {
        const fetchConversations = async () => {
            const token = sessionStorage.getItem('token');

            try {
                const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/conversations`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }

                const data = await response.json();
                console.log('Conversations fetched:', data);
                setConversations(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchParticipants = async () => {
            const token = sessionStorage.getItem('token');
        
            try {
                const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/users`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch participants');
                }
        
                const data = await response.json(); // This will now include the therapist for clients
                const role = sessionStorage.getItem('role');
        
                // Filter participants based on user role
                if (role === 'client') {
                    const therapist = data.therapist; // API now returns therapist directly for clients
                    setParticipants(therapist ? [therapist] : []); // Set therapist as the participant
                } else if (role === 'therapist') {
                    const clients = data; // The API already returns the clients for therapists
                    setParticipants(clients);
                } else if (role === 'admin') {
                    setParticipants(data); // Admins get all users
                }
            } catch (err) {
                console.error(err.message);
            }
        };
        

        fetchConversations();
        fetchParticipants();
    }, []);

    const handleNewConversation = async () => {
        const userId = sessionStorage.getItem('userId');
        console.log('Current User ID:', userId);
    
        if (!userId) {
            alert('Unable to determine the current user.');
            return;
        }
    
        console.log('Selected Participants:', selectedParticipants);
    
        const participantsWithSelf = [Number(userId), ...selectedParticipants];
        console.log('Participants including current user:', participantsWithSelf);
    
        if (participantsWithSelf.length < 2) {
            alert('Please select at least one other participant to start a conversation.');
            return;
        }
    
        // Fetch the names for selected participants for comparison
        const selectedParticipantNames = participants
            .filter(participant => selectedParticipants.includes(participant.id))
            .map(participant => participant.name);
    
        console.log('Selected Participant Names:', selectedParticipantNames);
    
        // Check if a conversation already exists with the selected participants
        const existingConversation = conversations.find(conversation => {
            console.log('Checking conversation:', conversation);
    
            // Handle case where conversation has 'otherParticipant'
            if (conversation.otherParticipant) {
                console.log('Conversation has otherParticipant:', conversation.otherParticipant);
                const otherParticipant = conversation.otherParticipant; // This is the name
                const found = selectedParticipantNames.includes(otherParticipant);
                console.log('Is otherParticipant in selectedParticipantNames?', found);
                return found && selectedParticipantNames.length === 1; // Ensure only one other participant
            }
    
            // Handle case where 'participants' is an array in the conversation
            if (conversation.participants && Array.isArray(conversation.participants)) {
                const participantNames = conversation.participants.map(participant => participant.name);
                // Sort both arrays to ensure order doesn't matter
                const sameLength = participantNames.length === selectedParticipantNames.length;
                const allMatch = participantNames.sort().every((name, index) => name === selectedParticipantNames.sort()[index]);
                console.log('Participants in conversation:', participantNames);
                console.log(`Same length? ${sameLength}, All match? ${allMatch}`);
                return sameLength && allMatch;
            }
    
            return false;
        });
    
        if (existingConversation) {
            // If an existing conversation is found, navigate to it
            console.log('Found existing conversation:', existingConversation);
            navigate(`/chats/${existingConversation.id}`, { state: { participantNames: existingConversation.otherParticipant || '' } });
            return; // Exit the function early
        }
    
        // Create a new conversation if no existing one was found
        try {
            console.log('No existing conversation found, creating a new one...');
            const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/conversations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ participant_ids: participantsWithSelf })
            });
    
            console.log('Response from create conversation API:', response);
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create or get conversation');
            }
    
            const data = await response.json();
            console.log('New conversation data:', data);
    
            if (data.conversation_id) {
                const participantNames = participants
                    .filter(participant => participantsWithSelf.includes(participant.id))
                    .map(participant => participant.name)
                    .join(', ');
    
                console.log('New conversation participant names:', participantNames);
    
                setConversations(prev => [...prev, { 
                    id: data.conversation_id, 
                    name: participantNames, 
                    lastMessage: '', 
                    timestamp: new Date().toISOString() 
                }]);
    
                setSelectedParticipants([]);
                setShowParticipantDropdown(false);
    
                navigate(`/chats/${data.conversation_id}`, { state: { participantNames } });
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };


    const handleLogout = () => {
        sessionStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handleSelectConversation = (conversationId) => {
        const conversation = conversations.find(conv => conv.id === conversationId);
        if (conversationId && conversation) {
            console.log('Selected conversation ID: ', conversationId);
            navigate(`/chats/${conversationId}`, { state: { participantNames: conversation.name } });
        } else {
            console.error('conversationId is undefined or null');
        }
    };

    const toggleParticipantSelection = (participantId) => {
        setSelectedParticipants(prev => {
            if (prev.includes(participantId)) {
                return prev.filter(id => id !== participantId);
            } else {
                return [...prev, participantId];
            }
        });
    };

    const toggleDropdown = () => {
        setShowParticipantDropdown(prev => !prev);
    };

    if (loading) {
        return <div>Loading conversations...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="conversations-container">
            <nav className="navbar">
                <div className="logo">TheraConnect</div>
                <ul className="nav-links">
                    <li><Link to="/appointments">Appointments</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/conversations">Messages</Link></li>
                </ul>
                <div className="logout-button">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className="header">
                <h2>Conversations</h2>
                <div className="button-container">
                    <button onClick={toggleDropdown} className="new-conversation-button">
                        Start New Conversation
                    </button>
                    {showParticipantDropdown && (
                        <div className="participant-dropdown">
                            <h3>Select Participants</h3>
                            <ul>
                                {participants.map(participant => (
                                    <li key={participant.id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedParticipants.includes(participant.id)}
                                                onChange={() => toggleParticipantSelection(participant.id)}
                                            />
                                            {participant.name} ({participant.role})
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={handleNewConversation} className="create-conversation-button">
                                Create Conversation
                            </button>
                        </div>
                    )}
                </div>
            </div>


            <ul className="conversation-list">
                {conversations.length === 0 ? (
                    <li className="no-conversations-message">No conversations available.</li>
                ) : (
                    conversations.map((conversation) => (
                        <li 
                            key={conversation.id} 
                            className="conversation-item"
                            onClick={() => handleSelectConversation(conversation.id)}
                        >
                            <h3>{conversation.otherParticipant}</h3> {/* Displaying the other user's name */}
                            <p>{conversation.lastMessage}</p>
                            <span>{new Date(conversation.timestamp).toLocaleString()}</span>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Conversations;
