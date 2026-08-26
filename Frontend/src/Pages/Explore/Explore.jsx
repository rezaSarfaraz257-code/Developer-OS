export default function ExplorePage({
  setPage,
  setSelectedTool,
  favoriteTools,
  toggleFavorite,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) {
  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      selectedCategory === "All" || tool.tag === selectedCategory;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      tool.name.toLowerCase().includes(normalizedSearch) ||
      tool.description.toLowerCase().includes(normalizedSearch) ||
      tool.tag.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Explore</span>
          <h2>Tool library</h2>
        </div>
        <button
          type="button"
          className="ghost-button"
          onClick={() => setPage("home")}
        >
          Back home
        </button>
      </div>

      <div className="filter-toolbar">
        {filterCategories.map((category) => (
          <button
            type="button"
            key={category}
            className={`chip ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="search-bar compact-search">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search tools..."
          aria-label="Search tools"
        />
      </div>

      {filteredTools.length === 0 ? (
        <div className="empty-box">
          No tools match the current search and category filters.
        </div>
      ) : (
        <div className="tool-grid explore-grid">
          {filteredTools.map((tool) => {
            const isFavorite = favoriteTools.some(
              (item) => item.id === tool.id,
            );

            return (
              <article key={tool.id} className={`tool-card ${tool.accent}`}>
                <div className="tool-top">
                  <span className="tool-tag">{tool.tag}</span>
                  <button
                    type="button"
                    className={`icon-button ${isFavorite ? "active-favorite" : ""}`}
                    aria-label={`Save ${tool.name}`}
                    onClick={() => toggleFavorite(tool)}
                  >
                    {isFavorite ? "♥" : "♡"}
                  </button>
                </div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="tool-meta">
                  <span>Popular</span>
                  <span>{tool.rating}/5</span>
                </div>
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
            );
          })}
        </div>
      )}
    </main>
  );
}
