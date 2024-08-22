import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../assets/css/ReadChapter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faHome } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ReadChapter = () => {
  const { chapterId } = useParams();
  const [chapterData, setChapterData] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(chapterId);
  const [loading, setLoading] = useState(true);
  const [manhwaMoreDetail, setManhwaMoreDetail] = useState(null);
  const [manhwaDetail, setManhwaDetail] = useState([]);
  const [showNavbar, setShowNavbar] = useState(false);
  const manhwaId = useSelector((state) => state.manhwaId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://kurokami.vercel.app/api/chapter/${selectedChapter}`);
        const data = await response.json();
        setChapterData(data);
      } catch (error) {
        console.error('Error fetching chapter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedChapter]);

  useEffect(() => {
    const fetchManhwaDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://kurokami.vercel.app/api/manhwa-detail/${manhwaId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setManhwaDetail(data.chapters);
        setManhwaMoreDetail(data);
      } catch (error) {
        console.error('Error fetching manhwa details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManhwaDetail();
  }, [manhwaId]);

  useEffect(() => {
    if (chapterData && manhwaMoreDetail && manhwaMoreDetail.title) {
      addReadChapter(chapterData.title, manhwaMoreDetail.title);
    }
  }, [chapterData, manhwaMoreDetail]);

  const addReadChapter = (chapterTitle, manhwaTitle) => {
    const currentTime = new Date().toISOString();
    const readChapters = JSON.parse(localStorage.getItem('readChapters')) || [];
    const updatedReadChapters = readChapters.map(chapter =>
      chapter.chapterTitle === chapterTitle && chapter.manhwaTitle === manhwaTitle
        ? { ...chapter, time: currentTime }
        : chapter
    );

    if (!updatedReadChapters.find(chapter => chapter.chapterTitle === chapterTitle && chapter.manhwaTitle === manhwaTitle)) {
      updatedReadChapters.push({ chapterTitle, manhwaTitle, time: currentTime });
    }

    localStorage.setItem('readChapters', JSON.stringify(updatedReadChapters));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedChapter]);

  const handleImageClick = () => {
    setShowNavbar(!showNavbar);
  };

  const handleNavClick = (newChapterId) => {
    setSelectedChapter(newChapterId);
    setLoading(true);
    window.scrollTo(0, 0);
  };

  const handleSelect = (chapterLink) => {
    const chapterId = chapterLink.split('/')[3];
    setSelectedChapter(chapterId);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className='container d-flex justify-content-center align-items-center' style={{ width: '100%', height: '100vh', backgroundColor: '#0b0c0e' }}>
        <Spinner animation="border" role="status" style={{ color: '#A41E34' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container-read-chapter">
      {chapterData ? (
        <>
          <p className="text-center fs-2 mb-4 text-white p-2">{chapterData.title}</p>
          <p className="text-center fs-2 mb-4 text-white fs-5">Tap Gambar Untuk Info Chapter</p>
          <div className="d-flex flex-column align-items-center">
            {chapterData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Page ${index + 1}`}
                className="img-fluid"
                onClick={handleImageClick}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="container d-flex justify-content-center align-items-center" style={{ width: '100%', height: '100vh', backgroundColor: '#0b0c0e' }}>
          <Spinner animation="border" role="status" style={{ color: '#A41E34' }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      <nav className={`navbar fixed-bottom navbar-animated ${showNavbar ? 'show' : 'hide'}`}>
        <div className="container-fluid">
          <div className="container d-flex justify-content-center m-2">
            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle className="bg-dark text-white">
                {manhwaDetail.find(chapter => chapter.chapterLink.split('/')[3] === selectedChapter)?.chapterTitle || 'Select Chapter'}
              </Dropdown.Toggle>

              <Dropdown.Menu className="bg-dark custom-dropdown-menu">
                {manhwaDetail.map((chapter, index) => (
                  <Dropdown.Item className='text-white'
                    key={index}
                    eventKey={chapter.chapterLink}
                    active={chapter.chapterLink.split('/')[3] === selectedChapter}
                  >
                    {chapter.chapterTitle}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="container-fluid d-flex flex-column justify-content-center">
          <div className="row d-flex justify-content-center gap-3">
            {chapterData?.prevChapter ? (
              <span
                className="navbar-brand text-white"
                onClick={() => handleNavClick(chapterData.prevChapter.split('/')[3])}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
            ) : (
              <span
                className="navbar-brand text-white" style={{ opacity: '0.7' }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
            )}

            <Link className='navbar-brand' to={`/manhwa/${manhwaId}`}><FontAwesomeIcon className='text-white' icon={faHome} /></Link>

            {chapterData?.nextChapter ? (
              <span
                className="navbar-brand text-white"
                onClick={() => handleNavClick(chapterData.nextChapter.split('/')[3])}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            ) : (
              <span
                className="navbar-brand text-white" style={{ opacity: '0.7' }}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ReadChapter;
