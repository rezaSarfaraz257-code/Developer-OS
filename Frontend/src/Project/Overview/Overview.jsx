export default function OverviewPage({ setPage, project = {} }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Overview</span>
          <h2>Project overview</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <section>
        <p>{project?.description || "No overview available."}</p>
      </section>
    </main>
  );
}
