import React, { useEffect } from 'react';

const AdsterraAds = () => {
  useEffect(() => {
    // Create the script element for ad options
    const scriptOptions = document.createElement('script');
    scriptOptions.type = 'text/javascript';
    scriptOptions.innerHTML = `
      atOptions = {
        'key': 'a925dcb7da316bd1552d759a1a50bbde',
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
      };
    `;

    // Create the script element for ad invocation
    const scriptInvoke = document.createElement('script');
    scriptInvoke.type = 'text/javascript';
    scriptInvoke.src = "//www.topcreativeformat.com/a925dcb7da316bd1552d759a1a50bbde/invoke.js";
    scriptInvoke.async = true;

    // Append scripts to the ad container
    const adContainer = document.getElementById('adsterra-ad');
    adContainer.appendChild(scriptOptions);
    adContainer.appendChild(scriptInvoke);

    // Cleanup when the component is unmounted
    return () => {
      if (adContainer.contains(scriptOptions)) {
        adContainer.removeChild(scriptOptions);
      }
      if (adContainer.contains(scriptInvoke)) {
        adContainer.removeChild(scriptInvoke);
      }
    };
  }, []);

  return (
    <div
      id="adsterra-ad"
      style={{
        display: 'block',
        width: '300px',
        height: '250px',
        margin: '0 auto',
        transform:'scale(0.8)'
      }}
    />
  );
};

export default AdsterraAds;
