export default function ActivityPage({ setPage, activities = [] }) {
  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow" style={{ color: "#60a5fa", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>Activity</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>Project activity</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {activities.length === 0 ? (
          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px dashed rgba(148, 163, 184, 0.25)", borderRadius: 18, padding: 20, color: "#dfeafc" }}>
            No recent activity. Once work begins, a live timeline will appear here.
          </div>
        ) : (
          activities.map((item, index) => (
            <div key={item.id || `${item.actor?.username || "system"}-${index}`} style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: index % 2 === 0 ? "#67e8f9" : "#8b5cf6", boxShadow: "0 0 18px rgba(103, 232, 249, 0.6)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{item.actor?.username || "System"}</div>
                <div style={{ color: "#dfeafc", marginTop: 4 }}>{item.verb || "Updated project"}</div>
              </div>
              <div style={{ color: "#9cb0c8", fontSize: 12 }}>{item.created_at ? new Date(item.created_at).toLocaleString() : "just now"}</div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
