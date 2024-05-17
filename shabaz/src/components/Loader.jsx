import React, { useState, useEffect } from 'react';
import Home from "./Home";
import About from "./About";
import Navbar from "./Navbar";
import LSTM from "./LSTM";
import Sarima from "./Sarima";
import Hybrid from "./Hybrid";
import Arima from "./Arima";
import Ann from "./Ann";
import ETS from "./ETS";
import Prophet from "./Prophet";
import { Routes, Route } from "react-router-dom";
import './loading.css';
import "../App.css";

function Loader1({ fadeOut }) {
  return (
    <div className="loading-page">
      <div className={`loader ${fadeOut ? 'fade-out' : ''}`}></div>
    </div>
  );
}

function Loader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000); // Start fading out after 2 seconds

    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // Hide loader after 3 seconds

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className='fade-in'>
      {loading ? (
        <Loader1 fadeOut={fadeOut} />
      ) : (
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/LSTM" element={<LSTM />} />
            <Route path="/Sarima" element={<Sarima />} />
            <Route path="/Hybrid" element={<Hybrid />} />
            <Route path="/Arima" element={<Arima />} />
            <Route path="/Ann" element={<Ann />} />
            <Route path="/ETS" element={<ETS />} />
            <Route path="/Prophet" element={<Prophet />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default Loader;
