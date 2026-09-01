import devlogo from "../assets/devlogo.png";
import "./Navbar.css";

export default function NavBar({ setPage, isAuthenticated, handleLogout }) {
  return (
    <header className="topbar">
      {/* Brand */}
      <button
        title="Home"
        type="button"
        className="brand-button"
        onClick={() => setPage("home")}
      >
        <div className="brand-wrap">
          <div className="brand-mark">
            <img src={devlogo} alt="Developer OS"  />
          </div>

          <div className="brand-text">
            <span className="brand-kicker">Workspace</span>
            <strong>Developer OS</strong>
          </div>
        </div>
      </button>

      {/* Main Navigation */}
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

      {/* Actions */}
      <div className="nav-actions">
        <button
          type="button"
          className="primary-button"
          onClick={() => setPage("explore")}
        >
          Get started
        </button>
      </div>

      {/* Account Dropdown */}
      <div className="dropdown">
        <button type="button" className="main" aria-label="Open account menu">
          👤 Account
        </button>

        <div className="dropdown-content">
          <button type="button" onClick={() => setPage("profile")}>
            Profile
          </button>

          <button type="button" onClick={() => setPage("dashboard")}>
            Dashboard
          </button>

          <button type="button" onClick={() => setPage("favorites")}>
            Favorites
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              className="ghost-button logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="ghost-button"
              onClick={() => setPage("auth")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
