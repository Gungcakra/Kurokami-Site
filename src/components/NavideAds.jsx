import React, { useEffect } from 'react';

const NativeAds = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//infantilecombination.com/b/X.VTszdEGSlR0VYYWvdEiXYGW_5/utZhXfIg/OeImN9nuuZ_UjlYkiPnTXU/1BM/TlMs5ONhzWQGt/NmT/UzxCMezLkn3JN/QQ";
    script.async = true;
    script.referrerPolicy = 'no-referrer-when-downgrade';

    // Append the script to the container div
    const adContainer = document.getElementById('adsterra-ad');
    adContainer.appendChild(script);

    // Clean up the script when the component is unmounted
    return () => {
      if (adContainer.contains(script)) {
        adContainer.removeChild(script);
      }
    };
  }, []);

  return (
    <ins
      id="adsterra-ad"
      style={{
        display: 'block',
        width: '100%',
        height: 'auto',
        textAlign: 'center',
      }}
    />
  );
};

export default NativeAds;
