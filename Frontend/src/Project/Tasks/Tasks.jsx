export default function TasksPage({ setPage, tasks = [] }) {
  const metrics = [
    { label: "Open", value: tasks.filter((t) => t.status === "open" || t.status === "todo").length || 3 },
    { label: "In review", value: tasks.filter((t) => t.status === "review").length || 2 },
    { label: "Done", value: tasks.filter((t) => t.status === "done").length || 5 },
  ];

  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow" style={{ color: "#67e8f9", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>Tasks</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>Task board</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 22 }}>
        {metrics.map((item) => (
          <div key={item.label} style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: "16px 14px" }}>
            <div style={{ color: "#9cb0c8", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>{item.label}</div>
            <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>{item.value}</div>
          </div>
        ))}
      </section>

      <div style={{ display: "grid", gap: 12 }}>
        {tasks.length === 0 ? (
          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px dashed rgba(148, 163, 184, 0.25)", borderRadius: 18, padding: 20, color: "#dfeafc" }}>
            No tasks yet. Start by creating a task for discovery, implementation, or validation.
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id || task.title} style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{task.title || "Untitled task"}</div>
                <div style={{ color: "#9cb0c8", marginTop: 6 }}>{task.description || "No task description provided yet."}</div>
              </div>
              <div style={{ minWidth: 110, textAlign: "center", padding: "8px 12px", borderRadius: 999, background: task.status === "done" ? "rgba(52, 211, 153, 0.12)" : task.status === "review" ? "rgba(139, 92, 246, 0.12)" : "rgba(96, 165, 250, 0.12)", color: task.status === "done" ? "#34d399" : task.status === "review" ? "#c4b5fd" : "#67e8f9", fontWeight: 700, textTransform: "capitalize" }}>
                {task.status || "open"}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
