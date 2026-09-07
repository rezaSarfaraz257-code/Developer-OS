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
  const [category, setCategory] = useState("General");
  const [status, setStatus] = useState("In Progress");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // وقتی روی Edit کلیک شد
  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setCategory(project.category || "General");
      setStatus(project.status || "In Progress");
      setLink(project.link || "");
      setTags(Array.isArray(project.tags) ? project.tags.join(", ") : "");
      setMessage("");
      setIsError(false);
    } else {
      setTitle("");
      setDescription("");
      setCategory("General");
      setStatus("In Progress");
      setLink("");
      setTags("");
      setMessage("");
      setIsError(false);
    }
  }, [project]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("General");
    setStatus("In Progress");
    setLink("");
    setTags("");
    setMessage("");
    setIsError(false);
    if (onCancel) onCancel();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const payload = {
        title,
        description,
        category,
        status,
        link,
        tags: tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (project) {
        const response = await apiFetch(`/projects/${project.id}/`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        const updatedProject = await response.json();

        onProjectUpdated(updatedProject);
        setMessage("Project updated successfully.");
        resetForm();
        return;
      }

      const response = await apiFetch("/projects/", {
        method: "POST",
        body: JSON.stringify(payload),
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
        required
      />

      <textarea
        className="project-textarea"
        placeholder="Project description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <div className="project-form-grid">
        <select
          className="project-input"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="General">General</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="DevOps">DevOps</option>
          <option value="AI">AI</option>
          <option value="Design">Design</option>
          <option value="Productivity">Productivity</option>
        </select>

        <select
          className="project-input"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="In Progress">In Progress</option>
          <option value="Planning">Planning</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      <input
        className="project-input"
        type="url"
        placeholder="Project link (optional)"
        value={link}
        onChange={(event) => setLink(event.target.value)}
      />

      <input
        className="project-input"
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(event) => setTags(event.target.value)}
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
