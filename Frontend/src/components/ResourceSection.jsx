function ResourceSection() {
  const resources = [
    { title: "Django Docs", type: "Framework" },
    { title: "React Docs", type: "Frontend" },
    { title: "GitHub Guides", type: "Workflow" },
    { title: "Design System", type: "UI" },
  ];

  return (
    <div className="resources-section">
      <h3>Resources</h3>
      <ul>
        {resources.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResourceSection;
