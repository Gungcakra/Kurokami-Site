import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../assets/css/GenreResult.css';
import { App } from '@capacitor/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';
import AdsterraAds from './AdsterraAds';

const truncateTitle = (title, maxWords) => {
  const words = title.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return title;
};

const GenreResults = () => {
  const { genreId, pageNumber } = useParams();
  const [genreResults, setGenreResults] = useState({ seriesList: [], pagination: [], nextPage: null });
  const [loadingGenre, setLoadingGenre] = useState(true);
  const [currentPage, setCurrentPage] = useState(pageNumber || 1); // Default to 1 if pageNumber is not provided
  const navigate = useNavigate();
  const [inputPage, setInputPage] = useState(currentPage || '');

  useEffect(() => {
    const fetchGenreResults = async () => {
      setLoadingGenre(true);
      try {
        const { data } = await axios.get(`https://kurokami.vercel.app/api/genre/${genreId}/page/${currentPage}`);
        setGenreResults(data);
      } catch (error) {
        console.error('Error fetching genre data:', error);
      } finally {
        setLoadingGenre(false);
      }
    };

    fetchGenreResults();
  }, [genreId, currentPage]);

  useEffect(() => {
    const handleBackButton = () => {
      navigate(-1);
    };

    const removeListener = App.addListener('backButton', handleBackButton);

    return () => {
      removeListener.remove();
    };
  }, [navigate]);

  const handlePageClick = (pageUrl, pageNumber) => {
    // Set the current page and navigate to the correct route
    setCurrentPage(pageNumber);
    console.log(pageNumber)
    // useEffect(() => {
    //   const fetchGenreResults = async () => {
    //     setLoadingGenre(true);
    //     try {
    //       const { data } = await axios.get(`https://kurokami.vercel.app/api/genre/${genreId}/page/${currentPage}`);
    //       setGenreResults(data);
    //     } catch (error) {
    //       console.error('Error fetching genre data:', error);
    //     } finally {
    //       setLoadingGenre(false);
    //     }
    //   };
  
    //   fetchGenreResults();
    // }, [genreId, currentPage]);
  };
  useEffect(() => {
    // Reset the input page value when currentPage changes
    setInputPage(currentPage || '');
  }, [currentPage]);

  // Handle input change
  const handleInputChange = (e) => {
    setInputPage(e.target.value);
  };

  // Handle Enter key press
  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const pageNumber = parseInt(inputPage, 10);

      // Validate and update currentPage
      setCurrentPage(pageNumber); // Update state instead of navigating
      
    }
  };

  const maxButtons = 3;
  const paginatedButtons = genreResults.pagination.slice(0, maxButtons);
  return (
    <div id="bg-genre-result">
      <div className="navigation-back">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-back btn-link"
          style={{ top: '10px', left: '10px' }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
      </div>

      <p className="text-start text-white fs-3 mt-5 pt-4 m-2">
        <b>Genre</b> Results for "{genreId}"
      </p>
      <AdsterraAds />

      <div id="container-genre-result" className="d-flex justify-content-center">
        {loadingGenre ? (
          <div className='container d-flex justify-content-center align-items-center' style={{ width: '100%', height: '200px' }}>
            <Spinner animation="border" role="status" style={{ color: '#A41E34' }}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          genreResults.seriesList.map((manhwa, index) => (
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
                  backgroundImage: `url("${manhwa.image}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              ></div>
              <div className="card-body d-flex flex-column align-items-center">
                <p className="genre-res-title text-center text-decoration-none text-white m- pb-2">
                  {truncateTitle(manhwa.title, 3)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      {!loadingGenre && genreResults.pagination.length > 0 && (
        <div className="pagination-container d-flex justify-content-center">
          {currentPage > 1 ? (
            <button
              className="btn btn-pagination"
              onClick={() => handlePageClick(`/genre/${genreId}/page/${currentPage - 1}`, currentPage - 1)}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Prev
            </button>
          ) :(
            <button
              className="btn btn-pagination" style={{ opacity:'0.6' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Prev
            </button>

          )}
          {genreResults.pagination ? (
            <input
            className="page-input text-center bg-dark text-white rounded"
            type="text"
            inputMode="numeric"
            value={inputPage}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyPress} // Handle Enter key press
            style={{ maxWidth: '10%' }}
            placeholder="Page number"
          />
          ):(
            <input type="text" name="" id="" />
          )}
          {!genreResults.nextPage && (
            <button
              className="btn btn-pagination"
              onClick={() => handlePageClick(genreResults.nextPage, currentPage + 1)}
            >
              Next <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GenreResults;
