export default function CommandPanel({
  title,
  subtitle,
  action,
  className = "",
  children,
}) {
  return (
    <section className={`cc-panel ${className}`} aria-label={title}>
      <header className="cc-panel__header">
        <div>
          <span className="cc-panel__eyebrow">MODULE</span>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {action ? <div className="cc-panel__action">{action}</div> : null}
      </header>
      <div className="cc-panel__body">{children}</div>
    </section>
  );
}
