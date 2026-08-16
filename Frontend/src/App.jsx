import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import "./App.css";
import { apiFetch } from "./services/api";
import Login from "../components/Login";

function App() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem("access"));

  if (!isLoading) {
    return (
      <Login
        onLogin={() => {
          setIsLoading(true);
        }}
      />
    );
  }

  useEffect(() => {
    apiFetch("/projects/")
      .then((response) => response.json())
      .then((data) => {
        console.log("project data: ", data);
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

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
  };

  const handleProjectDeleted = (projectId) => {
    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== projectId),
    );
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setIsLoggedIn(false);
  };
  return (
    <div>
      <h1>Developer OS</h1>

      <ProjectForm
        project={editingProject}
        onProjectCreated={handleProjectCreated}
        onProjectUpdated={handleProjectUpdated}
      />

      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={setEditingProject}
          onDelete={handleProjectDeleted}
        />
      ))}
    </div>
  );
}

export default App;
