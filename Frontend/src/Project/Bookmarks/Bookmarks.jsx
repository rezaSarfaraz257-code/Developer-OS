import { safeExternalUrl } from "../../services/api";

export default function BookmarksPage({ setPage, bookmarks = [] }) {
  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow" style={{ color: "#34d399", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>Bookmarks</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>Bookmarks & favorites</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {bookmarks.length === 0 ? (
          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px dashed rgba(148, 163, 184, 0.25)", borderRadius: 18, padding: 20, color: "#dfeafc", gridColumn: "1 / -1" }}>
            No bookmarks saved yet. Add docs, tools, references, and links you want to keep close.
          </div>
        ) : (
          bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id || bookmark.name || bookmark.title} bookmark={bookmark} />
          ))
        )}
      </div>
    </main>
  );
}

function BookmarkCard({ bookmark }) {
  const url = safeExternalUrl(bookmark.url);

  return (
    <article style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 18 }}>
      <div style={{ color: "#34d399", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>{bookmark.type || "Resource"}</div>
      <h3 style={{ margin: "0 0 8px", fontSize: 20 }}>{bookmark.name || bookmark.title || "Unnamed bookmark"}</h3>
      <p style={{ margin: 0, color: "#dfeafc", lineHeight: 1.7 }}>{bookmark.description || "Useful reference for this project."}</p>
      {url && <a href={url} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 14, color: "#67e8f9", textDecoration: "none", fontWeight: 600 }}>Open link</a>}
    </article>
  );
}
