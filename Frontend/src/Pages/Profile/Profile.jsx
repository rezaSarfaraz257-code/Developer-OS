
export default function ProfilePage({ setPage, isAuthenticated }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
  }, [isAuthenticated, setPage]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
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

      const response = await apiFetch("/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setProfile(data);
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
          <div className="profile-avatar">{initials}</div>
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
                  <span>Username</span>
                  <strong>{profile?.username || "-"}</strong>
                </div>
                <div className="stat-card">
                  <span>Email</span>
                  <strong>{profile?.email || "-"}</strong>
                </div>
                <div className="stat-card">
                  <span>Website</span>
                  <strong>{profile?.website ? "Linked" : "-"}</strong>
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
