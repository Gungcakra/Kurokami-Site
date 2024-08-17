import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import BottomNavBar from './components/BottomNavBar'; // Import the BottomNavBar
import 'bootstrap/dist/css/bootstrap.min.css';
import Jadwal from './components/Jadwal';
import SearchResults from './components/SearchResult';
import History from './components/BookMarks';
import GenreResults from './components/GenreResult';
import './assets/css/App.css'
import ManhwaList from './components/ManhwaList';
import DetailManhwa from './components/DetailManhwa';
import ReadChapter from './components/ReadChapter';
import Bookmarks from './components/BookMarks';
import { motion } from 'framer-motion';
const App = () => {
  const location = useLocation();
  
  // Determine if BottomNavBar should be shown
  const shouldShowBottomNavBar = ['/', '/jadwal', '/history', '/profile','/bookmark'].includes(location.pathname);

  return (
 
    <div id='app' style={{ paddingBottom: shouldShowBottomNavBar ? '60px' :  '0px'}}>
      <Routes>
        <Route path="/" element={<ManhwaList />} />
        <Route path="/jadwal" element={<Jadwal />} />
        <Route path="/manhwa/:id" element={<DetailManhwa />} />
        <Route path="/chapter/:chapterId" element={<ReadChapter />} />
        <Route path="/search/:query" element={<SearchResults />} />
        <Route path="/genre/:genreId" element={<GenreResults />} />
        <Route path="/bookmark" element={<Bookmarks />}/>
        <Route path="/history" element={<History />}/>
        <Route path="/profile" element={<div>Profile Page</div>} />
      </Routes>
      {shouldShowBottomNavBar && <BottomNavBar />}
    </div>
  );
};

// Wrap App in Router since we use useLocation
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
