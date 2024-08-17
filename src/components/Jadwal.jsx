import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../assets/css/Jadwal.css"; // Import the new CSS file
import JadwalSkeleton from '../components/JadwalSkeleton';

// Function to truncate the anime title
const truncateTitle = (title, maxWords) => {
  const words = title.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return title;
};

const Jadwal = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('https://cakr-anime-stream.vercel.app/api/jadwal/');
        setSchedule(response.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  
    const episodeOverlay = {

    }
    
  return (
    <div id="bg-jadwal" className="container-fluid">
      <h1 className="text-center text-white">Anime Schedule</h1>

      <div id="container-jadwal" className="row d-flex justify-content-center align-items-center">
        {loading ? (
          // Render skeleton loaders while loading
          Array.from({ length: 25 }).map((_, index) => (
            <div className="col-sm-2" key={index}>
              <JadwalSkeleton />
            </div>
          ))
        ) : (
          // Render the actual anime schedule
          schedule.map((daySchedule, dayIndex) => (
            <div key={dayIndex} className="mb-4 w-100">
              <h2 className="text-start text-white">{daySchedule.day}</h2>
              <div className="scroll-container">
                {daySchedule.animeList.map((anime, index) => (
                  <div
                    id="card-jadwal"
                    className="card-link rounded d-flex flex-column justify-content-start align-items-center p-0"
                    key={index}to={`/anime/${anime.url.split('/')[4]}`}
                  >
                    <div
                      className="row card-img-container"
                      style={{
                        backgroundImage: `url(${anime.imageUrl})`,
                      }}
                      data-ep={`${anime.episode}`}
                    ></div>
                    <div className="card-body d-flex flex-column align-items-center">
                      <p className="jadwal-title jadwal-title text-center text-decoration-none text-white m-0">
                        {truncateTitle(anime.title, 3)}
                      </p>
            
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Jadwal;
