export default function WorkflowsPage({
  setPage,
  setSelectedWorkflow,
  workflowData,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) {
  const filteredWorkflows = workflowData.filter((workflow) => {
    const matchesCategory =
      selectedCategory === "All" ||
      workflow.level === selectedCategory ||
      workflow.title.includes(selectedCategory);
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      workflow.title.toLowerCase().includes(normalizedSearch) ||
      workflow.summary.toLowerCase().includes(normalizedSearch) ||
      workflow.steps.some((step) =>
        step.toLowerCase().includes(normalizedSearch),
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Workflows</span>
          <h2>Developer playbooks</h2>
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
          placeholder="Search workflows..."
          aria-label="Search workflows"
        />
      </div>

      {filteredWorkflows.length === 0 ? (
        <div className="empty-box">
          No workflows match the current search and category filters.
        </div>
      ) : (
        <div className="workflow-library-grid">
          {filteredWorkflows.map((workflow) => (
            <article key={workflow.id} className="workflow-library-card">
              <div className="workflow-card-top">
                <span className="workflow-level">{workflow.level}</span>
                <span className="workflow-duration">{workflow.duration}</span>
              </div>
              <h3>{workflow.title}</h3>
              <p>{workflow.summary}</p>
              <div className="workflow-steps">
                {workflow.steps.map((step) => (
                  <span key={step} className="workflow-step">
                    {step}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setSelectedWorkflow(workflow);
                  setPage("workflow-detail");
                }}
              >
                Open playbook →
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
