export default function TagsPage({ setPage, tags = [] }) {
  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow" style={{ color: "#fbbf24", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>Tags</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>Tags & categories</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {tags.length === 0 ? (
          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px dashed rgba(148, 163, 184, 0.25)", borderRadius: 18, padding: 20, color: "#dfeafc", width: "100%" }}>
            No tags defined yet. Add categories like Frontend, Backend, AI, Design, and DevOps.
          </div>
        ) : (
          tags.map((tag, index) => (
            <button key={tag.id || tag.name || `tag-${index}`} style={{ border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 999, background: index % 2 === 0 ? "rgba(103, 232, 249, 0.12)" : index % 3 === 0 ? "rgba(52, 211, 153, 0.12)" : "rgba(167, 139, 250, 0.12)", color: "#e5eefb", padding: "9px 14px", fontWeight: 700 }}>
              {tag.name || "Untitled tag"}
            </button>
          ))
        )}
      </div>
    </main>
  );
}
