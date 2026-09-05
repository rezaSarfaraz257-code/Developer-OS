export default function OverviewPage({ setPage, project = {} }) {
  const metrics = [
    { label: "Health", value: "92%", tone: "#67e8f9" },
    { label: "Velocity", value: "+18%", tone: "#34d399" },
    { label: "Risk", value: "Low", tone: "#a78bfa" },
  ];

  const highlights = [
    "Core product backlog is clearly defined.",
    "Frontend and backend are aligned around the developer workspace concept.",
    "The next phase is focused on workflows, resources, and collaboration.",
  ];

  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow" style={{ color: "#67e8f9", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>Overview</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>Project overview</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
        {metrics.map((metric) => (
          <div key={metric.label} style={{ background: "rgba(15, 23, 42, 0.85)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: "18px 16px" }}>
            <div style={{ color: "#9cb0c8", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>{metric.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: metric.tone }}>{metric.value}</div>
          </div>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 18 }}>
        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 20, padding: 20 }}>
          <div style={{ color: "#9cb0c8", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Summary</div>
          <p style={{ margin: 0, color: "#dfeafc", lineHeight: 1.7 }}>
            {project?.description || "Developer OS is a digital workspace for managing tools, workflows, references, projects, and engineering context in a single ecosystem."}
          </p>
        </div>

        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 20, padding: 20 }}>
          <div style={{ color: "#9cb0c8", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Highlights</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#dfeafc", display: "grid", gap: 10, lineHeight: 1.6 }}>
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
