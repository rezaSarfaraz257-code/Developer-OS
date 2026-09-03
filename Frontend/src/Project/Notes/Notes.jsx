export default function NotesPage({ setPage, notes = [] }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Notes</span>
          <h2>Project notes</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div>
        {notes.length === 0 ? (
          <div className="empty-box">No notes yet.</div>
        ) : (
          <div className="notes-list">
            {notes.map((n) => (
              <article key={n.id} className="note-card">
                <h3>{n.title || 'Untitled'}</h3>
                <p>{n.content}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
