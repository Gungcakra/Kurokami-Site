// src/components/EpisodeSkeleton.js
import React from "react";
import "../assets/css/EpisodeSkeleton.css";

const EpisodeSkeleton = () => {
  return (
    <div className="episode-container">
      <div className="episode-meta">
        <div className="episode-player d-flex justify-content-center align-items-center skeleton-box">
          <div className="skeleton-iframe"></div>
        </div>
        <div className="col d-flex episode-detail">
          <div className="col-2 col-lg-2 col-md-2 col-sm-2 skeleton-thumbnail"></div>
          <div className="col-10 col-lg-10 col-md-10 col-sm-10 d-flex flex-column justify-content-center">
            <div className="container d-flex flex-column">
              <div className="col d-flex flex-column">
                <p className="skeleton-title skeleton-text"></p>
                <div className="col d-flex">
                  <p className="skeleton-episode-number skeleton-text"></p>
                  <p className="skeleton-release-date skeleton-text"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="skeleton-description skeleton-text"></p>
      </div>
    </div>
  );
};

export default EpisodeSkeleton;
