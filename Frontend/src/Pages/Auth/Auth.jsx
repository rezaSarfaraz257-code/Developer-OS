import { useState, useEffect } from "react";
import "./Auth.css";

export default function AuthPage({
  authMode,
  setAuthMode,
  setPage,
  onAuthSuccess,
  loginWithBackend,
  registerWithBackend,
  initialError = null,
}) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authMode === "register") {
        const [firstName, ...lastNameParts] = (form.fullName || "")
          .trim()
          .split(/\s+/);
        const payload = {
          username: form.username,
          email: form.email,
          password: form.password,
          first_name: firstName || "",
          last_name: lastNameParts.join(" ") || "",
        };

        await registerWithBackend(payload);
        await loginWithBackend(form.username, form.password);
      } else {
        await loginWithBackend(form.username, form.password);
      }

      onAuthSuccess();
    } catch (submitError) {
      setError(submitError.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="auth-intro">
          <span className="eyebrow">Developer access</span>
          <h2>Access your workspace</h2>
          <p>
            Keep your tools, projects, and learning paths in a single place
            designed for modern developers.
          </p>
          <ul>
            <li>Track progress</li>
            <li>Save key resources</li>
            <li>Build faster with focus</li>
          </ul>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === "register" ? "active" : ""}
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {authMode === "register" && (
              <>
                <label>
                  Username
                  <input
                    type="text"
                    name="username"
                    placeholder="developer123"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Full name
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Alex Morgan"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </label>
              </>
            )}

            {authMode === "login" && (
              <label>
                Username
                <input
                  type="text"
                  name="username"
                  placeholder="developer123"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                required={authMode === "register"}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="primary-button full-width"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : authMode === "login"
                  ? "Login to workspace"
                  : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
