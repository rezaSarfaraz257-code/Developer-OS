export default function AdvancedDashboardPage({ setPage }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Advanced</span>
          <h2>Advanced dashboard</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div>
        <p>Advanced metrics, visualizations, and filters will appear here.</p>
      </div>
    </main>
  );
}
