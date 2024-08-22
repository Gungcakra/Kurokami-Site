// src/components/AdsterraAds.js

import React, { useEffect } from 'react';

const AdsterraAds = () => {
  useEffect(() => {
    // Check if the ad script is already added
    if (!document.getElementById('adsterra-script')) {
      // Create and add the ad configuration script
      const adConfig = document.createElement('script');
      adConfig.type = 'text/javascript';
      adConfig.id = 'adsterra-config';
      adConfig.innerHTML = `
        atOptions = {
          'key' : 'a925dcb7da316bd1552d759a1a50bbde',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;
      document.body.appendChild(adConfig);

      // Create and add the ad script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'adsterra-script';
      script.src = '//www.topcreativeformat.com/a925dcb7da316bd1552d759a1a50bbde/invoke.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Cleanup on component unmount
    return () => {
      const adConfig = document.getElementById('adsterra-config');
      const adScript = document.getElementById('adsterra-script');
      if (adConfig) document.body.removeChild(adConfig);
      if (adScript) document.body.removeChild(adScript);
    };
  }, []);

  return (
    <div className="adsterra-ads">
      
    </div>
  );
};

export default AdsterraAds;
