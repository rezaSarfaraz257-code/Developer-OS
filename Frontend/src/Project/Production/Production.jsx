export default function ProductionPage({ setPage }) {
  const checklist = [
    { label: "Security review", passed: true },
    { label: "Environment checks", passed: true },
    { label: "CI validation", passed: true },
    { label: "Release notes", passed: false },
  ];

  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow" style={{ color: "#fbbf24", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>Production</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>Production readiness</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#9cb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, marginBottom: 16 }}>Release checklist</div>
          <div style={{ display: "grid", gap: 12 }}>
            {checklist.map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(2, 6, 23, 0.7)", border: "1px solid rgba(148, 163, 184, 0.16)", borderRadius: 14, padding: "12px 14px" }}>
                <span>{item.label}</span>
                <span style={{ color: item.passed ? "#34d399" : "#fbbf24", fontWeight: 700 }}>{item.passed ? "OK" : "Pending"}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#9cb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, marginBottom: 16 }}>Release note</div>
          <p style={{ margin: 0, color: "#dfeafc", lineHeight: 1.8 }}>
            The current release is nearly ready. Environment validation and security checks are complete, while final documentation and release message updates remain the final focus.
          </p>
        </div>
      </section>
    </main>
  );
}
