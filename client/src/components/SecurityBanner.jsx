import React, { useState, useEffect  } from 'react';
import './css/SecurityBanner.css';

const SecurityBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('securityBannerVisible', 'false');
  };

  useEffect(() => {
    const storedVisibility = sessionStorage.getItem('securityBannerVisible');
    if (storedVisibility === 'false') {
      setIsVisible(false);
    }
  }, []);

  return (
    isVisible && (
      <div className="security-banner">
        <p>Stay Secure! Did you know that using strong, unique passwords for each of your accounts can significantly improve your online security?</p>
        <button className="close-button" onClick={handleClose}>
          X
        </button>
      </div>
    )
  );
};

export default SecurityBanner;