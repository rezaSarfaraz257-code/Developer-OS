export default function NavBar({ setPage, isAuthenticated, handleLogout }) {
  <header className="topbar">
    <button
      title="Home"
      type="button"
      className="brand-button"
      onClick={() => setPage("home")}
    >
      <div className="brand-wrap">
        <div className="br=nd-mark">
          <Logo />
        </div>
        <div>
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
        className="primary-button"
        onClick={() => setPage("explore")}
      >
        Get started
      </button>
    </div>
    <div className="dropdown" aria-label="Main navigation">
      <button className="main">👤Account</button>
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
        <button type="button" onClick={() => setPage("auth")}>
          Login
        </button>
        {isAuthenticated ? (
          <button
            style={{ color: "red" }}
            type="button"
            className="ghost-button"
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
  </header>;
}
