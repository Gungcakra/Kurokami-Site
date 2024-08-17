// src/components/BottomNavBar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/css/BottomNavBar.css'; // Import the CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCalendar, faHistory, faUser, faBookBookmark, faBook } from '@fortawesome/free-solid-svg-icons';

const BottomNavBar = () => {
  
  return (
    <div className="bottom-nav-bar shadow-lg d-flex justify-content-around align-items-center">
      <div className="container d-flex m-3 gap-1">
      <NavLink
        to="/"
        className={({ isActive }) => {
                return isActive ? "nav-links active rounded" : "nav-links text-white";
              }}
      >
        <FontAwesomeIcon icon={faHome} />
        <span className="nav-texts">Home</span>
      </NavLink>
{/* 
      <NavLink
        to="/jadwal"
        className={({ isActive }) => {
                return isActive ? "nav-links active" : "nav-links text-white";
              }}
      >
        <FontAwesomeIcon icon={faCalendar} />
        <span className="nav-texts">Jadwal</span>
      </NavLink> */}
      <NavLink
        to="/bookmark"
        className={({ isActive }) => {
                return isActive ? "nav-links active" : "nav-links text-white";
              }}
      >
        <FontAwesomeIcon icon={faBookBookmark} />
        <span className="nav-texts">Bookmark</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) => {
                return isActive ? "nav-links active" : "nav-links text-white";
              }}
      >
        <FontAwesomeIcon icon={faHistory} />
        <span className="nav-texts">History</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => {
                return isActive ? "nav-links active" : "nav-links text-white";
              }}
      >
        <FontAwesomeIcon icon={faUser} />
        <span className="nav-texts">Profile</span>
      </NavLink>
      </div>
    </div>
  );
};

export default BottomNavBar;
