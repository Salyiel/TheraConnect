import React from 'react';
import '../styles/ClientDashboard.css';

const ChangeTherapistModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Therapist</h2>
        <form>
          <label>Select New Therapist</label>
          <input type="text" placeholder="Enter Therapist Name" />
          <button type="submit">Submit</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ChangeTherapistModal;
