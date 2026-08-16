import { apiFetch } from "../src/services/api";

function ProjectCard({ project, onEdit, onDelete }) {
  const handleDelete = async () => {
    const response = await apiFetch(`/project/${project.id}/`, {
      method: "DELETE",
    });

    if (response.ok) {
      onDelete(project.id);
    }
  };

  return (
    <div>
      <h2>{project.title}</h2>

      <p>{project.description}</p>

      <button onClick={() => onEdit(project)}>Edit</button>

      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default ProjectCard;
