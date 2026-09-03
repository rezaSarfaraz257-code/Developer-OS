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
      } catch (e) {
        setConnected(false);
      }
    };

    check();
  }, []);

  const connect = async () => {
    try {
      const resp = await apiFetch("/github/authorize/", { method: "POST" });
      const payload = await resp.json();
      if (payload.url) {
        // open auth URL in new window
        window.open(payload.url, "_blank", "noopener,noreferrer");
        alert("GitHub auth opened in a new tab. Complete authorization and return to this app.");
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
      setRepos(Array.isArray(data) ? data : []);
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
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">GitHub</span>
          <h2>Repository integration</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div className="github-panel">
        <div className="github-connect">
          {connected ? (
            <div>
              <strong>Connected as {account?.login}</strong>
              <button type="button" className="secondary-button" onClick={loadRepos}>
                {loadingRepos ? "Loading..." : "List repositories"}
              </button>
            </div>
          ) : (
            <div>
              <p>Connect your GitHub account to sync repositories and activity (read-only).</p>
              <button type="button" className="primary-button" onClick={connect}>Connect GitHub</button>
            </div>
          )}
        </div>

        <div className="repo-list">
          {repos.length === 0 ? (
            <div className="empty-box">No repositories loaded.</div>
          ) : (
            repos.map((r) => (
              <article key={r.id} className="repo-card">
                <h3>{r.full_name}</h3>
                <p>{r.description}</p>
                <a href={r.html_url} target="_blank" rel="noreferrer">Open on GitHub</a>
                <div style={{marginTop:8}}>
                  <button type="button" className="secondary-button" onClick={() => syncRepo(r.full_name)}>Sync activity</button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
