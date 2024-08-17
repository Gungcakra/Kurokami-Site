// Dialog.js
import React from 'react';
import '../assets/css/Dialog.css'; // Import the CSS for dialog styling

const Dialog = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
