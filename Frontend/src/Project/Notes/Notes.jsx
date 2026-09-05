export default function NotesPage({ setPage, notes = [] }) {
  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow" style={{ color: "#8b5cf6", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>Notes</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>Project notes</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {notes.length === 0 ? (
          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px dashed rgba(148, 163, 184, 0.25)", borderRadius: 18, padding: 20, color: "#dfeafc" }}>
            No notes yet. Capture decisions, architecture notes, or product observations here.
          </div>
        ) : (
          notes.map((note) => (
            <article key={note.id || note.title} style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 18 }}>
              <div style={{ color: "#67e8f9", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{note.tag || "Note"}</div>
              <h3 style={{ margin: "0 0 10px", fontSize: 22 }}>{note.title || "Untitled"}</h3>
              <p style={{ margin: 0, color: "#dfeafc", lineHeight: 1.7 }}>{note.content || "No note content added yet."}</p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
