// Loader.js
import React from "react";
import "./loader.css";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="loader">
        <span className="hour" />
        <span className="min" />
        <span className="circel" />
      </div>
    </div>
  );
};

export default Loader;
