export default function ResourcesPage({
  setPage,
  resourceData,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) {
  const filteredResources = resourceData.filter((resource) => {
    const matchesCategory =
      selectedCategory === "All" ||
      resource.category === selectedCategory ||
      resource.type === selectedCategory;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      resource.title.toLowerCase().includes(normalizedSearch) ||
      resource.description.toLowerCase().includes(normalizedSearch) ||
      resource.category.toLowerCase().includes(normalizedSearch) ||
      resource.type.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Resources</span>
          <h2>Developer library</h2>
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
          placeholder="Search resources..."
          aria-label="Search resources"
        />
      </div>

      {filteredResources.length === 0 ? (
        <div className="empty-box">
          No resources match the current search and category filters.
        </div>
      ) : (
        <div className="resource-grid full-resource-grid">
          {filteredResources.map((resource) => (
            <article key={resource.id} className="resource-card">
              <span className="resource-type">{resource.type}</span>
              <h3>{resource.title}</h3>
              <small className="resource-category">{resource.category}</small>
              <p>{resource.description}</p>
              <button type="button" className="text-button">
                Open resource →
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
