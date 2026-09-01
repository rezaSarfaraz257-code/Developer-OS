import { useEffect, useState } from "react";
import ProjectCard from "../../../components/ProjectCard";
import ProjectForm from "../../../components/ProjectForm";
import { apiFetch, clearAuth } from "../../services/api";

export default function DashboardPage({ setPage, isAuthenticated }) {
  const [projectsData, setProjectsData] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [justUpdatedId, setJustUpdatedId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setProjectsData([]);
      return;
    }

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const response = await apiFetch("/projects/");
        const data = await response.json();
        setProjectsData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        clearAuth();
        setPage("auth");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthenticated, setPage]);

  const handleProjectCreated = (newProject) => {
    setProjectsData((current) => [...current, newProject]);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjectsData((current) =>
      current.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      ),
    );
    setEditingProject(null);
    setJustUpdatedId(updatedProject.id);
  };

  const handleProjectDeleted = (projectId) => {
    setProjectsData((current) =>
      current.filter((project) => project.id !== projectId),
    );
  };

  const totalProjects = projectsData.length;
  const completedProjects = projectsData.filter((item) => item.completed).length;
  const activeProjects = Math.max(0, totalProjects - completedProjects);

  if (!isAuthenticated) {
    return (
      <main className="dashboard-page auth-lock">
        <div className="auth-required-box">
          <span className="eyebrow">Access required</span>
          <h2>Please login to view your dashboard</h2>
          <button
            type="button"
            className="primary-button"
            onClick={() => setPage("auth")}
          >
            Go to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <aside className="sidebar-panel">
        <div className="brand-wrap small-brand">
          <div className="brand-mark">D</div>
          <div>
            <span className="brand-kicker">Workspace</span>
            <strong>Developer OS</strong>
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
            Saved tools
          </button>
          <button
            type="button"
            className="nav-item"
            onClick={() => setPage("profile")}
          >
            Profile
          </button>
        </nav>

        <div className="sidebar-card">
          <p>Quick status</p>
          <strong>{totalProjects} active items</strong>
        </div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-header-row">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h2>Project workspace</h2>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setPage("home")}
          >
            Home
          </button>
        </div>

        <div className="stats-grid">
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
        </div>

        <div className="project-form-panel">
          <ProjectForm
            project={editingProject}
            onProjectCreated={handleProjectCreated}
            onProjectUpdated={handleProjectUpdated}
            onCancel={() => setEditingProject(null)}
          />
        </div>

        <div className="project-board">
          {loading ? (
            <div className="loading-box">Loading projects...</div>
          ) : projectsData.length === 0 ? (
            <div className="empty-box">
              No projects yet. Create your first project.
            </div>
          ) : (
            projectsData.map((project) => (
              <ProjectCard
                key={project.id ?? project.title}
                project={project}
                onEdit={setEditingProject}
                onDelete={handleProjectDeleted}
                updated={justUpdatedId === project.id}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
