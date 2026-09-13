import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CommandPanel from "./CommandPanel";
import EarthCore from "./EarthCore";
import GlobalNodes from "./GlobalNodes";
import LiveTerminal from "./LiveTerminal";
import NetworkMap from "./NetworkMap";
import SystemMonitor from "./SystemMonitor";
import { apiFetch } from "../../services/api";

const modules = [["projects", "/projects/"], ["tasks", "/tasks/"], ["resources", "/resources/"], ["workflows", "/workflows/"], ["tools", "/tools/"], ["activity", "/activity/"], ["snippets", "/snippets/"], ["github", "/github/account/"]];
const initialData = { projects: [], tasks: [], resources: [], workflows: [], tools: [], activity: [], snippets: [], github: { connected: false, account: null }, health: {} };
const sidebarItems = [["Home", "home", "CC"], ["Terminal", "terminal", "$_"], ["Explorer", "explore", "EX"], ["Projects", "dashboard", "PR"], ["Git", "github", "GT"], ["Docker", "explore", "DK"], ["Kubernetes", "workflows", "KB"], ["AI Assistant", "ai", "AI"], ["Network", "network", "NW"], ["Security", "security", "SC"], ["Settings", "profile", "ST"]];

function getNetworkInfo() {
  const connection = typeof navigator === "undefined" ? null : navigator.connection;
  return { rtt: connection?.rtt ?? null, downlink: connection?.downlink ?? null, online: typeof navigator === "undefined" ? false : navigator.onLine };
}
function formattedProjectStack(project) {
  if (Array.isArray(project.tags) && project.tags.length) return project.tags.slice(0, 3).join(" / ");
  return project.category ? `${project.category} workspace` : "Stack not specified";
}
function tokenizedLine(line) {
  const pattern = /(const|let|function|return|import|from|export|async|await|if|else|class|def|print|true|false|null|None|[{}()[\];,])/g;
  return line.split(pattern).filter((part) => part !== "").map((part, index) => <span key={`${part}-${index}`} className={/^(const|let|function|return|import|from|export|async|await|if|else|class|def|print|true|false|null|None)$/.test(part) ? "cc-code-keyword" : /^[{}()[\];,]$/.test(part) ? "cc-code-punctuation" : ""}>{part}</span>);
}

function CodeEditor({ snippets }) {
  const [activeId, setActiveId] = useState(null);
  const visibleSnippets = snippets.slice(0, 3);
  const activeSnippet = visibleSnippets.find((snippet) => snippet.id === activeId) || visibleSnippets[0];
  const code = activeSnippet?.code || "// No saved snippets are available.\n// Create a snippet in Developer OS to inspect it here.";
  const language = activeSnippet?.language || "text";
  return <div className="cc-editor"><div className="cc-editor__tabs" role="tablist" aria-label="Saved code snippets">{visibleSnippets.length ? visibleSnippets.map((snippet) => <button type="button" role="tab" aria-selected={(activeSnippet?.id === snippet.id).toString()} className={activeSnippet?.id === snippet.id ? "is-active" : ""} key={snippet.id} onClick={() => setActiveId(snippet.id)}>{snippet.title || "Untitled snippet"}</button>) : <span>snippet preview</span>}</div><pre className="cc-code" aria-label={`Code preview: ${activeSnippet?.title || "no saved snippet"}`}>{code.split("\n").slice(0, 13).map((line, index) => <span className="cc-code__line" key={`${line}-${index}`}><i>{String(index + 1).padStart(2, "0")}</i><code>{tokenizedLine(line)}</code></span>)}</pre><footer><span>{language}</span><span>Read-only preview</span><span>Ln 1, Col 1</span></footer></div>;
}
function ProjectList({ projects, error, query, onOpenProject, onNavigate }) {
  if (error) return <div className="cc-empty-state"><b>PROJECT DATA UNAVAILABLE</b><span>The project API did not respond. Other command modules remain available.</span></div>;
  if (!projects.length) return <div className="cc-empty-state"><b>NO PROJECTS YET</b><span>Create a project in the workspace to populate this live list.</span><button type="button" onClick={() => onNavigate("dashboard")}>Open workspace</button></div>;
  const visible = projects.filter((project) => `${project.title} ${project.category} ${(project.tags || []).join(" ")}`.toLowerCase().includes(query.toLowerCase())).slice(0, 4);
  if (!visible.length) return <div className="cc-empty-state"><b>NO PROJECT MATCHES</b><span>Try a project title, category, or tag.</span></div>;
  return <div className="cc-project-list">{visible.map((project) => <button type="button" className="cc-project" key={project.id} onClick={() => onOpenProject(project)}><span className="cc-project__mark">{project.title?.slice(0, 2).toUpperCase() || "PR"}</span><span><b>{project.title}</b><small>{formattedProjectStack(project)}</small></span><strong className={project.status === "Completed" ? "is-muted" : ""}><i />{project.status || "Unspecified"}</strong></button>)}</div>;
}
function DeveloperTools({ tools, error, onOpenTool, onNavigate }) {
  if (error) return <div className="cc-empty-state"><b>TOOL DATA UNAVAILABLE</b><span>The catalog API did not respond.</span><button type="button" onClick={() => onNavigate("explore")}>Open catalog</button></div>;
  if (!tools.length) return <div className="cc-empty-state"><b>NO CATALOG TOOLS</b><span>Tools added by an administrator appear here.</span><button type="button" onClick={() => onNavigate("explore")}>Open catalog</button></div>;
  return <div className="cc-tools-list">{tools.slice(0, 6).map((tool) => <div className="cc-tool" key={tool.id}><span aria-hidden="true">{tool.name?.slice(0, 2).toUpperCase() || "TL"}</span><div><b>{tool.name}</b><small>{tool.description || tool.category || "Catalog tool"}</small></div><button type="button" onClick={() => onOpenTool(tool)}>Open</button></div>)}</div>;
}
function SecurityCenter({ isAuthenticated, githubConnected, apiHealth }) {
  const protectedApis = Object.values(apiHealth).filter((status) => status === "ready").length;
  const items = [["Session authorization", isAuthenticated ? "Authenticated" : "Sign in required"], ["Protected API modules", protectedApis ? `${protectedApis} responding` : "Not verified"], ["GitHub token vault", githubConnected ? "Connected account" : "No account connected"], ["Runtime threat scanning", "Not connected"]];
  return <div className="cc-security"><div className="cc-security__shield" aria-hidden="true">S</div><div><b>APPLICATION STATUS</b><p>Security posture, not a host security scan.</p></div><div className="cc-security__list">{items.map(([name, state]) => <div key={name}><span aria-hidden="true">●</span><b>{name}</b><strong className={state === "Not connected" || state === "Not verified" ? "is-muted" : ""}>{state}</strong></div>)}</div></div>;
}
function QuickActions({ onNavigate, onFocusTerminal }) {
  const actions = [["+", "New Project", "Create from workspace", () => onNavigate("dashboard")], [">_", "Open Terminal", "Focus safe dashboard terminal", onFocusTerminal], ["^", "Deploy App", "Open production workspace", () => onNavigate("production")], ["AI", "Run AI Assistant", "Open Developer OS AI", () => onNavigate("ai")], ["*", "System Settings", "Open profile settings", () => onNavigate("profile")]];
  return <div className="cc-quick-actions">{actions.map(([icon, title, detail, action]) => <button type="button" key={title} onClick={action}><span>{icon}</span><div><b>{title}</b><small>{detail}</small></div><i aria-hidden="true">›</i></button>)}</div>;
}

export default function CommandCenter({ isAuthenticated, profile, onNavigate, onLogout, onOpenProject, onOpenTool }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(Boolean(isAuthenticated));
  const [query, setQuery] = useState("");
  const [compactSidebar, setCompactSidebar] = useState(false);
  const [violetTheme, setVioletTheme] = useState(false);
  const [network, setNetwork] = useState(getNetworkInfo);
  const [terminalFocusSignal, setTerminalFocusSignal] = useState(0);
  const networkPanel = useRef(null);
  const securityPanel = useRef(null);
  const loadData = useCallback(async () => {
    if (!isAuthenticated) { setData(initialData); setLoading(false); return; }
    setLoading(true);
    const results = await Promise.allSettled(modules.map(async ([name, endpoint]) => ({ name, payload: await (await apiFetch(endpoint)).json() })));
    const next = { ...initialData, health: {} };
    results.forEach((result, index) => { const [name] = modules[index]; if (result.status === "fulfilled") { next[name] = result.value.payload; next.health[name] = "ready"; } else next.health[name] = "error"; });
    ["projects", "tasks", "resources", "workflows", "tools", "activity", "snippets"].forEach((name) => { if (!Array.isArray(next[name])) next[name] = []; });
    if (!next.github || typeof next.github !== "object") next.github = initialData.github;
    setData(next); setLoading(false);
  }, [isAuthenticated]);
  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { const refreshNetwork = () => setNetwork(getNetworkInfo()); window.addEventListener("online", refreshNetwork); window.addEventListener("offline", refreshNetwork); navigator.connection?.addEventListener?.("change", refreshNetwork); return () => { window.removeEventListener("online", refreshNetwork); window.removeEventListener("offline", refreshNetwork); navigator.connection?.removeEventListener?.("change", refreshNetwork); }; }, []);
  const userName = profile?.full_name || profile?.username || "Developer";
  const initials = userName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "D";
  const activeNodes = useMemo(() => Object.values(data.health).filter((state) => state === "ready").length, [data.health]);
  const commandData = { ...data, network, githubConnected: Boolean(data.github?.connected), github: data.health.github };
  const handleSidebar = (target) => { if (target === "terminal") { setTerminalFocusSignal((signal) => signal + 1); return; } if (target === "network") { networkPanel.current?.scrollIntoView({ behavior: "smooth", block: "center" }); return; } if (target === "security") { securityPanel.current?.scrollIntoView({ behavior: "smooth", block: "center" }); return; } if (target === "home") { window.scrollTo({ top: 0, behavior: "smooth" }); return; } onNavigate(target); };
  return <div className={`command-center ${violetTheme ? "command-center--violet" : ""} ${compactSidebar ? "command-center--compact" : ""}`}>
    <header className="cc-header"><button type="button" className="cc-brand" onClick={() => handleSidebar("home")} aria-label="Developer OS command center home"><span aria-hidden="true">CO</span><b>CYBER OCEAN</b><i /><strong>DEVELOPER OS</strong><small>v3.7</small></button><p className="cc-motto">Code <i>/</i> Build <i>/</i> Deploy <i>/</i> Repeat</p><div className="cc-header__controls"><label className="cc-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search loaded projects" aria-label="Search loaded projects" /></label><button type="button" className="cc-icon-button" onClick={() => setVioletTheme((value) => !value)} aria-label="Toggle command-center colour accent">◐</button><button type="button" className="cc-icon-button" onClick={() => onNavigate("activity")} aria-label={`Open activity; ${data.activity.length} loaded items`}>◌<sup>{data.activity.length || ""}</sup></button><button type="button" className="cc-profile" onClick={() => onNavigate("profile")} aria-label="Open profile"><span>{initials}</span><b>{userName}</b><small>{isAuthenticated ? "Session active" : "Guest session"}</small></button></div></header>
    <aside className="cc-sidebar" aria-label="Command center navigation"><button type="button" className="cc-sidebar__collapse" onClick={() => setCompactSidebar((value) => !value)} aria-label={compactSidebar ? "Expand navigation" : "Collapse navigation"}>☰</button><nav>{sidebarItems.map(([label, target, icon]) => <button type="button" className={target === "home" ? "is-active" : ""} key={label} onClick={() => handleSidebar(target)} title={compactSidebar ? label : undefined}><span aria-hidden="true">{icon}</span><b>{label}</b></button>)}</nav><section className="cc-sidebar__status"><h2>SYSTEM STATUS</h2><div><span>●</span><b>OS</b><strong>Interface ready</strong></div><div><span className={network.online ? "" : "is-error"}>●</span><b>Network</b><strong>{network.online ? "Browser online" : "Browser offline"}</strong></div><div><span className={isAuthenticated ? "" : "is-muted"}>●</span><b>Security</b><strong>{isAuthenticated ? "Session active" : "Sign in required"}</strong></div><div><span>●</span><b>AI Core</b><strong>Available</strong></div><div><span className={loading ? "is-muted" : ""}>●</span><b>Sync</b><strong>{loading ? "Loading" : "Complete"}</strong></div></section></aside>
    <main className="cc-dashboard"><CommandPanel title="REAL-TIME SYSTEM MONITOR" subtitle="Local browser telemetry" className="cc-monitor"><SystemMonitor /></CommandPanel><section className="cc-core" aria-label="Developer OS procedural Earth command core"><EarthCore /><div className="cc-core__label"><span>CORE / GLOBAL NODE</span><b>CYBER OCEAN</b><strong>DEVELOPER OS</strong><small>Build The Future</small></div><div className="cc-core__scan"><span>SCANNING APPLICATION FABRIC</span><i><b /></i></div><GlobalNodes data={commandData} onNavigate={onNavigate} /></section><CommandPanel title="LIVE TERMINAL" subtitle="Safe dashboard queries" className="cc-terminal-panel"><LiveTerminal projects={data.projects} apiHealth={data.health} isAuthenticated={isAuthenticated} focusSignal={terminalFocusSignal} /></CommandPanel><CommandPanel title="ACTIVE PROJECTS" subtitle={loading ? "Synchronising project data" : "Live data from /api/projects/"} className="cc-projects-panel" action={<button type="button" onClick={() => onNavigate("dashboard")}>Open workspace ›</button>}><ProjectList projects={data.projects} error={data.health.projects === "error"} query={query} onOpenProject={onOpenProject} onNavigate={onNavigate} /></CommandPanel><CommandPanel title="NETWORK MAP" subtitle="Procedural application topology" className="cc-network-panel"><div ref={networkPanel}><NetworkMap activeNodes={activeNodes} network={network} /></div></CommandPanel><CommandPanel title="CODE EDITOR" subtitle="Saved snippet preview" className="cc-editor-panel"><CodeEditor snippets={data.snippets} /></CommandPanel><CommandPanel title="DEVELOPER TOOLS" subtitle="Existing catalog and route entry points" className="cc-tools-panel"><DeveloperTools tools={data.tools} error={data.health.tools === "error"} onOpenTool={onOpenTool} onNavigate={onNavigate} /></CommandPanel><CommandPanel title="SECURITY CENTER" subtitle="Application-level signals" className="cc-security-panel"><div ref={securityPanel}><SecurityCenter isAuthenticated={isAuthenticated} githubConnected={Boolean(data.github?.connected)} apiHealth={data.health} /></div></CommandPanel><CommandPanel title="QUICK ACTIONS" subtitle="Connected to existing Developer OS pages" className="cc-quick-panel"><QuickActions onNavigate={onNavigate} onFocusTerminal={() => handleSidebar("terminal")} /></CommandPanel></main>
    <footer className="cc-footer"><span>CYBER OCEAN / DEVELOPER OS</span><span>API modules: {activeNodes}/8</span><span>{network.online ? "BROWSER ONLINE" : "BROWSER OFFLINE"}</span>{isAuthenticated ? <button type="button" onClick={onLogout}>Log out</button> : <button type="button" onClick={() => onNavigate("auth")}>Sign in</button>}</footer>
  </div>;
}
