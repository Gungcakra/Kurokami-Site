import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/css/ManhwaList.css";
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faStar,faSearch,faFire } from '@fortawesome/free-solid-svg-icons';
import GoogleAds from './GoogleAds';
const ManhwaList = () => {
  const [popularManhwa, setPopularManhwa] = useState([]);
  const [newManhwa, setNewManhwa] = useState([]);
  const [ongoingManhwa, setOnGoingManhwa] = useState([]);
  const [recommendManhwa, setRecommendManhwa] = useState([])
  const [genreList, setGenreList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFixed, setIsFixed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate()
  // POPULAR
  useEffect(() => {

    const fetchPopularManhwa = async () => {
      try {
        const response = await fetch('https://kurokami.vercel.app/api/manhwa-popular');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setPopularManhwa(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularManhwa();
  }, []);

  // POPULAR
  useEffect(() => {

    const fetchRecommendManhwa = async () => {
      try {
        const response = await fetch('https://kurokami.vercel.app/api/manhwa-recommend');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setRecommendManhwa(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendManhwa();
  }, []);


  // NEW
  useEffect(() => {
    const fetchNewManhwa = async () => {
      try {
        const response = await fetch('https://kurokami.vercel.app/api/manhwa-new');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        // Filter out entries with no chapters
        const filteredResult = result.filter(manhwa => manhwa.chapters && manhwa.chapters.length > 0);
        setNewManhwa(filteredResult);
        console.log(filteredResult);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchNewManhwa();
  }, []);

  // ONGOING
  useEffect(() => {
    const fetchOnGoingManhwa = async () => {
      try {
        const response = await fetch('https://kurokami.vercel.app/api/manhwa-ongoing');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setOnGoingManhwa(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOnGoingManhwa();
  }, []);


  // GENRE
  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const response = await fetch('https://kurokami.vercel.app/api/data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setGenreList(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchGenre();
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Check if the scroll position is greater than 100px to fix the search bar
      if (scrollTop > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div id='bg-manhwalist' className="container-fluid">

<div className="container container-recommend p-2">
  {recommendManhwa.map((rec, index) => (
    <div key={index} className="recommend-card-container">
      <div className="recommend-card-background" style={{ backgroundImage: `url("${rec.image}")` }}></div>
      <div className="recommend-card-content">
        <div className="left-side">
          <img src={rec.image} alt={rec.title} />
        </div>
        <div className="right-side">
          <p className="title">{rec.title}</p>
          <p className="ratings"><FontAwesomeIcon icon={faStar} style={{ color:'gold' }}/> {rec.rating}</p>
          <Link className="button-read text-decoration-none text-white" to={`/manhwa/${rec.url.split('/')[4]}`}><FontAwesomeIcon icon={faEye} /> Read</Link>
        </div>
      </div>
    </div>
  ))}
</div>

<div className={`search-bar ${isFixed ? 'fixed' : ''}`}>
     <form onSubmit={handleSearch}>

     
      <div className="input-group d-flex justify-content-center align-items-center mt-2">
        <input
          type="text"
          className="form-control bg-dark text-light rounded"
          placeholder="Search..."
          aria-label="Search"
          aria-describedby="search-addon"
          value={searchQuery}
            onChange={handleInputChange}
        />
        <div className="input-group-append">
        <button className="btn btn-dark text-white" type="submit" id="search-addon">
              <FontAwesomeIcon icon={faSearch} className='icon-search' />
            </button>
        </div>
      </div>
      </form>
    </div>




      {/* POPULAR MANHWA */}
      <p className="text-start text-white fs-3 pt-3"><b>Popular</b> Manhwa</p>
      {loading ? (
  <div className='container d-flex justify-content-center align-items-center' style={{ width: '100%', height: '200px' }}>
    <Spinner animation="border" role="status" style={{ color:'#A41E34' }}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
) : (
  <div className="popular-container">
  <div className="popular-card-container">
    {popularManhwa.map((pop, index) => (
      <Link
        id="card"
        className="popular-manhwa-card"
        key={index}
        to={`/manhwa/${pop.link.split('/')[4]}`}
      >
          <div
      className="popular-image"
      style={{
        width: "100%",
        height: "150px",
        backgroundImage: `url("${pop.imageSrc}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      data-index={`#${index + 1}`}
    >
        <div className="popular-image-icon">
        <FontAwesomeIcon icon={faFire} />
      </div>
    </div>

        <div className="card-body d-flex flex-column align-items-center">
          <p className="popular-title text-center text-decoration-none text-white">
            {pop.title}
          </p>
          <p className="popular-chapter text-center text-decoration-none text-white">
            {pop.chapter}
          </p>
        </div>
      </Link>
    ))}
  </div>
</div>

)}
<GoogleAds/>

<p className="text-start text-white mt-4 fs-3"><b>Genre</b> List ({genreList.genres?.length})</p>
{loading ? (
  <div className='container d-flex justify-content-center align-items-center' style={{ width: '100%', height: '100px' }}>
    <Spinner animation="border" role="status" style={{ color:'#A41E34' }}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
) : (
  <div>
    <div className="container-genre">
      <div className="genre-row">
        {Array.isArray(genreList.genres) && genreList.genres.map((gen, index) => (
          <div key={index} className="genre-item">
            <Link
              to={`/genre/${gen.label}`}
              className="text-white text-center genre-text text-decoration-none"
            >
              {gen.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  </div>
)}




 {/* NEW MANHWA */}
 <p className="text-start text-white fs-3 pt-3"><b>New</b> Manhwa Update</p>
      <div id='container-manhwalist' className="row d-flex justify-content-center align-items-center">
      <div className="row d-flex justify-content-start">
        {loading ? (
          <div className='container d-flex justify-content-center align-items-center' style={{ width: '100%', height: '200px' }}>
            <Spinner animation="border" role="status" style={{ color:'#A41E34' }}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          newManhwa.map((manhwa, index) => (
            <Link
              id="card"
              className="col-sm-2 rounded d-flex flex-column justify-content-start align-items-center p-0"
              key={index}
              style={{ width: '30%', height: '200px', margin: '5px', overflow: 'hidden' }}
              to={`/manhwa/${manhwa.link.split('/')[4]}`}
            >
              <div
                className="row card-newmanhwa"
                style={{
                  width: '100%',
                  height: '150px',
                  backgroundImage: `url("${manhwa.imageSrc}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              ></div>
              <div className="card-body d-flex flex-column align-items-center">
                <p
                  className="newmanhwa-title text-center text-decoration-none text-white"
                >
                  {manhwa.title}
                </p>
              </div>
            </Link>
          ))
        )}
        </div>
      </div>

      <GoogleAds/>


      {/* ONGOING MANHWA */}
      <p className="text-start text-white fs-3 pt-3"><b>On Going</b> Manhwa</p>
      {loading ? (
  <div className='container d-flex justify-content-center align-items-center' style={{ width: '100%', height: '200px' }}>
    <Spinner animation="border" role="status" style={{ color:'#A41E34' }}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
) : (
  <div className="popular-container">
  <div className="popular-card-container">
    {ongoingManhwa.map((pop, index) => (
      <Link
        id="card"
        className="popular-manhwa-card"
        key={index}
        to={`/manhwa/${pop.link.split('/')[4]}`}
      >
          <div
      className="popular-image"
      style={{
        width: "100%",
        height: "150px",
        backgroundImage: `url("${pop.imageUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      data-index={`#${index + 1}`}
    >
    </div>

        <div className="card-body d-flex flex-column align-items-center">
          <p className="popular-title text-center text-decoration-none text-white">
            {pop.title}
          </p>
          <p className="popular-chapter text-center text-decoration-none text-white">
            {pop.chapter}
          </p>
        </div>
      </Link>
    ))}
  </div>
</div>

)}

</div>

  );
};

export default ManhwaList;
