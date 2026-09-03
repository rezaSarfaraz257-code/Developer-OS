export default function ProductionPage({ setPage }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Production</span>
          <h2>Production</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div>
        <p>Deployment, CI and production readiness checklists go here.</p>
      </div>
    </main>
  );
}
