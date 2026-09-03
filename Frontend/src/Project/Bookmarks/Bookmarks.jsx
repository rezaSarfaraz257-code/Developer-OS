export default function BookmarksPage({ setPage, bookmarks = [] }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Bookmarks</span>
          <h2>Bookmarks & Favorites</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div>
        {bookmarks.length === 0 ? (
          <div className="empty-box">No bookmarks yet.</div>
        ) : (
          <ul>
            {bookmarks.map((b) => (
              <li key={b.id || b.name}>{b.name || b.title}</li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
