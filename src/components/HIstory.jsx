import React, { useState, useEffect } from 'react';
import '../assets/css/History.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux'; // Sesuaikan dengan action yang sesuai
import AdsterraAds from './AdsterraAds';
import { Link } from 'react-router-dom';
import { setManhwaId } from '../store';

const History = () => {
  const [readChapters, setReadChapters] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getSavedChapters = () => {
      const savedChapters = JSON.parse(localStorage.getItem('savedChapters')) || [];
      return savedChapters.sort((a, b) => new Date(b.time) - new Date(a.time));
    };
    const chapters = getSavedChapters();
    setReadChapters(chapters);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
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
      return `${seconds} dettik lalu`;
    } else if (minutes < 60) {
      return `${minutes} menit lalu`;
    } else if (hours < 24) {
      return `${hours} jam lalu`;
    } else if (days < 30) {
      return `${days} hari lalu`;
    } else {
      return chapterDate.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
    }
  };

  const truncateTitle = (manhwaTitle) => {
    const maxLength = 35; // Anda dapat menyesuaikan panjang maksimal sesuai kebutuhan
    if (manhwaTitle.length > maxLength) {
      return manhwaTitle.substring(0, maxLength) + '...';
    }
    return manhwaTitle;
  };

  const toSlug = (title) => {
    const cleanedTitle = title.replace(/Bahasa Indonesia/i, '').trim();
    return cleanedTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleLinkClick = (manhwaTitle) => {
    const manhwaId = toSlug(manhwaTitle);
    dispatch(setManhwaId(manhwaId));
  };
  // const handleDelete = (chapterTitle) => {
  //   const updatedChapters = readChapters.filter(chapter => chapter.chapterTitle !== chapterTitle);
  //   setReadChapters(updatedChapters);
  //   localStorage.setItem('savedChapters', JSON.stringify(updatedChapters));
  // };
  
  return (
    <div className="history-container">
      <p className="text-center text-white fs-3 m-3 p-2 fw-bold">Riwayat Baca</p>
      <div className="container history-content d-flex flex-column justify-content-center gap-2">
        {readChapters.length > 0 ? (
          readChapters.map((chapter, index) => (
            <Link
              to={`/chapter/${toSlug(chapter.chapterTitle)}`}
              key={index}
              className="history-chapter-item text-decoration-none"
              onClick={() => handleLinkClick(chapter.manhwaTitle)}
            >
              <div className="p-3 border border-secondary rounded bg-dark text-light">
                <p className="mb-2">{truncateTitle(chapter.chapterTitle)}</p>
                <p className="mb-0"><FontAwesomeIcon icon={faClock} className='me-2'/> {formatTime(chapter.time)}</p>
              </div>
            </Link>
          ))
        ) : (
            <p className="mb-0 text-center text-white">Belum Ada Chapter Yang  Dibaca</p>
       
        )}
<div className="pt-2">

        <AdsterraAds />
</div>
      </div>
    </div>
  );
};

export default History;
