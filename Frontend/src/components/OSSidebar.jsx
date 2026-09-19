const navigationGroups = [
  ["CORE", [["Dashboard", "dashboard", "D"]]],
  ["BUILD", [["Projects", "dashboard", "P"], ["Tasks", "tasks", "T"], ["Workflows", "workflows", "W"]]],
  ["KNOW", [["Resources", "resources", "R"], ["Tools", "explore", "TL"], ["Saved", "favorites", "S"]]],
  ["CONNECT", [["GitHub", "github", "G"], ["AI Core", "ai", "AI"]]],
  ["SYSTEM", [["Activity", "activity", "A"], ["Analytics", "advanced", "AN"], ["Settings", "profile", "ST"]]],
];

export default function OSSidebar({ page, onNavigate, isAuthenticated, onLogout }) {
  return (
    <aside className="os-sidebar" aria-label="Developer OS navigation">
      <button type="button" className="os-sidebar__brand" onClick={() => onNavigate("home")} aria-label="Developer OS home">
        CO
      </button>

      {navigationGroups.map(([label, items]) => (
        <section className="os-sidebar__section" key={label}>
          <span className="os-sidebar__section-label">{label}</span>
          {items.map(([name, target, icon]) => (
            <button
              type="button"
              key={`${name}-${target}`}
              className={`os-sidebar__link ${page === target ? "is-active" : ""}`}
              onClick={() => onNavigate(target)}
              aria-label={name}
              title={name}
            >
              <span aria-hidden="true">{icon}</span>
              <em>{name}</em>
            </button>
          ))}
        </section>
      ))}

      <div className="os-sidebar__bottom">
        <span className="os-sidebar__state"><b>●</b><br />{isAuthenticated ? "Online" : "Guest"}</span>
        {isAuthenticated && (
          <button type="button" className="os-sidebar__link" onClick={onLogout} aria-label="Log out" title="Log out">
            <span aria-hidden="true">LO</span><em>Log out</em>
          </button>
        )}
      </div>
    </aside>
  );
}
