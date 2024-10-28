import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotesModal from './NotesModal'; // Import the Modal
import '../styles/ClientDashboard.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState([]); // Store user's notes
  const [currentNote, setCurrentNote] = useState({ title: '', content: '' }); // Current note being viewed/edited
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [isEditing, setIsEditing] = useState(false); // Track if a user is editing a note
  const [loading, setLoading] = useState(true); // To handle the loading state
  const [therapist, setTherapist] = useState(null); // State to store therapist information
  const navigate = useNavigate();

  const userName = sessionStorage.getItem('userName')

  const therapistPage = <Link className="find" to="/find-therapists">Change Therapist</Link>;

  // Fetch notes from the database based on user ID
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const userId = sessionStorage.getItem('userId'); // Retrieve user ID from sessionStorage
        if (!userId) {
          throw new Error('User ID is not available.');
        }
        console.log('Fetching notes for user:', userId);
        
        const response = await axios.get(`${process.env.REACT_APP_FLASK_API_URL}/api/notes?userId=${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        setNotes(response.data); // Set the notes state
      } catch (error) {
        console.error('Error fetching notes:', error); // Log the error
      } finally {
        setLoading(false);
      }
    };

    fetchNotes(); // Call the fetch function
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/appointments?client_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          console.error('Error fetching appointments:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []); // Add any dependencies if necessary

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const therapistId = sessionStorage.getItem('therapist'); // Retrieve user ID from sessionStorage
        if (!therapistId) {
          throw new Error('User ID is not available.');
        }
        const response = await axios.get(`${process.env.REACT_APP_FLASK_API_URL}/api/therapist/${therapistId}`);
        if (response.status === 200) {
          setTherapist(response.data); // Assuming the therapist data is returned correctly
        } else {
          console.error('Error fetching therapist:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching therapist:', error);
      }
    };
  
    fetchTherapist(); // Call the fetch function
  }, []); // Run this effect only once when the component mounts
  

  // Handle opening the modal to create a new note
  const openModalForNewNote = () => {
    setCurrentNote({ title: '', content: '' });
    setIsEditing(true); // Set to true for new note
    setIsModalOpen(true);
  };

  // Handle opening the modal to view/edit a note
  const openModalForEditing = (note) => {
    setCurrentNote(note);
    setIsEditing(false); // Set to true for editing an existing note
    setIsModalOpen(true);
  };

  // Handle switching to edit mode
  const handleEditNote = () => {
    setIsEditing(true); // Set to true to enter editing mode
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNote({ title: '', content: '' });
  };

  const handleSaveNote = async (note) => {
    try {
      const userId = sessionStorage.getItem('userId'); // Use user ID instead of token
      if (!userId) {
        throw new Error('User ID is not available.');
      }
  
      const noteData = { ...note, userId }; // Include userId in the note data
  
      // Assume you're in editing mode
      if (currentNote.id) {
        // Updating an existing note
        const response = await axios.put(`${process.env.REACT_APP_FLASK_API_URL}/api/notes/${currentNote.id}`, noteData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setNotes((prevNotes) =>
          prevNotes.map((n) => (n.id === currentNote.id ? response.data : n))
        );
      } else {
        // Creating a new note
        const response = await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/api/notes`, noteData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setNotes((prevNotes) => [...prevNotes, response.data]); // Add the new note to the state
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      closeModal(); // Close the modal after saving
    }
  };
    
  

  // Handle deleting a note
  const handleDeleteNote = async () => {
    try {
      const userId = sessionStorage.getItem('userId'); // Use user ID instead of token
      if (!userId) {
        throw new Error('User ID is not available.');
      }

      await axios.delete(`${process.env.REACT_APP_FLASK_API_URL}/api/notes/${currentNote.id}?userId=${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== currentNote.id));
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      closeModal();
    }
  };

  // Loading screen while fetching notes
  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setCurrentNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('therapist');
    sessionStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="logo">Theraconnect</h1>
        <nav className="dashboard-nav">
          <div className='navigation-links'>
            <button className="page">{therapistPage}</button>
            <button><Link to="/conversations">Messages</Link></button>
            <button><Link to="/profile">Profile</Link></button>
            <button><Link to="/about-us">About Us</Link></button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      </header>

      <div className="welcome-message">
        <h2>Hi {userName}, Welcome</h2>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className='my-sessions-card'>
            <h3>My Sessions</h3>
            {appointments.length === 0 ? (
              <p>No current sessions</p>
            ) : (
              <ul className="appointments-list">
                {appointments.map((appointment) => (
                  <li key={appointment.id}>
                    <strong>Date:</strong> {appointment.date} <br />
                    <strong>Time:</strong> {appointment.time} <br />
                    <strong>Therapist:</strong> {appointment.therapist_name} <br />
                    {/* Add other details if necessary */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="card">
          <h3>My Therapist</h3>
          {therapist ? (
            <>
              <p>{therapist.name}</p>
              <p>{therapist.qualification}</p>
              <p>{therapist.experience} years experience</p>
              <p>Email: <a href={`mailto:${therapist.email}`}>{therapist.email}</a></p>
              <p>Phone: {therapist.phone}</p>
            </>
          ) : (
            <p>No therapist assigned. Please select one.</p>
          )}
        </div>


        {/* Notes Section */}
        <div className="card my-notes">
          <h3>My Notes</h3>
          {notes.length === 0 ? (
            <p>No notes available. Click "New Note" to create one.</p>
          ) : (
            <div className="notes-list-container"> 
              <ul className="notes-list">
                {notes.map((note, index) => (
                  <li key={index} onClick={() => openModalForEditing(note)}>
                    <strong>{note.title}</strong> - {note.content.substring(0, 30)}...
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={openModalForNewNote}>New Note</button>
        </div>

        <div className="card">
          <h3>Resources</h3>
          <ul className='resources'>
            <li><a href="https://www.therapistaid.com/therapy-worksheets">Worksheets</a></li>
            <li><a href="https://www.therapistaid.com/interactive-therapy-tools">Interactives</a></li>
            <li><a href="https://www.therapistaid.com/therapy-videos">Videos</a></li>
            <li><a href="https://www.therapistaid.com/therapy-articles">Articles</a></li>
          </ul>
        </div>

        <div className="card">
          <h3>Book Appointment</h3>
          <p>Schedule an appointment now with your therapist.</p>
          <Link className="find" to="/find-therapists">Schedule a session</Link>;

        </div>

        <div className="card">
          <h3>Support</h3>
          <p>Contact support for assistance.</p>
        </div>
      </div>

      {/* Modal Component */}
      <NotesModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveNote} // Pass the save function
        onDelete={handleDeleteNote} // Pass the delete function
        currentNote={currentNote}
        handleNoteChange={handleNoteChange} // Pass handleNoteChange
        isEditing={isEditing}
        onEdit={handleEditNote}
      />

      <div className="resource-videos">
        <h3>Resource Videos</h3>
        <div className="video-carousel">
          <iframe
            src="https://www.youtube.com/embed/odgz9gCqsOY"
            title="Therapy Video 1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/jpYDTpQxq50"
            title="Therapy Video 2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/iQrk5ENmPOU"
            title="Therapy Video 3"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

