import { useEffect, useState } from "react";
import { apiFetch, clearAuth } from "../../services/api";
import Avatar from "../../components/Avatar";
import "./Profile.css";

const maxAvatarBytes = 5 * 1024 * 1024;
const acceptedAvatarTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function ProfilePage({ setPage, isAuthenticated, onProfileUpdate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    full_name: "",
    bio: "",
    github: "",
    linkedin: "",
    website: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      setIsEditing(false);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await apiFetch("/profile/");
        const data = await response.json();
        setProfile(data);
        onProfileUpdate(data);
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          full_name: data.full_name || "",
          bio: data.bio || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          website: data.website || "",
        });
      } catch (error) {
        console.error(error);
        clearAuth();
        setPage("auth");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, onProfileUpdate, setPage]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(removeAvatar ? "" : profile?.avatar_url || "");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile, profile?.avatar_url, removeAvatar]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    setAvatarError("");

    if (!file) {
      return;
    }
    if (!acceptedAvatarTypes.has(file.type)) {
      setAvatarError("Please choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > maxAvatarBytes) {
      setAvatarError("Your profile photo must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setAvatarFile(file);
    setRemoveAvatar(false);
  };

  const resetAvatarSelection = () => {
    setAvatarFile(null);
    setRemoveAvatar(Boolean(profile?.avatar_url));
    setAvatarError("");
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        full_name: form.full_name,
        bio: form.bio,
        github: form.github,
        linkedin: form.linkedin,
        website: form.website,
      };

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      if (removeAvatar) {
        formData.append("remove_avatar", "true");
      }

      const response = await apiFetch("/profile/", {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();
      setProfile(data);
      onProfileUpdate(data);
      setAvatarFile(null);
      setRemoveAvatar(false);
      setAvatarError("");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="profile-page auth-lock">
        <div className="auth-required-box">
          <span className="eyebrow">Access required</span>
          <h2>Please login to view your profile</h2>
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

  const profileName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    "Developer";
  const initials =
    profileName
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "D";

  return (
    <main className="profile-page">
      <div className="profile-header-row">
        <div>
          <span className="eyebrow">Profile</span>
          <h2>Developer profile</h2>
        </div>
        <div className="profile-actions">
          <button
            type="button"
            className="ghost-button"
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => setIsEditing((current) => !current)}
          >
            {isEditing ? "Cancel" : "Edit profile"}
          </button>
        </div>
      </div>

      <div className="profile-layout">
        <section className="profile-card-panel">
          <Avatar
            className="profile-avatar"
            imageUrl={profile?.avatar_url}
            initials={initials}
            label={`${profileName} profile photo`}
          />
          <h3>{profileName}</h3>
          <p>
            {profile?.bio ||
              "Full-stack developer focused on product UX and backend architecture."}
          </p>

          <div className="profile-meta">
            {profile?.github && <span>GitHub</span>}
            {profile?.linkedin && <span>LinkedIn</span>}
            {profile?.website && <span>Website</span>}
          </div>
        </section>

        <section className="profile-summary">
          {loading ? (
            <div className="loading-box">Loading profile...</div>
          ) : isEditing ? (
            <div className="profile-editor">
              <div className="avatar-upload-control">
                <Avatar
                  className="profile-avatar profile-avatar-preview"
                  imageUrl={avatarPreview}
                  initials={initials}
                  label="Profile photo preview"
                />
                <div className="avatar-upload-copy">
                  <span className="eyebrow">Identity image</span>
                  <strong>Profile photo</strong>
                  <p>JPEG, PNG, or WebP · maximum 5 MB</p>
                  <label className="avatar-upload-button">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                    />
                    Choose photo
                  </label>
                  {(avatarFile || profile?.avatar_url) && (
                    <button
                      type="button"
                      className="avatar-remove-button"
                      onClick={resetAvatarSelection}
                    >
                      Remove photo
                    </button>
                  )}
                  {avatarError && <p className="avatar-upload-error">{avatarError}</p>}
                </div>
              </div>
              <label>
                Full name
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                />
              </label>
              <label>
                First name
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                />
              </label>
              <label>
                Last name
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                Bio
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows="4"
                />
              </label>
              <label>
                GitHub
                <input
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                />
              </label>
              <label>
                LinkedIn
                <input
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                />
              </label>
              <label>
                Website
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                />
              </label>

              <button
                type="button"
                className="primary-button"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          ) : (
            <>
              <div className="stats-grid compact-grid">
                <div className="stat-card">
                  <span>Username: </span>
                  <strong className="us">{profile?.username}</strong>
                </div>
                <div className="stat-card">
                  <span >Full-name: </span>
                  <strong className="fs">{profile?.full_name}</strong>
                </div>
                <div className="stat-card">
                  <span >Name: </span>
                  <strong className="ns">{profile?.first_name}</strong>
                </div>
                <div className="stat-card">
                  <span >Last-Name: </span>
                  <strong className="ls">{profile?.last_name}</strong>
                </div>
                <div className="stat-card">
                  <span >Email: </span>
                  <strong className="es">{profile?.email}</strong>
                </div>
                <div className="stat-card">
                  <span >GitHub:</span>
                  <strong className="gs">{profile?.github}</strong>
                </div>
                <div className="stat-card">
                  <span>LinkedIn: </span>
                  <strong className="lis">{profile?.linkedin}</strong>
                </div>
                <div className="stat-card">
                  <span >Website: </span>
                  <strong className="ws">{profile?.website}</strong>
                </div>
              </div>

              <div className="profile-bio">
                <h3>About</h3>
                <p>
                  {profile?.bio ||
                    "I build product-focused interfaces and backend systems that scale with a team. My stack is centered around React, Django, and AI-native developer workflows."}
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
