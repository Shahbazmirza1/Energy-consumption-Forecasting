import React from "react";
import bgVideo from "../../Img/line.mp4";
import "./Home.css";
import Footer from './Footer.jsx'

function Home() {
  return (
    <>
      <div className="home-container">
        <video className="bg-vid" autoPlay loop muted playsInline>
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="container">
          <form className="glass" action="/submit" method="POST">
            <p>Attach your CSV below</p>
            <label htmlFor="file-input" className="custom-file-input">
              <div className="box"></div>
              <input id="file-input" type="file" accept=".csv, .txt" required />
            </label>
            <button type="submit" className="btn-upload">Submit</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
