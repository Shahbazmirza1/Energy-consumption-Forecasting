import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
// import Arima from './arima';
import "./navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for the dropdown

  return (
    <>
      <nav className="glass-nav">
        <Link to="/" className="Title">
        EcoForecast
        </Link>
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={menuOpen ? "open" : ""}>
          <li>
            <NavLink to="/Home">Home</NavLink>
          </li>
          <li>
            <NavLink to="/About">About us</NavLink>
          </li>
          <li onMouseLeave={() => setDropdownOpen(false)}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
              style={{ cursor: "pointer" }}
              aria-expanded={dropdownOpen}
            >
              Models
            </div>
            {dropdownOpen && (
              <ul className="dropDown">
                <li>
                  <NavLink to="/Arima"><p>ARIMA</p></NavLink>
                </li>
                <li>
                  <NavLink to="/Sarima"> <p>SARIMA</p> </NavLink>
                </li>
                <li>
                  <NavLink to="/module3"> <p>SVR</p> </NavLink>
                </li>
                <li>
                  <NavLink to="/ETS"> <p>ETS</p> </NavLink>
                </li>
                <li>
                  <NavLink to="/Hybrid"> <p>HYBRID</p> </NavLink>
                </li>
                <li>
                  <NavLink to="/Ann"> <p>ANN</p> </NavLink>
                </li>
                <li>
                  <NavLink to="/Prophet"> <p>PROPHET</p> </NavLink>
                </li>
                <li>
                  <NavLink to="/LSTM"> <p>LSTM</p> </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
