export default function TasksPage({ setPage, tasks = [] }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Tasks</span>
          <h2>Task board</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div>
        {tasks.length === 0 ? (
          <div className="empty-box">No tasks yet.</div>
        ) : (
          <ul>
            {tasks.map((t) => (
              <li key={t.id}>{t.title} — {t.status}</li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
