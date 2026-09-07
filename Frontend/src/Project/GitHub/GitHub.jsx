import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";

export default function GitHubPage({ setPage }) {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const resp = await apiFetch("/github/account/");
        const payload = await resp.json();
        if (payload.connected) {
          setConnected(true);
          setAccount(payload.account);
        } else {
          setConnected(false);
        }
      } catch {
        setConnected(false);
      }
    };

    check();
  }, []);

  const connect = async () => {
    try {
      const resp = await apiFetch("/github/authorize/");
      const payload = await resp.json();
      if (payload.authorization_url) {
        window.location.assign(payload.authorization_url);
      } else {
        throw new Error("GitHub authorization URL was not returned.");
      }
    } catch (err) {
      alert("Failed to start GitHub auth: " + err.message);
    }
  };

  const loadRepos = async () => {
    setLoadingRepos(true);
    try {
      const resp = await apiFetch("/github/repos/");
      const data = await resp.json();
      setRepos(Array.isArray(data.repositories) ? data.repositories : []);
    } catch (err) {
      alert("Failed to load repos: " + err.message);
    } finally {
      setLoadingRepos(false);
    }
  };

  const syncRepo = async (fullName) => {
    try {
      const resp = await apiFetch("/github/sync-activity/", {
        method: "POST",
        body: JSON.stringify({ repo_full_name: fullName }),
      });
      const data = await resp.json();
      alert(`Synced ${data.synced} events`);
    } catch (err) {
      alert("Failed to sync: " + err.message);
    }
  };

  return (
    <main className="page-panel" style={{ background: "rgba(10, 17, 29, 0.9)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: 24, padding: 24 }}>
      <div className="page-header-row" style={{ marginBottom: 22 }}>
        <div>
          <span className="eyebrow" style={{ color: "#67e8f9", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11, display: "inline-block", marginBottom: 8 }}>GitHub</span>
          <h2 style={{ margin: 0, fontSize: 30 }}>Repository integration</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#9cb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, marginBottom: 12 }}>Connection</div>
          {connected ? (
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 22 }}>Connected as {account?.login || "developer"}</div>
              <button type="button" className="secondary-button" onClick={loadRepos}>
                {loadingRepos ? "Loading..." : "List repositories"}
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              <p style={{ margin: 0, color: "#dfeafc", lineHeight: 1.7 }}>
                Connect your GitHub account to sync repositories, activity, and project context from your codebase.
              </p>
              <button type="button" className="primary-button" onClick={connect}>Connect GitHub</button>
            </div>
          )}
        </div>

        <div style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 20 }}>
          <div style={{ color: "#9cb0c8", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, marginBottom: 12 }}>Repository health</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#dfeafc", display: "grid", gap: 10, lineHeight: 1.8 }}>
            <li>Recent branches and pushes stay visible.</li>
            <li>Code activity can be mirrored into the workspace.</li>
            <li>Project and engineering context remain centralized.</li>
          </ul>
        </div>
      </section>

      <div style={{ marginTop: 18, display: "grid", gap: 16 }}>
        {repos.length === 0 ? (
          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px dashed rgba(148, 163, 184, 0.25)", borderRadius: 18, padding: 20, color: "#dfeafc" }}>
            No repositories loaded yet.
          </div>
        ) : (
          repos.map((repo) => (
            <article key={repo.id} style={{ background: "rgba(15, 23, 42, 0.82)", border: "1px solid rgba(148, 163, 184, 0.18)", borderRadius: 18, padding: 18, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{repo.full_name}</div>
                <div style={{ color: "#9cb0c8", marginTop: 6 }}>{repo.description || "No description available."}</div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ color: "#67e8f9", textDecoration: "none", fontWeight: 700 }}>
                  Open
                </a>
                <button type="button" className="secondary-button" onClick={() => syncRepo(repo.full_name)}>Sync activity</button>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
