export function HUDPage({ eyebrow, title, actions, children, className = "" }) {
  return (
    <main className={`os-page ${className}`.trim()}>
      <header className="os-page__header">
        <div>
          <span className="os-kicker">{eyebrow}</span>
          <h1>{title}</h1>
        </div>
        {actions && <div className="os-page__actions">{actions}</div>}
      </header>
      {children}
    </main>
  );
}

export function HUDPanel({ title, status, children, className = "", as: Tag = "section" }) {
  return (
    <Tag className={`hud-panel ${className}`.trim()}>
      {(title || status) && (
        <header className="hud-panel__header">
          {title && <h2>{title}</h2>}
          {status && <span className={`os-status os-status--${status.tone || "cyan"}`}>{status.label}</span>}
        </header>
      )}
      {children}
    </Tag>
  );
}

export function HUDMetric({ label, value, tone = "cyan" }) {
  return (
    <div className={`hud-metric hud-metric--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function HUDEmpty({ children }) {
  return <div className="hud-empty">{children}</div>;
}
