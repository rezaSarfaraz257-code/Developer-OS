export default function ActivityPage({ setPage, activities = [] }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Activity</span>
          <h2>Project activity</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div>
        {activities.length === 0 ? (
          <div className="empty-box">No recent activity.</div>
        ) : (
          <ul>
            {activities.map((a) => (
              <li key={a.id}>{a.actor?.username || 'System'} — {a.verb} — {new Date(a.created_at).toLocaleString()}</li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
