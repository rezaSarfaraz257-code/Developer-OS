import React, { useEffect, useState } from "react";
import { apiFetch } from "../src/services/api";

function ProjectCard({ project, onEdit, onDelete, updated, style, onOpen }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (updated) {
      setIsUpdated(true);
      const t = setTimeout(() => setIsUpdated(false), 900);
      return () => clearTimeout(t);
    }
  }, [updated]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`,
    );

    if (!confirmed) return;

    // play a short remove animation before actually calling the API
    setIsRemoving(true);

    await new Promise((r) => setTimeout(r, 300));

    setIsDeleting(true);
    try {
      const response = await apiFetch(`/projects/${project.id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(project.id);
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed. Please try again.");
      // undo removing state so card returns to normal
      setIsRemoving(false);
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`project-card ${isRemoving ? "removing" : ""} ${isUpdated ? "updated" : ""}`}
      aria-busy={isDeleting}
      style={style}
    >
      <div className="project-card-header">
        <h2>{project.title}</h2>
        <span className="project-tag">{project.category || "General"}</span>
      </div>

      <p>{project.description}</p>

      <div className="project-meta-row">
        <span className="project-status">{project.status || "In Progress"}</span>
        {project.link && (
          <a href={project.link} target="_blank" rel="noreferrer" className="project-link">
            Open link
          </a>
        )}
      </div>

      {Array.isArray(project.tags) && project.tags.length > 0 && (
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project-tag small-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="project-card-actions">
        <button className="edit-button" onClick={() => onEdit(project)}>
          Edit
        </button>

        <button className="delete-button" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting…" : "Delete"}
        </button>

        <button className="secondary-button" onClick={() => onOpen?.(project)}>
          Open
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
