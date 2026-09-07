import { useEffect, useState } from "react";
import { apiFetch, safeExternalUrl } from "../src/services/api";

function Profile({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    full_name: "",
    avatar_url: "",
    bio: "",
    github: "",
    linkedin: "",
    x: "",
    website: "",
  });
  const [message, setMessage] = useState(null);
  const avatarUrl = safeExternalUrl(data.avatar_url);

  useEffect(() => {
    let mounted = true;
    apiFetch("/profile/")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setData((current) => ({ ...current, ...json }));
      })
      .catch((e) => {
        console.error(e);
        setMessage("Failed to load profile.");
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  const handleChange = (field) => (e) => setData({ ...data, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await apiFetch("/profile/", {
        method: "PATCH",
        body: JSON.stringify({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          bio: data.bio,
          github: data.github,
          linkedin: data.linkedin,
          x: data.x,
          website: data.website,
        }),
      });

      const json = await response.json();
      setData((current) => ({ ...current, ...json }));
      setMessage("Profile saved successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-modal">
      <div className="profile-card">
        <header className="profile-header">
          <h2>My Profile</h2>
          <button className="secondary-button" onClick={onClose}>Close</button>
        </header>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-avatar-block">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="profile-avatar" />
              ) : (
                <div className="profile-avatar placeholder">{(data.full_name || data.username || "U").charAt(0).toUpperCase()}</div>
              )}
            </div>

            <label>
              Username
              <input value={data.username} disabled />
            </label>

            <div className="profile-two-col">
              <label>
                First name
                <input value={data.first_name || ""} onChange={handleChange("first_name")} />
              </label>

              <label>
                Last name
                <input value={data.last_name || ""} onChange={handleChange("last_name")} />
              </label>
            </div>

            <label>
              Full name
              <input value={data.full_name || ""} onChange={handleChange("full_name")} />
            </label>

            <label>
              Email
              <input value={data.email || ""} onChange={handleChange("email")} />
            </label>

            <label>
              Avatar URL
              <input value={data.avatar_url || ""} onChange={handleChange("avatar_url")} />
            </label>

            <label>
              Bio
              <textarea value={data.bio || ""} onChange={handleChange("bio")} rows={4} />
            </label>

            <div className="profile-two-col">
              <label>
                GitHub
                <input value={data.github || ""} onChange={handleChange("github")} />
              </label>

              <label>
                LinkedIn
                <input value={data.linkedin || ""} onChange={handleChange("linkedin")} />
              </label>
            </div>

            <div className="profile-two-col">
              <label>
                X / Twitter
                <input value={data.x || ""} onChange={handleChange("x")} />
              </label>

              <label>
                Website
                <input value={data.website || ""} onChange={handleChange("website")} />
              </label>
            </div>

            <div className="profile-actions">
              <button className="primary-button" type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button type="button" className="secondary-button" onClick={onClose}>
                Cancel
              </button>
            </div>

            {message && <p className="form-message success">{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
