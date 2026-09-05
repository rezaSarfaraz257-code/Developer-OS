export default function AIAssistantPage({ setPage }) {
  const suggestions = [
    "Summarize project status from recent task updates.",
    "Draft a release checklist for the current milestone.",
    "Suggest the next 3 workflow improvements based on activity.",
  ];

  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow" style={{ color: "#a78bfa", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>AI</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>AI assistant</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 18 }}>
        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#9cb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, marginBottom: 12 }}>Assistant</div>
          <div style={{ background: "rgba(2, 6, 23, 0.9)", borderRadius: 14, border: "1px solid rgba(148, 163, 184, 0.2)", padding: 16, minHeight: 150, color: "#dfeafc", lineHeight: 1.8 }}>
            “Based on the current project state, the next best move is to tighten the workflow layer and add reusable resource templates before expanding collaboration.”
          </div>
        </div>

        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#9cb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, marginBottom: 12 }}>Smart suggestions</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#dfeafc", display: "grid", gap: 10, lineHeight: 1.7 }}>
            {suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
