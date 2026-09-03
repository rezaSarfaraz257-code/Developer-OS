export default function SnippetsPage({ setPage, snippets = [] }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Snippets</span>
          <h2>Code snippets</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div>
        {snippets.length === 0 ? (
          <div className="empty-box">No snippets yet.</div>
        ) : (
          <div className="snippet-list">
            {snippets.map((s) => (
              <article key={s.id} className="snippet-card">
                <h3>{s.title}</h3>
                <small>{s.language}</small>
                <pre className="snippet-code">{s.code}</pre>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
