export default function SnippetsPage({ setPage, snippets = [] }) {
  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow" style={{ color: "#f472b6", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>Snippets</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>Code snippets</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {snippets.length === 0 ? (
          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px dashed rgba(148, 163, 184, 0.25)", borderRadius: 18, padding: 20, color: "#dfeafc" }}>
            No snippets yet. Save reusable patterns, key commands, and utility snippets here.
          </div>
        ) : (
          snippets.map((snippet) => (
            <article key={snippet.id || snippet.title} style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 20 }}>{snippet.title || "Unnamed snippet"}</h3>
                <span style={{ color: "#67e8f9", border: "1px solid rgba(103, 232, 249, 0.25)", borderRadius: 999, padding: "6px 10px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em" }}>{snippet.language || "code"}</span>
              </div>
              <pre style={{ margin: 0, background: "rgba(2, 6, 23, 0.9)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 12, padding: 14, color: "#e5eefb", overflowX: "auto", lineHeight: 1.6 }}>
                {snippet.code || "// Add your reusable snippet here"}
              </pre>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
