export default function AdvancedDashboardPage({ setPage }) {
  const stats = [
    { label: "Momentum", value: "82%", tone: "#67e8f9" },
    { label: "Delivery", value: "7/10", tone: "#34d399" },
    { label: "Risk", value: "Low", tone: "#8b5cf6" },
    { label: "Focus", value: "High", tone: "#fbbf24" },
  ];

  const activity = [
    { name: "Product design", value: "92" },
    { name: "Backend work", value: "74" },
    { name: "Resource setup", value: "68" },
    { name: "Collaboration", value: "51" },
  ];

  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow" style={{ color: "#60a5fa", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>Advanced</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>Advanced dashboard</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 22 }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: "16px 14px" }}>
            <div style={{ color: "#9cb0c8", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>{stat.label}</div>
            <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, color: stat.tone }}>{stat.value}</div>
          </div>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#9cb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, marginBottom: 16 }}>Work distribution</div>
          <div style={{ display: "grid", gap: 14 }}>
            {activity.map((item) => (
              <div key={item.name}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#dfeafc", marginBottom: 6 }}>
                  <span>{item.name}</span>
                  <span>{item.value}%</span>
                </div>
                <div style={{ height: 10, borderRadius: 999, background: "rgba(148, 163, 184, 0.18)", overflow: "hidden" }}>
                  <div style={{ width: `${item.value}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #67e8f9, #8b5cf6)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#9cb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, marginBottom: 16 }}>Signals</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#dfeafc", display: "grid", gap: 10, lineHeight: 1.8 }}>
            <li>Task completion is trending upward.</li>
            <li>Resource organization is becoming more consistent.</li>
            <li>Collaboration layer is the next highest leverage area.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
