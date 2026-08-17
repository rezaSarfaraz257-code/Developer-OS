import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import SearchBar from "../components/SearchBar";
import ProjectsChart from "../components/ProjectsChart";
import Profile from "../components/Profile";
import "./App.css";
import { apiFetch, clearAuth } from "./services/api";
import Login from "../components/Login";
import ToolsSection from "../components/ToolsSection";
import ResourceSection from "../components/ResourceSection";

function App() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("access")),
  );
  const [search, setSearch] = useState("");
  const [justUpdatedId, setJustUpdatedId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setProjects([]);
      setEditingProject(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    apiFetch("/projects/")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        clearAuth();
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Login
        onLogin={() => {
          setIsAuthenticated(true);
        }}
      />
    );
  }

  const handleProjectCreated = (newProject) => {
    setProjects((currentProjects) => [...currentProjects, newProject]);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      ),
    );

    setEditingProject(null);
    setJustUpdatedId(updatedProject.id);
  };

  const handleProjectDeleted = (projectId) => {
    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== projectId),
    );
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => (p.completed ? true : false)).length || 0;
  const activeProjects = Math.max(0, totalProjects - completedProjects);

  const handleLogout = () => {
    clearAuth();
    setIsAuthenticated(false);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">D</div>
          <div>
            <p className="brand-label">Workspace</p>
            <h2>Developer OS</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button type="button" className="nav-item active">
            Overview
          </button>
          <button type="button" className="nav-item">
            Projects
          </button>
          <button type="button" className="nav-item">
            Reports
          </button>
          <button type="button" className="nav-item" onClick={() => setShowProfile(true)}>
            Settings
          </button>
        </nav>

        <div className="sidebar-card">
          <p>Quick status</p>
          <strong>{totalProjects} Projects</strong>
        </div>
      </aside>

      <main className="main-panel">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Project Manager</h1>
          </div>

          <button type="button" className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card accent">
            <span>Total Projects</span>
            <strong>{totalProjects}</strong>
          </div>
          <div className="stat-card">
            <span>Active</span>
            <strong>{activeProjects}</strong>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedProjects}</strong>
          </div>
        </section>

        <div className="chart-row">
          <ProjectsChart projects={projects} />
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <ProjectForm
          project={editingProject}
          onProjectCreated={handleProjectCreated}
          onProjectUpdated={handleProjectUpdated}
          onCancel={() => setEditingProject(null)}
        />

        <section className="projects-panel">
          <div className="section-title-row">
            <h3>Recent Projects</h3>
            <span>{totalProjects} items</span>
          </div>

          <div className="projects-grid">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={setEditingProject}
                onDelete={handleProjectDeleted}
                updated={justUpdatedId === project.id}
                style={{ animationDelay: `${idx * 80}ms` }}
              />
            ))}
            {filteredProjects.length === 0 && (
              <div className="empty-state">No projects match your search.</div>
            )}
          </div>
        </section>
        <section className="resources-layout">
          <ToolsSection />
          <ResourceSection />
        </section>
        {showProfile && <Profile onClose={() => setShowProfile(false)} />}
      </main>
    </div>
  );
}

export default App;
