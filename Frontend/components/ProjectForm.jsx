import { useEffect, useState } from "react";
import { apiFetch } from "../src/services/api";

function ProjectForm({
  project,
  onProjectCreated,
  onProjectUpdated,
  onCancel,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // وقتی روی Edit کلیک شد
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setMessage("");
      setIsError(false);
    } else {
      setTitle("");
      setDescription("");
      setMessage("");
      setIsError(false);
    }
  }, [project]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMessage("");
    setIsError(false);
    if (onCancel) onCancel();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      if (project) {
        const response = await apiFetch(`/projects/${project.id}/`, {
          method: "PATCH",
          body: JSON.stringify({ title, description }),
        });

        const updatedProject = await response.json();

        onProjectUpdated(updatedProject);
        setMessage("Project updated successfully.");
        resetForm();
        return;
      }

      const response = await apiFetch("/projects/", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });

      const newProject = await response.json();

      onProjectCreated(newProject);
      setMessage("Project created successfully.");
      resetForm();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Request failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <input
        className="project-input"
        type="text"
        placeholder="Project title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <textarea
        className="project-textarea"
        placeholder="Project description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <div className="project-form-actions">
        <button type="submit" className="primary-button">
          {project ? "Update Project" : "Create Project"}
        </button>

        {project && (
          <button type="button" className="secondary-button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      {message && (
        <p className={isError ? "form-message error" : "form-message success"}>
          {message}
        </p>
      )}
    </form>
  );
}

export default ProjectForm;