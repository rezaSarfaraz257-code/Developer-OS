export default function FavoritesPage({
  setPage,
  favoriteTools,
  toggleFavorite,
  setSelectedTool,
}) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Favorites</span>
          <h2>Saved tools</h2>
        </div>
        <button
          type="button"
          className="ghost-button"
          onClick={() => setPage("explore")}
        >
          Explore tools
        </button>
      </div>

      {favoriteTools.length === 0 ? (
        <div className="empty-box">
          No favorite tools yet. Save a few from the tool library.
        </div>
      ) : (
        <div className="tool-grid explore-grid">
          {favoriteTools.map((tool) => (
            <article key={tool.id} className={`tool-card ${tool.accent}`}>
              <div className="tool-top">
                <span className="tool-tag">{tool.tag}</span>
                <button
                  type="button"
                  className="icon-button active-favorite"
                  onClick={() => toggleFavorite(tool)}
                >
                  ♥
                </button>
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setSelectedTool(tool);
                  setPage("tool");
                }}
              >
                View details →
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
