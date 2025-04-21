import React, { useEffect } from 'react';
import './Loader.css';

const Loader = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const loaderContainer = document.querySelector('.loader-container');
      if (loaderContainer) {
        loaderContainer.classList.add('fade-out');
      }
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loader-container">
      <div className="loader">
        <span className="hour"></span>
        <span className="min"></span>
        <span className="circle"></span>
      </div>
    </div>
  );
};

export default Loader;