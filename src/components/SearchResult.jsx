import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AnimeSkeleton from './AnimeSkeleton';
import '../assets/css/SearchResult.css';
import { App } from '@capacitor/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';

// Function to truncate the anime title
const truncateTitle = (title, maxWords) => {
  const words = title.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return title;
};

const SearchResults = () => {
  const { query } = useParams(); // Get the search query from the URL parameters
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoadingSearch(true);
      try {
        const { data } = await axios.get(`https://kurokami.vercel.app/api/search/${encodeURIComponent(query)}`);
        setSearchResults(data);
      } catch (error) {
        console.error('Error fetching search data:', error);
      } finally {
        setLoadingSearch(false);
      }
    };

    fetchSearchResults();
  }, [query]); // Re-run the effect when the query changes

  // BACK Button
  useEffect(() => {
    const handleBackButton = () => {
      // Navigate back to the previous page
      navigate(-1);
    };

    // Listen to the back button event
    const removeListener = App.addListener('backButton', handleBackButton);

    // Cleanup listener on unmount
    return () => {
      removeListener.remove();
    };
  }, [navigate]);

  return (
    <div id="bg-search-result">
      {/* Back Button */}
      <div className="navigation-back ">

      <button
        onClick={() => navigate(-1)}
        className="btn btn-back btn-link"
        style={{ top: '10px', left: '10px' }}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
      </div>

      <p className="text-start text-white fs-1 pt-5">
        <b>Search</b> Results for "{query}"
      </p>
      <div
        id="container-search-result"
        className="d-flex justify-content-center"
      >
        {loadingSearch ? (
          <div className='container d-flex justify-content-center align-items-center' style={{ width: '100%', height: '200px' }}>
    <Spinner animation="border" role="status" style={{ color:'#A41E34' }}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
        ) : (
          searchResults.map((manhwa, index) => (
            <Link
              id="card"
              className="col-sm-2 rounded d-flex flex-column justify-content-start align-items-center p-0"
              key={index}
              style={{ width: '30%', height: '200px', margin: '5px', overflow: 'hidden' }}
              to={`/manhwa/${manhwa.url.split('/')[4]}`}
            >
              <div
                className="row"
                style={{
                  width: '100%',
                  height: '150px',
                  backgroundImage: ` url(${manhwa.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              ></div>
              <div className="card-body d-flex flex-column align-items-center">
                <p className="search-title text-center text-decoration-none text-white m- pb-2">
                  {truncateTitle(manhwa.title, 3)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;
