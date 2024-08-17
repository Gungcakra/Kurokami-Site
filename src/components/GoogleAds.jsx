import React, { useEffect, useRef } from 'react';

const GoogleAd = () => {
  const adRef = useRef(null);

  useEffect(() => {
    // Buat elemen script untuk memuat AdSense dengan atribut crossorigin
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7844442398132676';
    script.crossOrigin = 'anonymous'; // Tambahkan crossorigin="anonymous"
    document.body.appendChild(script);

    // Jalankan iklan setelah script dimuat dan elemen <ins> tersedia
    script.onload = () => {
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    };

    // Cleanup script saat komponen dilepas
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <ins ref={adRef}
           className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-format="fluid"
           data-ad-layout-key="-fj-2j-8w-6k+1ol"
           data-ad-client="ca-pub-7844442398132676"
           data-ad-slot="3178327799"></ins>
    </div>
  );
};

export default GoogleAd;
