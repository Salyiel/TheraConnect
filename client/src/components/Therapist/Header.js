// src/components/Therapist/Header.js
import React from 'react';
import '../../styles/Therapist/Header.css'; // Importing Header CSS

const Header = () => {
  return (
    <div className="header">
    <div className="theraconnect">
        <div className="theraconnect1">
            <span className="theraconnectTxt">
                <span>Thera</span>
                <span className="connect">Connect</span>
            </span>
        </div>
    </div>
    <div className="logout">
        <div className="logout1">Logout</div>
    </div>
    <div className="notifications">
        <div className="notifications1">Notifications</div>
    </div>
</div>
  );
};

export default Header;
