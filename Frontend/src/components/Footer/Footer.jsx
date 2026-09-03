import "./Footer.css";
import React, { useState } from "react";
import facebook from "../../assets/facebook.jpg";
import instagram from "../../assets/instagram.png";
import telegram from "../../assets/telegram.png";

const Footer = () => {
  return (
    <div>
      <footer className="site-footer">
        <div className="main-footer">
          <strong>Developer OS</strong>
          <p>Build with clarity. Stay in flow.</p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <a
            className="img"
            href="https://www.facebook.com/cyber reza 03"
            target="_blank"
          >
            <img src={facebook} alt="" />
          </a>
          <a
            className="img"
            href="https://www.instagram.com/cyber reza 03"
            target="_blank"
          >
            <img src={instagram} alt="" />
          </a>
          <a
            className="img"
            href="https://github.com/rezaSarfaraz257-code/"
            target="_blank"
          >
            <img src={telegram} alt="" />
          </a>
          <a href="https://github.com/rezaSarfaraz257-code/">GitHub</a>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
