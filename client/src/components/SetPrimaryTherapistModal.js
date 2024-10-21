import React from 'react';
import '../styles/SetPrimaryTherapistModal.css'; // Add your styles here

const SetPrimaryTherapistModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null; // Don't render anything if the modal is not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Primary Therapist</h2>
        <p>Do you want to set this therapist as your primary therapist?</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onClose}>Not Yet</button>
        </div>
      </div>
    </div>
  );
};

export default SetPrimaryTherapistModal;
