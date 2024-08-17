import React from 'react';
import '../assets/css/DetailSkeleton.css'; // Ensure this import points to your CSS file

const DetailSkeleton = () => {
    return (
        <div className="skeleton-container">
            <div className="skeleton-parallax"></div>
            <div className="skeleton-body">
                <div className="skeleton-title skeleton-item"></div>
                <div className="skeleton-rating skeleton-item"></div>
                <div className="skeleton-synopsis skeleton-item"></div>
                <div className="skeleton-genres skeleton-item"></div>
                <div className="skeleton-details skeleton-item"></div>
                <div className="skeleton-episodes skeleton-item"></div>
            </div>
        </div>
    );
};

export default DetailSkeleton;
