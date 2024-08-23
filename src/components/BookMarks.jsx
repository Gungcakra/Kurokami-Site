import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/BookMarks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import AdsterraAds from './AdsterraAds';

const Bookmarks = () => {
  const [bookmarkedManhwa, setBookmarkedManhwa] = useState([]);

  useEffect(() => {
    // Load bookmarked manhwa from local storage
    const bookmarkData = localStorage.getItem('bookmarkedManhwa');
    if (bookmarkData) {
      const manhwa = JSON.parse(bookmarkData);
      setBookmarkedManhwa(manhwa);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to delete a bookmark
  const deleteBookmark = (bookmarkIndex) => {
    // Create a new array without the deleted bookmark
    const updatedBookmarks = bookmarkedManhwa.filter((_, index) => index !== bookmarkIndex);
    // Update state
    setBookmarkedManhwa(updatedBookmarks);
    // Save updated bookmarks to local storage
    localStorage.setItem('bookmarkedManhwa', JSON.stringify(updatedBookmarks));
  };

  // Function to truncate the manhwa title
  const truncateTitle = (manhwaTitle) => {
    const maxLength = 30; // You can adjust the max length as needed
    if (manhwaTitle.length > maxLength) {
      return manhwaTitle.substring(0, maxLength) + '...';
    }
    return manhwaTitle;
  };
  const limitSynopsis = (text, wordLimit = 10) => {
    const cleanedText = text.replace(/<img[^>]*>/g, '').replace(/\n+/g, ' ').trim();
    const words = cleanedText.split(" ");
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(" ")}...` : cleanedText;
  };
  return (
    <div className="bookmark-container">
      <p className='text-center text-white fs-2 fw-bold m-2'>Bookmarks</p>
      <div className="container d-flex align-items-center">
        {bookmarkedManhwa.length > 0 ? (
          <div>
            {bookmarkedManhwa.map((manhwa, index) => (
              <div className='bookmark-episode-list text-decoration-none text-white' key={index}>
                <div className="episode-card-left">
                  <img src={manhwa.imageSrc} className='episode-image' alt={manhwa.title} />
                </div>
                <div className="episode-card-right">
                  <Link to={`/manhwa/${manhwa.id}`} className='text-decoration-none text-white'>
                    <p className='episode-title fw-bold m-2'>{truncateTitle(manhwa.title)}</p>
                    <p className="text-white m-2"><FontAwesomeIcon style={{color:'gold'}} icon={faStar} /> {manhwa.rating}</p>
                    {/* <div className="bookmark-detail m-2 d-flex flex-wrap">
                      <p className='text-white'>{limitSynopsis(manhwa.synopsis)}</p>
                    </div> */}
                    <p className="text-white m-2">{manhwa.status}</p>
                  </Link>
                  {/* <button onClick={() => deleteBookmark(index)} className="delete-button">
                    Delete
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-center text-white'>No bookmarks added yet.</p>
        )}
      </div>
      <AdsterraAds />

    </div>
  );
};

export default Bookmarks;
