import { useState } from "react";

export default function QuickCreateModal({ onClose, onCreate, creating }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: description.trim() });
  };

  return (
    <div className="modal-overlay">
      <div className="quick-create-modal">
        <header className="modal-header">
          <h3>Quick create project</h3>
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        </header>

        <form className="quick-create-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              required
            />
          </label>

          <label>
            Description (optional)
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary"
              rows={3}
            />
          </label>

          <div className="modal-actions">
            <button type="submit" className="primary-button" disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </button>
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
