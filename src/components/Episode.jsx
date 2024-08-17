import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/Episode.css";
import EpisodeSkeleton from "./EpisodeSkeleton";
import { App } from "@capacitor/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { motion, useAnimation } from "framer-motion";
import { faServer } from "@fortawesome/free-solid-svg-icons";
const Episode = () => {
  const { episodeId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [animeDetail, setAnimeDetail] = useState({});
  const [animeId, setAnimeId] = useState(null);
  const [iframeSrc, setIframeSrc] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('480p' || '480P');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState('Server 1');
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const dataAnime = `https://cakr-anime-stream.vercel.app/api/anime-details/${animeId}/`;

  const navigate = useNavigate();
  const currentEpisodeRef = useRef(null);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const { data } = await axios.get(
          `https://cakr-anime-stream.vercel.app/api/episode-details/${episodeId}/`
        );
        setEpisode(data);

        if (data && data.iframeURL) {
          const extractedAnimeId = data.iframeURL.animeUrl.split('/')[4];
          setAnimeId(extractedAnimeId);

          // Set iframeSrc for the default quality
          if (data.iframeURL.downloadLinks && data.iframeURL.downloadLinks.length > 0) {
            updateIframeSrc(data.iframeURL.downloadLinks, '480p' || '480P');
          } else {
            setIframeSrc(data.iframeURL.iframeSrc);
          }

          // Save the episode data to history
          saveEpisodeToHistory({
            episodeId,
            urlEpisode: episodeId,
            title: data.iframeURL.title,
            seriesTitle: data.iframeURL.seriesTitle,
            episodeNumber: data.iframeURL.episodeNumber,
            seriesImageUrl: data.iframeURL.seriesImageUrl,
            releaseDate: data.iframeURL.releaseDate,
            url: data.iframeURL.animeUrl,
            time:Date.now()
          });
        }
      } catch (error) {
        console.error('Error fetching episode details:', error);
      }
    };

    fetchEpisode();
  }, [episodeId]);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        if (animeId) {
          const { data } = await axios.get(dataAnime);
          setAnimeDetail(data);
        }
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    fetchAnimeDetail();
  }, [animeId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (currentEpisodeRef.current) {
      currentEpisodeRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }, [episodeId, animeDetail.episodes]);

  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await screen.orientation.lock("landscape");
      } catch (err) {
        console.error("Orientation lock error:", err);
      }
    };

    lockOrientation();

    return () => {
      screen.orientation.unlock();
    };
  }, []);

  useEffect(() => {
    const handleBackButton = () => {
      navigate(-1);
    };

    const removeListener = App.addListener("backButton", handleBackButton);

    return () => {
      removeListener.remove();
    };
  }, [navigate]);

  const capitalizeTitle = (title) => {
    let cleanedTitle = title.replace(/subtitle indonesia/gi, "");
    cleanedTitle = cleanedTitle.replace(/episode\s*\d*/gi, "");
    return cleanedTitle
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const saveEpisodeToHistory = (episodeData) => {
    const historyData = localStorage.getItem("viewedEpisodes");
    let viewedEpisodes = historyData ? JSON.parse(historyData) : [];

    // Check if the episode already exists in the history
    const episodeExists = viewedEpisodes.some(
      (ep) => ep.episodeId === episodeData.episodeId
    );

    if (!episodeExists) {
      // Add the new episode to the history
      viewedEpisodes.push(episodeData);

      // Save updated history back to local storage
      localStorage.setItem("viewedEpisodes", JSON.stringify(viewedEpisodes));
    }
  };

  const formatReleaseDate = (releaseDate) => {
    const release = new Date(releaseDate);
    const today = new Date();
    const diffInTime = today - release;
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

    if (diffInDays < 30) {
      if (diffInDays === 0) {
        return "Today";
      } else if (diffInDays === 1) {
        return "1 day ago";
      } else {
        return `${diffInDays} days ago`;
      }
    } else {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return release.toLocaleDateString(undefined, options);
    }
  };

  const truncateDescription = (description) => {
    if (description.length > 700) {
      return description.substring(0, 700) + "...";
    }
    return description;
  };

  const updateIframeSrc = (downloadLinks, quality) => {
    const selectedLink = downloadLinks.find(
      (link) => link.quality.toLowerCase() === quality.toLowerCase()
    );
    if (selectedLink) {
      setIframeSrc(selectedLink.iframeSrc);
      console.log(iframeSrc)
    }
  };

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
    if (episode && episode.iframeURL && episode.iframeURL.downloadLinks) {
      updateIframeSrc(episode.iframeURL.downloadLinks, quality);
    }
    setIsOverlayOpen(false); // Close overlay after selection
  };
  const handleServerChange = (server) => {
    setSelectedServer(server);
    if (episode && episode.iframeURL && episode.iframeURL.decodedIframes) {
        const selectedIframe = episode.iframeURL.decodedIframes.find(
            (svr) => svr.server === server
        );
        if (selectedIframe) {
            setIframeSrc(selectedIframe.iframeSrc);
        }
    }
    setIsOverlayOpen(false); // Close overlay after selection
};

  // Handle click event to prevent opening links in a new tab
  const handleLinkClick = (event) => {
    event.preventDefault(); // Prevent default link behavior
    const href = event.currentTarget.getAttribute("href");
    if (href) {
      navigate(href); // Use navigate to programmatically navigate
    }
  };



console.log(iframeSrc)
  if (!episode) {
    return (
      <motion.div 
        initial={{ y:100, opacity:0 }}
        animate={{ y:0, opacity:1 }}
        exit={{ y:100 }}
        transition={{ duration:0.3 }}
      >

      <div className="episode-container-skeleton">
        <EpisodeSkeleton />
      </div>
      </motion.div>
    );
  }
  return (
    <div className="episode-container">
      <div className="episode-meta">
        <div className="episode-player d-flex justify-content-center align-items-center">
          {iframeSrc && (
            <iframe
              className="episode-frame"
              src={iframeSrc}
              allowFullScreen
            ></iframe>
          )}
        </div>

        <div className="col d-flex episode-detail container mt-3">
          <div className="col-2 col-lg-2 col-md-2 col-sm-2">
            <img
              src={episode.iframeURL?.seriesImageUrl}
              alt={episode.iframeURL?.title}
              className="episode-thumbnail rounded"
            />
          </div>
          <div className="col-10 col-lg-10 col-md-10 col-sm-10 d-flex flex-column justify-content-center episode-details">
            <div className="container d-flex flex-column">
              <div className="col d-flex flex-column">
                <p className="episode-title text-white mb-2">
                  {capitalizeTitle(episode.iframeURL?.seriesTitle)}
                </p>
                <div className="col d-flex episode-info">
                  <p className="episode-info-text text-white">
                    Episode {episode.iframeURL?.episodeNumber}
                  </p>
                  
                  {/* <p className="episode-info-text text-white">
                    {(episode.iframeURL?.status)}
                  </p> */}
                  <p className="episode-info-text text-white">{episode.iframeURL?.status}</p>
                  <p class=" dropdown-toggle text-white episode-info-text" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon icon={faPlayCircle} />{selectedServer}
                    </p>
                    <ul class="dropdown-menu"
                    style={{
                          overflow: 'hidden', // Ensures content is hidden when collapsed
                          position: 'absolute',
                          width: '100px',
                          backgroundColor: '#393E46',
                          zIndex: 1000, // Ensure the dropdown appears above other content
                          padding: 0,
                          margin: 0,
                          color:'white',
                          borderRadius: '10px',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',}}
                         

                    >
                      {episode.iframeURL.decodedIframes.map((svr, index) => (
                          <li key={index}>
                            <button
                              className={`dropdown-item ${selectedServer === svr.server ? 'active bg-dark' : 'text-white'}`}
                              onClick={() => handleServerChange(svr.server)}
                            >
                              {svr.server}
                            </button>
                          </li>
                        ))}
                    </ul>
                  
                </div>

              {/* Render quality selection only if downloadLinks exist */}
             {/* Render quality button and overlay only if downloadLinks exist */}
             {episode.iframeURL.decodedIframes && episode.iframeURL.decodedIframes.length > 0 && (
              <div className="episode-list-container">
              <div className="episode-list d-flex flex-wrap justify-content-center">
          {animeDetail.episodes &&
              animeDetail.episodes.length > 0 &&
              animeDetail.episodes
                .slice()
                .reverse()
                .map((ep) => (
                  <Link
                    key={ep.url}
                    className={`episode-card text-decoration-none ${
                      ep.url.includes(episodeId) ? "current-episode" : ""
                    }`}
                    to={`/episode/${ep.url.replace(/^https:\/\/gojonime\.(com|ch)\//, "")}`}
                    onClick={handleLinkClick} // Attach click handler
                    ref={ep.url.includes(episodeId) ? currentEpisodeRef : null}
                  >
                    <strong>{ep.number}</strong>
                  </Link>
            ))}
        </div>
              </div>
             
)}

              </div>
            </div>
                <div className="container mt-2">
              
                </div>
          </div>
        </div>

        <div className="container mt-3">
        </div>
        
              {/* <div className="container">
                <video>
                  <source src={episode.iframeURL.title} />
                </video>
              </div> */}
        <div className="container mt-3">
          <p className="episode-description text-white">
            {truncateDescription(episode.iframeURL?.seriesDescription)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Episode;
