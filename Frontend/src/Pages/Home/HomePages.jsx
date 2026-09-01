import "./HomePage.css";

const filterCategories = [
  "All",
  "Frontend",
  "Backend",
  "AI",
  "DevOps",
  "Database",
];

export default function HomePage({
  setPage,
  setSelectedTool,
  setSelectedWorkflow,
  favoriteTools = [],
  toggleFavorite,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  tools = [],
  workflows = [],
  resources = [],
  recommendations = [],
}) {
  const stats = [
    { label: "Tools", value: "250+" },
    { label: "Workflows", value: "80+" },
    { label: "Resources", value: "120+" },
  ];

  return (
    <main className="page-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Developer ecosystem</span>

          <h1>Your developer Ecosystem, organized.</h1>

          <p>
            Find the tools, workflows, and knowledge you need to build faster,
            think clearer, and ship with confidence.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button large"
              onClick={() => setPage("explore")}
            >
              Explore tools
            </button>

            <button
              type="button"
              className="secondary-button large"
              onClick={() => setPage("resources")}
            >
              Browse resources
            </button>
          </div>

          <div className="stat-row">
            {stats.map((item) => (
              <div key={item.label} className="stat-box">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-topline">
            <span>Live stack</span>
            <span className="panel-dot" />
          </div>

          <div className="stack-card">
            <div className="mini-label">Current setup</div>

            <h3>React + Django + Docker</h3>

            <ul>
              <li>Frontend architecture</li>
              <li>API-first workflows</li>
              <li>Ship-ready environment</li>
            </ul>
          </div>

          <div className="score-grid">
            <div>
              <strong>92%</strong>
              <span>Focus</span>
            </div>

            <div>
              <strong>{favoriteTools.length}</strong>
              <span>Saved</span>
            </div>
          </div>
        </div>
      </section>

      <section className="search-section" id="explore">
        <div className="search-header">
          <div>
            <span className="eyebrow">Discover</span>
            <h2>Search your ecosystem</h2>
          </div>

          <button
            type="button"
            className="ghost-button"
            onClick={() => setPage("explore")}
          >
            Advanced filters
          </button>
        </div>

        <div className="search-bar">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            value={searchTerm || ""}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search tools, workflows, resources..."
            aria-label="Search"
          />
        </div>

        <div className="chip-row">
          {filterCategories.map((category) => (
            <button
              type="button"
              key={category}
              className={`chip ${selectedCategory === category ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(category);
                setPage("explore");
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Featured</span>
            <h2>Top tools</h2>
          </div>

          <button
            type="button"
            className="section-link"
            onClick={() => setPage("explore")}
          >
            View all
          </button>
        </div>

        <div className="tool-grid">
          {tools.map((tool) => {
            const isFavorite = favoriteTools.some(
              (item) => item.name === tool.name || item.id === tool.id,
            );

            return (
              <article
                key={tool.id}
                className={`tool-card ${tool.accent || ""}`}
              >
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
                  Open tool →
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section" id="workflows">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Playbooks</span>
            <h2>Developer workflows</h2>
          </div>

          <button
            type="button"
            className="section-link"
            onClick={() => setPage("workflows")}
          >
            Explore more
          </button>
        </div>

        <div className="workflow-grid">
          {workflows.map((workflow) => (
            <article key={workflow.id ?? workflow.title} className="workflow-card">
              <span className="workflow-level">{workflow.level}</span>

              <h3>{workflow.title}</h3>

              <p>{workflow.summary || workflow.steps}</p>

              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setSelectedWorkflow?.(workflow);
                  setPage("workflow-detail");
                }}
              >
                Open workflow →
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" id="resources">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Library</span>
            <h2>Learning resources</h2>
          </div>

          <button
            type="button"
            className="section-link"
            onClick={() => setPage("resources")}
          >
            Explore more
          </button>
        </div>

        <div className="resource-grid full-resource-grid">
          {resources.map((resource) => (
            <article key={resource.id ?? resource.title} className="resource-card">
              <span className="resource-type">{resource.type}</span>
              <h3>{resource.title}</h3>
              <small className="resource-category">{resource.category}</small>
              <p>{resource.description}</p>
              <button type="button" className="text-button" onClick={() => setPage("resources")}>
                Open resource →
              </button>
            </article>
          ))}
        </div>
      </section>

      {recommendations.length > 0 && (
        <section className="content-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Recommended</span>
              <h2>Focus areas</h2>
            </div>
          </div>

          <div className="recommendation-list">
            {recommendations.map((item) => (
              <span key={item} className="recommendation-pill">
                {item}
              </span>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}