function ToolsSection() {
  const tools = [
    { name: "Git", category: "Version Control", status: "Core" },
    { name: "Docker", category: "DevOps", status: "Core" },
    { name: "VS Code", category: "Editor", status: "Main" },
    { name: "Postman", category: "API", status: "Useful" },
    { name: "Figma", category: "Design", status: "Useful" },
    { name: "Notion", category: "Docs", status: "Workflow" },
  ];

  return (
    <div className="tools-section">
      <h3>Developer Tools</h3>
      <div className="tool-grid">
        {tools.map((tool) => (
          <div className="tool-card" key={tool.name}>
            <span className="tool-category">{tool.category}</span>
            <h4>{tool.name}</h4>
            <p>{tool.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToolsSection;
