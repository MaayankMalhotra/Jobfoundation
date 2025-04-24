// src/components/Loader.jsx
import React from 'react';


const Loader = ({ message = "Loading job opportunities..." }) => {
  return (
    <div className="loader-wrapper">
      <div className="loader-spinner"></div>
      <p className="loader-text">{message}</p>
    </div>
  );
};

export default Loader;
