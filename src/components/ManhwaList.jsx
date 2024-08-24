import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/css/ManhwaList.css";
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faStar,faSearch,faFire, faArrowLeft, faArrowRight, faClock } from '@fortawesome/free-solid-svg-icons';
import AdsterraAds from './AdsterraAds';
import NativeAds from './NavideAds';
import { setManhwaId } from '../store';
import { useDispatch } from 'react-redux';
const ManhwaList = () => {
  const [popularManhwa, setPopularManhwa] = useState([]);
  const [newManhwa, setNewManhwa] = useState([]);
  const [ongoingManhwa, setOnGoingManhwa] = useState([]);
  const [recommendManhwa, setRecommendManhwa] = useState([])
  const [genreList, setGenreList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFixed, setIsFixed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [mostRecentChapter, setMostRecentChapter] = useState(null);
  const dispatch = useDispatch();
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
        // console.log(result);
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
        // console.log(result);
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
        // console.log(filteredResult);
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
        // console.log(result);
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
        // console.log(result);
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
  const truncateTitle = (manhwaTitle) => {
    const maxLength = 30; // You can adjust the max length as needed
    if (manhwaTitle.length > maxLength) {
      return manhwaTitle.substring(0, maxLength) + '...';
    }
    return manhwaTitle;
  };

  // useEffect(() => {
  //   const container = containerRef.current;
  //   let scrollAmount = 0;
  //   let direction = 1; // 1 for right, -1 for left

  //   const autoScroll = () => {
  //     const maxScrollLeft = container.scrollWidth - container.clientWidth;

  //     // Change direction if the container has reached either end
  //     if (scrollAmount >= maxScrollLeft || scrollAmount <= 0) {
  //       direction *= -1;
  //     }

  //     scrollAmount += direction * 1; // Adjust the speed by changing the multiplier
  //     container.scrollLeft = scrollAmount;

  //     requestAnimationFrame(autoScroll);
  //   };

  //   autoScroll();

  //   return () => {
  //     // Cleanup the animation frame when the component unmounts
  //     cancelAnimationFrame(autoScroll);
  //   };
  // }, []);



  useEffect(() => {
    const getMostRecentChapter = () => {
      const savedChapters = JSON.parse(localStorage.getItem('savedChapters')) || [];

      if (savedChapters.length === 0) return null;

      // Sort by time and get the most recent chapter
      savedChapters.sort((a, b) => new Date(b.time) - new Date(a.time));

      return savedChapters[0]; // Return the most recent chapter
    };

    const chapter = getMostRecentChapter();
    setMostRecentChapter(chapter);
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
      return `${seconds} detik lalu`;
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
  return (
    <div id='bg-manhwalist' className="container-fluid">

<div className="container container-recommend p-2" >
  {recommendManhwa.map((rec, index) => (
    <div key={index} className="recommend-card-container">
      <div className="recommend-card-background" style={{ backgroundImage: `url("${rec.image}")` }}></div>
      <div className="recommend-card-content">
        <div className="left-side">
          <img src={rec.image} alt={rec.title} />
        </div>
        <div className="right-side">
          <p className="title fw-bold">{truncateTitle(rec.title)}</p>
          <p className="ratings"><FontAwesomeIcon icon={faStar} style={{ color:'gold' }}/> {rec.rating}</p>
          <Link className="button-read text-decoration-none text-white" to={`/manhwa/${rec.url.split('/')[4]}`}><FontAwesomeIcon icon={faEye} /> Read</Link>
        </div>
      </div>
    </div>
  ))}
</div>

<div className={`search-bar ${isFixed ? 'fixed' : ''} `}>
     <form onSubmit={handleSearch}>

     
      <div className="input-group d-flex justify-content-center align-items-center mt-2">
        <input
          type="text"
          className="form-control bg-dark text-light rounded"
          placeholder="Cari....."
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


    {mostRecentChapter ? (
      <div className=" d-flex flex-column justify-content-center">
        <p className="text-start text-white fs-4 pt-4"><b>Terakhir</b> Baca</p>
        <Link className="last-read-col p-2 m-1 bg-dark rounded d-flex flex-column text-decoration-none"to={`/chapter/${toSlug(mostRecentChapter.chapterTitle)}`} onClick={handleLinkClick(mostRecentChapter.manhwaTitle)}>
          <p className="text-start text-white m-0">{truncateTitle(mostRecentChapter.chapterTitle)}</p>
          <p className="text-white m-0"><FontAwesomeIcon icon={faClock} /> {formatTime(mostRecentChapter.time)}</p>
        </Link>
      </div>

      ) : (
        <div className="row">

        </div>
      )}

      {/* POPULAR MANHWA */}
      <p className="text-start text-white fs-3 pt-3"><b>Populer</b></p>
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
 <p className="text-start text-white fs-3 pt-3"><b>Update </b>Baru</p>
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
  id="card-newmanhwa"
  className="col-sm-2 rounded d-flex flex-column justify-content-start text-decoration-none align-items-center p-0"
  key={index}
  style={{ width: '30%', height: '200px', margin: '5px', overflow: 'hidden' }}
  to={`/manhwa/${manhwa.link.split('/')[4]}`}
>
  <div
    className="card-newmanhwa"
    style={{
      width: '100%',
      height: '150px',
      backgroundImage: `url("${manhwa.imageSrc}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  ></div>
  <div className="newmanhwa-card-body d-flex flex-column align-items-center p-2">
    <p className="newmanhwa-title text-white">{manhwa.title}</p>
    <p className="newmanhwa-rating text-white">{manhwa.chapters[0].chapterTitle}</p>
  </div>
</Link>


          ))
        )}
        </div>
      </div>


      {/* ONGOING MANHWA */}
      <div className="row d-flex pt-2">
      <div className="col-8"><p className="text-start text-white fs-3 pt-3"><b>On Going</b></p></div>
      <div className="col-4 d-flex justify-content-end">
      {/* <Link className="text-decoration-none text-white fs-4 pt-3">More <FontAwesomeIcon icon={faArrowRight} /></Link> */}
      </div>
      </div>
      {loading ? (
  <div className='container d-flex justify-content-center align-items-center' style={{ width: '100%', height: '200px' }}>
    <Spinner animation="border" role="status" style={{ color:'#A41E34' }}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
) : (
  <div className="popular-container pb-3">
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
<AdsterraAds/>

</div>

  );
};

export default ManhwaList;
