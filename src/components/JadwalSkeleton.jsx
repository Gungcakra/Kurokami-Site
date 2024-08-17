import React from 'react';
import "../assets/css/JadwalSkeleton.css"; // Import the skeleton loader styles

const JadwalSkeleton = () => {
  return (
    <div className="skeleton-day">
      {/* Skeleton for the day title */}
      <div className="skeleton-title"></div>

      <div className="skeleton-cards">
        {/* Three skeleton cards for the anime list */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="skeleton-card" key={index}>
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JadwalSkeleton;
