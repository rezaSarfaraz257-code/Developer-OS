export default function ProjectDetailPage({ setPage, project }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Project</span>
          <h2>{project?.title || "Project detail"}</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <section>
        <p>{project?.description || "No description yet."}</p>
      </section>
    </main>
  );
}
