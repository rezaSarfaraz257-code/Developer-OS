import React, { useEffect, useState } from "react";
import { apiFetch } from "../src/services/api";

function ProjectCard({ project, onEdit, onDelete, updated, style }) {
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
      <h2>{project.title}</h2>

      <p>{project.description}</p>

      <div className="project-card-actions">
        <button className="edit-button" onClick={() => onEdit(project)}>
          Edit
        </button>

        <button className="delete-button" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
