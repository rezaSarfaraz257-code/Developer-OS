import "./Favorites.css";

export default function FavoritesPage({
  setPage,
  favoriteTools = [],
  toggleFavorite,
  setSelectedTool,
}) {
  const totalFavorites = favoriteTools.length;
  const savedCategories = new Set(favoriteTools.map((tool) => tool.tag).filter(Boolean));

  return (
    <main className="page-panel favorites-page">
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

      <div className="favorites-summary">
        <div className="favorite-stat">
          <span>Saved</span>
          <strong>{totalFavorites}</strong>
        </div>
        <div className="favorite-stat">
          <span>Categories</span>
          <strong>{savedCategories.size}</strong>
        </div>
        <div className="favorite-stat">
          <span>Status</span>
          <strong>{totalFavorites ? "Ready" : "Empty"}</strong>
        </div>
      </div>

      {favoriteTools.length === 0 ? (
        <div className="empty-state">
          <div>
            <h3>No favorite tools yet</h3>
            <p>Save a few from the tool library to build your personal developer stack.</p>
          </div>
        </div>
      ) : (
        <div className="favorite-list">
          {favoriteTools.map((tool) => (
            <article key={tool.id ?? tool.name} className="favorite-card">
              <div className="favorite-card-head">
                <span className="favorite-tag">{tool.tag}</span>
                <button
                  type="button"
                  className="icon-button active-favorite"
                  onClick={() => toggleFavorite(tool)}
                  aria-label={`Remove ${tool.name} from favorites`}
                >
                  ♥
                </button>
              </div>

              <h3>{tool.name}</h3>
              <p>{tool.description}</p>

              <div className="favorite-button-row">
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
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => toggleFavorite(tool)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
