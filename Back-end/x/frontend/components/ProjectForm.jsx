import { useEffect, useState } from "react";

function ProjectForm({
  project,
  onProjectCreated,
  onProjectUpdated,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // وقتی روی Edit کلیک شد
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [project]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // UPDATE
    if (project) {
      const response = await fetch(
        `http://127.0.0.1:8000/api/projects/${project.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
          }),
        }
      );

      if (response.ok) {
        const updatedProject = await response.json();

        onProjectUpdated(updatedProject);

        setTitle("");
        setDescription("");
      } else {
        console.error(
          "Update failed:",
          await response.text()
        );
      }

      return;
    }

    // CREATE
    const response = await fetch(
      "http://127.0.0.1:8000/api/projects/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      }
    );

    if (response.ok) {
      const newProject = await response.json();

      onProjectCreated(newProject);

      setTitle("");
      setDescription("");
    } else {
      console.error(
        "Create failed:",
        await response.text()
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Project title"
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
      />

      <textarea
        placeholder="Project description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
      />

      <button type="submit">
        {project ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}

export default ProjectForm;