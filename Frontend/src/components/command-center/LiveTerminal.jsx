import { useEffect, useRef, useState } from "react";

function createLog({ projects, apiHealth, isAuthenticated }) {
  const services = Object.entries(apiHealth)
    .filter(([, state]) => state === "ready")
    .map(([name]) => name)
    .join(", ");
  return [
    "developer-os@command-center:~$ status",
    `Session: ${isAuthenticated ? "authenticated" : "not authenticated"}`,
    `Projects: ${isAuthenticated ? `${projects.length} loaded from /api/projects/` : "sign in to load"}`,
    `API modules: ${services || "No authenticated data loaded"}`,
    "",
    "Type help for safe, local dashboard commands.",
  ];
}

export default function LiveTerminal({ projects, apiHealth, isAuthenticated, focusSignal }) {
  const [entries, setEntries] = useState(() => createLog({ projects, apiHealth, isAuthenticated }));
  const [command, setCommand] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setEntries(createLog({ projects, apiHealth, isAuthenticated }));
  }, [projects, apiHealth, isAuthenticated]);

  useEffect(() => {
    if (focusSignal) inputRef.current?.focus();
  }, [focusSignal]);

  const runCommand = (event) => {
    event.preventDefault();
    const normalized = command.trim().toLowerCase();
    if (!normalized) return;
    if (normalized === "clear") {
      setEntries([]);
    } else if (normalized === "help") {
      setEntries((current) => [...current, "> help", "Safe commands: help, status, projects, clear."]);
    } else if (normalized === "projects") {
      setEntries((current) => [
        ...current,
        "> projects",
        isAuthenticated
          ? `Found ${projects.length} project${projects.length === 1 ? "" : "s"} from the Developer OS API.`
          : "No authenticated project session. Sign in to query projects.",
      ]);
    } else if (normalized === "status") {
      setEntries((current) => [...current, "> status", ...createLog({ projects, apiHealth, isAuthenticated }).slice(1, 5)]);
    } else {
      setEntries((current) => [...current, `> ${command}`, "Unsupported command. This terminal only runs safe dashboard queries."]);
    }
    setCommand("");
  };

  return (
    <div className="cc-terminal">
      <div className="cc-terminal__log" role="log" aria-live="polite">
        {entries.slice(-20).map((entry, index) => <div key={`${entry}-${index}`} className={entry.startsWith(">") ? "cc-terminal__command" : ""}>{entry || "\u00a0"}</div>)}
      </div>
      <form onSubmit={runCommand} className="cc-terminal__input">
        <span aria-hidden="true">›</span>
        <label className="sr-only" htmlFor="command-center-terminal">Safe dashboard command</label>
        <input ref={inputRef} id="command-center-terminal" value={command} onChange={(event) => setCommand(event.target.value)} placeholder="help · status · projects · clear" autoComplete="off" />
      </form>
    </div>
  );
}
