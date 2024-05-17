import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Loader from "./components/Loader";
import Arima from "./components/LSTM";
import Sarima from "./components/Sarima";
// import Arima from "./components/Arima";
import "./App.css";

function App() {
  return (
    <>
      <Loader />
    </>
  );
}

export default App;

