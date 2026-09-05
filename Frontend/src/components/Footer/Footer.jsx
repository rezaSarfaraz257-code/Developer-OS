import "./Footer.css";
import facebook from "../../assets/facebook.jpg";
import instagram from "../../assets/instagram.png";
import telegram from "../../assets/telegram.png";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-branding">
          <strong>Developer OS</strong>
          <p>Build with clarity. Stay in flow.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
          >
            <img src={facebook} alt="Facebook" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <img src={instagram} alt="Instagram" />
          </a>
          <a
            href="https://github.com/rezaSarfaraz257-code/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <img src={telegram} alt="Telegram" />
          </a>
          <a
            href="https://github.com/rezaSarfaraz257-code/"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
