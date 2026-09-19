const nodeDefinitions = [
  { id: "github", label: "GitHub", icon: "G" },
  { id: "projects", label: "Cloud", icon: "C" },
  { id: "resources", label: "Database", icon: "D" },
  { id: "tools", label: "Docker", icon: "DK" },
  { id: "ai", label: "AI Core", icon: "AI" },
  { id: "workflows", label: "Kubernetes", icon: "K" },
];

function nodeStatus(definition, data) {
  if (definition.id === "github") {
    if (data.github === "error") return { title: "Unavailable", detail: "Connection check failed" };
    return data.githubConnected
      ? { title: "Connected", detail: data.network.rtt == null ? "Latency: not exposed" : `Latency: ${data.network.rtt} ms` }
      : { title: "Not connected", detail: "Connect from Git integration" };
  }
  if (definition.id === "ai") return { title: "Available", detail: "Open AI Assistant" };
  if (data.health[definition.id] === "error") return { title: "Unavailable", detail: "API data unavailable" };
  const count = Array.isArray(data[definition.id]) ? data[definition.id].length : 0;
  return { title: "Available", detail: `${count} record${count === 1 ? "" : "s"} loaded` };
}

export default function GlobalNodes({ data, onNavigate }) {
  return (
    <div className="cc-global-nodes" aria-label="Developer OS integration nodes">
      <svg className="cc-node-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M15 25 L49 48 M84 24 L52 47 M87 53 L52 51 M76 80 L51 53 M20 79 L48 53 M12 53 L48 51" />
      </svg>
      {nodeDefinitions.map((definition, index) => {
        const status = nodeStatus(definition, data);
        const target = definition.id === "github" ? "github" : definition.id === "ai" ? "ai" : definition.id === "projects" ? "dashboard" : definition.id === "resources" ? "resources" : definition.id === "workflows" ? "workflows" : "explore";
        return (
          <button type="button" className={`cc-global-node cc-global-node--${index + 1}`} key={definition.id} onClick={() => onNavigate(target)}>
            <span className="cc-global-node__icon" aria-hidden="true">{definition.icon}</span>
            <span><b>{definition.label}</b><strong className={status.title === "Unavailable" ? "is-error" : status.title === "Not connected" ? "is-muted" : ""}>{status.title}</strong><small>{status.detail}</small></span>
          </button>
        );
      })}
    </div>
  );
}
