import React, { useState, useEffect } from 'react';
import '../assets/css/History.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const History = () => {
  const [readChapters, setReadChapters] = useState([]);

  useEffect(() => {
    const getSavedChapters = () => {
      const savedChapters = JSON.parse(localStorage.getItem('savedChapters')) || [];
      return savedChapters.sort((a, b) => new Date(b.time) - new Date(a.time));
    };

    const chapters = getSavedChapters();
    setReadChapters(chapters);
  }, []);

  const formatTime = (time) => {
    const now = new Date();
    const chapterDate = new Date(time);
    const diff = now - chapterDate;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days < 30) {
      return `${days} days ago`;
    } else {
      return chapterDate.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
    }
  };

  const truncateTitle = (manhwaTitle) => {
    const maxLength = 30; // You can adjust the max length as needed
    if (manhwaTitle.length > maxLength) {
      return manhwaTitle.substring(0, maxLength) + '...';
    }
    return manhwaTitle;
  };

  return (
    <div className="history-container">
      <p className="text-center text-white fs-2 m-3 p-2 fw-bold">History</p>
      <div className="history-content">
        {readChapters.length > 0 ? (
          readChapters.map((chapter, index) => (
            <div key={index} className="history-chapter-item mb-3">
              <div className="p-3 border border-secondary rounded shadow-sm bg-dark text-light">
                <p className="mb-2">{truncateTitle(chapter.chapterTitle)}</p>
                <p className="mb-0"><FontAwesomeIcon icon={faClock} className='me-2'/> {formatTime(chapter.time)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 bg-dark border border-secondary rounded shadow-sm text-light">
            <p className="mb-0">No chapters read yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
