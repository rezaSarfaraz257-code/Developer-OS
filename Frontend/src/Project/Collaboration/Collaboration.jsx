export default function CollaborationPage({ setPage }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Collaboration</span>
          <h2>Collaboration</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div>
        <p>Team features, sharing and comments will be added here.</p>
      </div>
    </main>
  );
}
