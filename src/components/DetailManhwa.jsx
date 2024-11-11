import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import "../assets/css/AnimeDetail.css"; // Ensure this path is correct
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faList, faBookmark, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DetailSkeleton from "./DetailSkeleton";
import { App } from "@capacitor/app";
import { Spinner } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setManhwaId } from "../store";
import { motion } from "framer-motion";
import AdsterraAds from "./AdsterraAds";

const removeWordFromTitle = (title) => {
  return title.replace(/nonton anime/gi, "").trim();
};

const DetailManhwa = () => {
  const { id } = useParams();
  const [manhwaDetails, setManhwaDetails] = useState(null);
  const [isDescending, setIsDescending] = useState(true); // State for sorting order
  const [isBookmarked, setIsBookmarked] = useState(false); // State for bookmark status
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const idManhwa = id; // Ensure idManhwa is correct
  const [readChapters, setReadChapters] = useState();
  // Scale state
  const [scale, setScale] = useState(1.1);
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const fetchManhwaDetail = async () => {
      try {
        const response = await fetch(`https://kurokami.vercel.app/api/manhwa-detail/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setManhwaDetails(result);
        console.log(result)
        
        // Check if this manhwa is already bookmarked
        const bookmarkedManhwa = JSON.parse(localStorage.getItem('bookmarkedManhwa')) || [];
        const isAlreadyBookmarked = bookmarkedManhwa.some(manhwa => manhwa.title === result.title);
        setIsBookmarked(isAlreadyBookmarked);
  
        // Get saved chapters for this manhwa
        // const savedChapters = getSavedChaptersByManhwaTitle(result.title);
        // setReadChapters(savedChapters);
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchManhwaDetail();
  }, [id]);
  

  const getSavedChaptersByManhwaTitle = (manhwaTitle) => {
    const savedChapters = JSON.parse(localStorage.getItem('savedChapters')) || [];
    const filteredChapters = savedChapters.filter(chapter => chapter.manhwaTitle === manhwaTitle);
    return filteredChapters;
  };
  
  const extractChapterNumber = (chapterNum) => {
    const match = chapterNum.match(/Chapter\s(\d+)/i);
    return match ? `Chapter ${match[1]}` : null;
  };

  // const isChapterRead = (chapterNum) => {
  //   const extractedChapterNum = extractChapterNumber(chapterNum);
  //   return readChapters.some(chapter => {
  //     const savedChapterNum = extractChapterNumber(chapter.chapterNum);
  //     return savedChapterNum === extractedChapterNum && chapter.manhwaTitle === manhwaDetails.title;
  //   });
  // };

  
  // Handle scroll effect
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const scaleFactor = Math.max(1, 1 + scrollPosition / 600);
    setScale(scaleFactor);
    
    // Set opacity based on scroll position
    const newOpacity = Math.min(1, scrollPosition / 200);
      setOpacity(newOpacity);
  };

  // BACK Button
  useEffect(() => {
    const handleBackButton = () => {
      navigate(-1); // Navigate back to the previous page
    };

    const removeListener = App.addListener("backButton", handleBackButton);

    return () => {
      removeListener.remove();
    };
  }, [navigate]);

  // Save idManhwa to Redux store
  useEffect(() => {
    dispatch(setManhwaId(idManhwa));
  }, [idManhwa, dispatch]);
  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const limitDetail = (title, charLimit = 10) => {
    return title.length > charLimit ? `${title.slice(0, charLimit)}...` : title;
  };

  const limitSynopsis = (text, wordLimit = 30) => {
    const cleanedText = text.replace(/<img[^>]*>/g, '').replace(/\n+/g, ' ').trim();
    const words = cleanedText.split(" ");
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(" ")}...` : cleanedText;
  };

  const handleBookmark = () => {
    const bookmarkedManhwa = JSON.parse(localStorage.getItem('bookmarkedManhwa')) || [];
    
    if (isBookmarked) {
      // Remove from bookmarks
      const updatedBookmarks = bookmarkedManhwa.filter(manhwa => manhwa.title !== manhwaDetails.title);
      localStorage.setItem('bookmarkedManhwa', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      toast.warning('Dihapus Dari Pustaka', { autoClose: 2000 });
    } else {
      // Add to bookmarks
      const manhwaToBookmark = {
        id: id,
        title: manhwaDetails.title,
        imageSrc: manhwaDetails.imageSrc,
        rating: manhwaDetails.rating,
        status: manhwaDetails.status,
        type: manhwaDetails.type,
        author: manhwaDetails.author,
        genres: manhwaDetails.genres,
        synopsis: manhwaDetails.synopsis
      };
      bookmarkedManhwa.push(manhwaToBookmark);
      localStorage.setItem('bookmarkedManhwa', JSON.stringify(bookmarkedManhwa));
      setIsBookmarked(true);
      toast.success('Telah Ditambah Ke Pustaka', { autoClose: 2000 });
    }
  };

  if (!manhwaDetails) {
    return (
      <div className='container d-flex justify-content-center align-items-center' style={{ width: '100%', height: '100vh', backgroundColor:'#0b0c0e' }}>
        <Spinner animation="border" role="status" style={{ color:'#A41E34' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  const sortedChapter = [...manhwaDetails.chapters].sort((a, b) => {
    // Fungsi untuk mengekstrak nomor dari judul chapter jika ada
    const extractNumber = (title) => {
      const match = title.match(/(\d+)/);
      return match ? parseInt(match[0], 10) : null;
    };
  
    // Ekstrak nomor dari judul
    const numberA = extractNumber(a.chapterNum);
    const numberB = extractNumber(b.chapterNum);
  
    // Tentukan prioritas pengurutan
    if (numberA !== null && numberB !== null) {
      // Kedua chapter memiliki nomor, urutkan secara numerik
      return isDescending ? numberB - numberA : numberA - numberB;
    } else if (numberA !== null) {
      // Hanya chapter A yang memiliki nomor, tempatkan A sebelum B
      return isDescending ? -1 : 1;
    } else if (numberB !== null) {
      // Hanya chapter B yang memiliki nomor, tempatkan B sebelum A
      return isDescending ? 1 : -1;
    } else {
      // Kedua chapter tidak memiliki nomor, urutkan secara default (misalnya berdasarkan judul)
      return isDescending ? b.chapterNum.localeCompare(a.chapterNum) : a.chapterNum.localeCompare(b.chapterNum);
    }
  });
  

  const totalChapter = manhwaDetails.chapters.length;


  // const addReadChapter = (chapterNum, manhwaTitle) => {
  //   dispatch(setManhwaId(idManhwa));
  //   const currentTime = new Date().toISOString(); // Save current time in ISO format
  //   const updatedReadChapters = readChapters.map(chapter => 
  //     chapter.chapterNum === chapterNum && chapter.manhwaTitle === manhwaTitle
  //       ? { ...chapter, time: currentTime }
  //       : chapter
  //   );
    
  //   // Check if chapterNum with manhwaTitle was not found and add it
  //   if (!updatedReadChapters.some(chapter => chapter.chapterNum === chapterNum && chapter.manhwaTitle === manhwaTitle)) {
  //     updatedReadChapters.push({ chapterNum, manhwaTitle, time: currentTime });
  //   }
    
  //   localStorage.setItem('readChapters', JSON.stringify(updatedReadChapters));
  //   setReadChapters(updatedReadChapters); // Update state
  // };
  
  
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
  
  

  // const removeReadChapter = (chapterNum, manhwaTitle) => {
  //   const updatedReadChapters = readChapters.filter(chapter => 
  //     !(chapter.chapterNum === chapterNum && chapter.manhwaTitle === manhwaTitle)
  //   );
    
  //   localStorage.setItem('readChapters', JSON.stringify(updatedReadChapters));
  //   setReadChapters(updatedReadChapters); // Update state
  // };
  
  // Function to check if a chapter has been read
  // const isChapterRead = (chapterNum) => {
  //   const readChapters = JSON.parse(localStorage.getItem('readChapters')) || [];
  //   const manhwaTitle = manhwaDetails.title;
  
  //   const manhwa = readChapters.find(item => item.manhwaTitle === manhwaTitle);
  //   return manhwa && manhwa.chapters.includes(chapterNum);
  // };
  
  return (
 
  
    <div className="detail-container">


    <div className="navigation-back" style={{ 
      opacity: opacity,  // Set opacity dynamically
            transition: 'opacity 0.3s ease'
     }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-back btn-link"
          style={{ 
            top: '10px', 
            left: '10px',
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
      </div>
      <ToastContainer />
      <div className="parallax-container">
        <img
          className="parallax-image"
          style={{ transform: `scale(${scale})` }}
          src={manhwaDetails.imageSrc}
          alt={manhwaDetails.title}
        />
        <div className="parallax-overlay"></div>
      </div>
      <div className="detail-body p-2">

        <p className="mb-2 text-white fs-2">
          {removeWordFromTitle(manhwaDetails.title)}
        </p>

        <div className="container d-flex gap-1">
          {manhwaDetails.rating && (
            <p className="fs-6 text-white rating">
              <FontAwesomeIcon icon={faStar} style={{ color: "#FFD369" }} />{" "}
              {manhwaDetails.rating}
            </p>
          )}
          <p className="text-white details-text">
            {manhwaDetails.status}
          </p>
          <p className="text-white details-text">{manhwaDetails.type}</p>
          <p className="text-white details-text">{limitDetail(manhwaDetails.author)}</p>
        </div>
        <div className="container d-flex justify-content-center flex-wrap gap-2">
          {manhwaDetails.genres.map((tag, index) => (
            <div
              key={index}
              className="d-flex flex-wrap"
            >
              <Link
                to={`/genre/${tag.genreName}`}
                className="genre-text text-decoration-none text-center text-white"
              >
                {tag.genreName}
              </Link>
            </div>
          ))}
        </div>
        <div className="container container-synopsis mt-3">
          <p className="text-white">
            {limitSynopsis(manhwaDetails.synopsis)}
          </p>
        </div>

        <p className="card-title fs-5 mt-4 text-white">Chapters ({totalChapter})</p>
        <div className="container d-flex gap-2">
          <button
            className="sort-button mb-3 mt-3 text-white p-2"
            onClick={() => setIsDescending(!isDescending)}
          >
            <FontAwesomeIcon icon={faList} />
          </button>
          <button
            className="sort-button mb-3 mt-3 text-white p-2"
            onClick={handleBookmark}
          >
            <FontAwesomeIcon icon={faBookmark} style={{ opacity: isBookmarked ? '1' : '0.3' }} />
          </button>
        </div>
        <div className="episode-list-card">
  <div className="episode-list-container">
  {sortedChapter.map((chapter, index) => {
        const updatedUrl = chapter.chapterLink.includes("komikstation.co")
          ? chapter.chapterLink.replace("https://komikstation.co/", "")
          : chapter.chapterLink;

        {/* const isRead = isChapterRead(chapter.chapterNum); */}
        return (
          <div
            key={index}
            className="col-12 col-md-6 episode-col"
          >
            <Link
              to={`/chapter/${updatedUrl}`}
              className="episode-link text-decoration-none"
            >
              <div className="d-flex episode-card-body">
                <div className="col-7 d-flex flex-column">
                  <strong>{chapter.chapterNum}</strong>
                  <p>{chapter.chapterDate}</p>
                </div>
                <div className="col d-flex align-items-center">
                  {/* {isRead && (
                    
                    <p className="text-white">
                    {chapter.time}
                    </p>
                  )} */}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
  </div>
</div>

{/* <AdsterraAds/> */}

      </div>
      
    </div>
  
  );
};

export default DetailManhwa;
