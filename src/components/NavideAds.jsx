import React, { useEffect } from 'react';

const NativeAds = () => {
  useEffect(() => {
    // Create the script element for the ad
    const script = document.createElement('script');
    script.async = true;
    script.src = "//pl24123036.cpmrevenuegate.com/2fcd62072a1e7925083e385969f8d372/invoke.js";
    script.setAttribute('data-cfasync', 'false');

    // Append the script to the container
    const adContainer = document.getElementById('cpm-revenue-gate-ad');
    adContainer.appendChild(script);

    // Cleanup when the component is unmounted
    return () => {
      if (adContainer.contains(script)) {
        adContainer.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      id="cpm-revenue-gate-ad"
      style={{
        display: 'block',
        width: 'auto', // Set to 'auto' to accommodate ad dimensions
        height: 'auto', // Set to 'auto' to accommodate ad dimensions
        margin: '0 auto',
      }}
    />
  );
};

export default NativeAds;
