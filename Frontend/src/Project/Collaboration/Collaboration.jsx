export default function CollaborationPage({ setPage }) {
  const collaborators = [
    { name: "Ava", role: "Product lead", status: "Online" },
    { name: "Leo", role: "Frontend", status: "Reviewing" },
    { name: "Nora", role: "Backend", status: "Syncing" },
  ];

  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow" style={{ color: "#34d399", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>Collaboration</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>Team collaboration</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#9cb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, marginBottom: 14 }}>Active teammates</div>
          <div style={{ display: "grid", gap: 12 }}>
            {collaborators.map((person) => (
              <div key={person.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(2, 6, 23, 0.75)", border: "1px solid rgba(148, 163, 184, 0.16)", borderRadius: 14, padding: "12px 14px" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{person.name}</div>
                  <div style={{ color: "#9cb0c8", marginTop: 4 }}>{person.role}</div>
                </div>
                <span style={{ color: "#34d399", fontWeight: 700 }}>{person.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#9cb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, marginBottom: 14 }}>Shared notes</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#dfeafc", display: "grid", gap: 10, lineHeight: 1.8 }}>
            <li>Review current sprint priorities together.</li>
            <li>Share onboarding notes for new tooling.</li>
            <li>Collect feedback on workflow clarity.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
