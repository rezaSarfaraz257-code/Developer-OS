export default function TagsPage({ setPage, tags = [] }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Tags</span>
          <h2>Tags & Categories</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div className="tag-cloud">
        {tags.length === 0 ? (
          <div className="empty-box">No tags defined.</div>
        ) : (
          tags.map((t) => (
            <button key={t.id || t.name} className="chip">{t.name}</button>
          ))
        )}
      </div>
    </main>
  );
}
