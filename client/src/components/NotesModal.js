import React from 'react';
import '../styles/NotesModal.css'; // Create this CSS for styling the modal

const NotesModal = ({ isOpen, onClose, onSave, onDelete, currentNote, handleNoteChange, isEditing, onEdit }) => {
  if (!isOpen) return null;

  const handleSaveClick = () => {
    if (isEditing) {
        onSave(currentNote); // Pass the current note to onSave
    }
};

  return (
    <div className="modal-overlay" role="dialog" aria-labelledby="modal-title" aria-modal="true">
      <div className="modal-content">
        <h3 id="modal-title">{isEditing ? 'Edit Note' : 'View Note'}</h3>
        
        {/* Display input fields only if in editing mode */}
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              placeholder="Note Title"
              value={currentNote.title}
              onChange={handleNoteChange}
              aria-label="Note Title"
              required
            />
            <textarea
              name="content"
              placeholder="Note content"
              value={currentNote.content}
              onChange={handleNoteChange}
              className="notes-area"
              aria-label="Note Content"
              required
            />
          </>
        ) : (
          <>
            <h4>{currentNote.title}</h4>
            <p>{currentNote.content}</p>
          </>
        )}

        <div className="modal-buttons">
          {!isEditing ? (
            <>
              <button className="edit-button" onClick={onEdit}>Edit</button>
              <button onClick={onDelete} className="delete-button">Delete</button>
            </>
          ) : (
            <button onClick={handleSaveClick} className="save-button">Save</button>
          )}
          <button onClick={onClose} className="close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
