import { useState } from "react";
import devlogo from "../assets/devlogo.png";
import "./Navbar.css";

export default function NavBar({ setPage, isAuthenticated, handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const profileName = "Developer";
  const initials =
    profileName
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "D";

  return (
    <header className="topbar">
      <button
        title="Home"
        type="button"
        className="brand-button"
        onClick={() => setPage("home")}
      >
        <div className="brand-wrap">
          <div className="brand-mark">
            <img src={devlogo} alt="Developer OS" />
          </div>

          <div className="brand-text">
            <span className="brand-kicker">Workspace</span>
            <strong>Developer OS</strong>
          </div>
        </div>
      </button>

      <nav className="main-nav" aria-label="Main navigation">
        <button type="button" onClick={() => setPage("explore")}>
          Explore
        </button>

        <button type="button" onClick={() => setPage("workflows")}>
          Workflows
        </button>

        <button type="button" onClick={() => setPage("resources")}>
          Resources
        </button>
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          className="secondary-button nav-cta"
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={() => setPage("explore")}
        >
          Get started
        </button>
      </div>

      <div className="dropdown" onMouseLeave={() => setIsMenuOpen(false)}>
        <button
          type="button"
          className="main"
          aria-label="Open account menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {initials}
        </button>

        <div className={`dropdown-content ${isMenuOpen ? "open" : ""}`}>
          <button
            type="button"
            onClick={() => {
              setPage("profile");
              setIsMenuOpen(false);
            }}
          >
            Profile
          </button>

          <button
            type="button"
            onClick={() => {
              setPage("dashboard");
              setIsMenuOpen(false);
            }}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => {
              setPage("favorites");
              setIsMenuOpen(false);
            }}
          >
            Favorites
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              className="ghost-button logout-button"
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="ghost-button"
              onClick={() => {
                setPage("auth");
                setIsMenuOpen(false);
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
