export default function AIAssistantPage({ setPage }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">AI</span>
          <h2>AI Assistant</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>Back to workspace</button>
      </div>

      <div>
        <p>AI assistant integration point (chat, suggestions, automation).</p>
      </div>
    </main>
  );
}
