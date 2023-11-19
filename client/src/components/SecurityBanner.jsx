import React, { useState, useEffect } from 'react';
import './css/SecurityBanner.css';

const SecurityBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [securityTips, setSecurityTips] = useState([
    'Using strong, unique passwords enhances your online security.',
    'Regularly update your passwords to stay ahead of potential threats.',
    'Be cautious of phishing emails and verify the sender before clicking on links.',
    'Keep your software and operating system up to date to patch security vulnerabilities.',
    'Use a reputable antivirus program to protect against malware and viruses.',
    'Review your privacy settings on social media to control the information you share.',
    'Backup your important data regularly to prevent data loss in case of a security incident.',
    'Avoid using public Wi-Fi for sensitive transactions; use a virtual private network (VPN) instead.',
    'Educate yourself on common cybersecurity threats and stay informed about the latest security practices.',
  ]);
  const [currentTip, setCurrentTip] = useState('');

  const handleClose = () => {
    setIsVisible(false);
    const now = new Date().getTime();
    sessionStorage.setItem('securityBannerClosedTime', now.toString());
  };

  useEffect(() => {
    const storedVisibility = sessionStorage.getItem('securityBannerVisible');
    const closedTime = sessionStorage.getItem('securityBannerClosedTime');

    if (storedVisibility === 'false') {
      if (!closedTime || (new Date().getTime() - parseInt(closedTime)) >= 15000) {
        setCurrentTip(getRandomTip());
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip(getRandomTip());
      setIsVisible(true);
    }, 15000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * securityTips.length);
    return securityTips[randomIndex];
  };

  return (
    isVisible && (
      <div className="security-banner">
        <p>{currentTip}</p>
        <button className="close-button" onClick={handleClose}>
          X
        </button>
      </div>
    )
  );
};

export default SecurityBanner;
