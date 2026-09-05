export default function ProjectDetailPage({ setPage, project, activeTab = "overview", setActiveTab, tasks = [], notes = [], activity = [] }) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "tasks", label: "Tasks" },
    { id: "notes", label: "Notes" },
    { id: "activity", label: "Activity" },
    { id: "ai", label: "AI" },
  ];

  const detailCards = [
    { label: "Status", value: project?.status || "In progress" },
    { label: "Category", value: project?.category || "Productivity" },
    { label: "Owner", value: project?.owner || "Developer" },
    { label: "Updated", value: project?.updated || "Today" },
  ];

  const renderOverview = () => (
    <>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 20 }}>
        {detailCards.map((item) => (
          <div key={item.label} style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 16, padding: "16px 14px" }}>
            <div style={{ color: "#9cb0c8", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 11 }}>{item.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 10 }}>{item.value}</div>
          </div>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 18 }}>
        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#9cb0c8", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Description</div>
          <p style={{ margin: 0, color: "#e5eefb", lineHeight: 1.8 }}>
            {project?.description || "This project is designed to centralize resources, developer workflows, and technical context in one place, making execution faster and more deliberate."}
          </p>
        </div>

        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#9cb0c8", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Milestones</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#dfeafc", lineHeight: 1.9, display: "grid", gap: 8 }}>
            <li>Discovery and product framing</li>
            <li>Core dashboard and workspace setup</li>
            <li>Workflow and resource modules</li>
            <li>Collaboration and intelligent automation</li>
          </ul>
        </div>
      </section>
    </>
  );

  const renderTasks = () => (
    <div style={{ display: "grid", gap: 12 }}>
      {tasks.length === 0 ? (
        <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px dashed rgba(148, 163, 184, 0.25)", borderRadius: 18, padding: 20, color: "#dfeafc" }}>
          No tasks yet. Create the first milestone for the project.
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task.id || task.title} style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{task.title || "Untitled task"}</div>
              <div style={{ color: "#9cb0c8", marginTop: 6 }}>{task.description || "No description provided."}</div>
            </div>
            <div style={{ minWidth: 110, textAlign: "center", padding: "8px 12px", borderRadius: 999, background: task.status === "done" ? "rgba(52, 211, 153, 0.12)" : task.status === "in review" ? "rgba(139, 92, 246, 0.12)" : "rgba(96, 165, 250, 0.12)", color: task.status === "done" ? "#34d399" : task.status === "in review" ? "#c4b5fd" : "#67e8f9", fontWeight: 700, textTransform: "capitalize" }}>
              {task.status || "todo"}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderNotes = () => (
    <div style={{ display: "grid", gap: 16 }}>
      {notes.length === 0 ? (
        <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px dashed rgba(148, 163, 184, 0.25)", borderRadius: 18, padding: 20, color: "#dfeafc" }}>
          No notes yet. Capture decisions and process insights here.
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
  );

  const renderActivity = () => (
    <div style={{ display: "grid", gap: 16 }}>
      {activity.length === 0 ? (
        <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px dashed rgba(148, 163, 184, 0.25)", borderRadius: 18, padding: 20, color: "#dfeafc" }}>
          No recent activity. The project timeline will update as work begins.
        </div>
      ) : (
        activity.map((item, index) => (
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
  );

  const renderAI = () => (
    <section style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 18 }}>
      <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
        <div style={{ color: "#9cb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, marginBottom: 12 }}>Assistant</div>
        <div style={{ background: "rgba(2, 6, 23, 0.9)", borderRadius: 14, border: "1px solid rgba(148, 163, 184, 0.2)", padding: 16, minHeight: 150, color: "#dfeafc", lineHeight: 1.8 }}>
          “This project is strongest when the workflow layer, resource library, and technical context are kept close to the task flow. The next step is to convert repeated work into reusable templates.”
        </div>
      </div>

      <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
        <div style={{ color: "#9cb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, marginBottom: 12 }}>Suggestions</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#dfeafc", display: "grid", gap: 10, lineHeight: 1.7 }}>
          <li>Document the core workflow before scaling.</li>
          <li>Capture reusable notes and links into the project.</li>
          <li>Group tasks by milestone and review them weekly.</li>
        </ul>
      </div>
    </section>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "tasks": return renderTasks();
      case "notes": return renderNotes();
      case "activity": return renderActivity();
      case "ai": return renderAI();
      default: return renderOverview();
    }
  };

  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 20 }}>
        <div>
          <span className="eyebrow" style={{ color: "#8b5cf6", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>Project</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>{project?.title || "Project detail"}</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab?.(tab.id)}
            style={{
              background: activeTab === tab.id ? "linear-gradient(135deg, #67e8f9, #8b5cf6)" : "rgba(15, 23, 42, 0.82)",
              color: activeTab === tab.id ? "#051018" : "#e5eefb",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: 999,
              padding: "10px 15px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </main>
  );
}
