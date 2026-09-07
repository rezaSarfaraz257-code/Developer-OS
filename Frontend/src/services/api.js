export const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

export function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function authStorage() {
  return window.sessionStorage;
}

export function getAccessToken() {
  return authStorage().getItem("access");
}

export function clearAuth() {
  authStorage().removeItem("access");
  authStorage().removeItem("refresh");
  // Clear tokens issued by earlier releases that persisted in localStorage.
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export function revokeRefreshToken() {
  const refresh = authStorage().getItem("refresh");
  const access = getAccessToken();

  if (!refresh || !access) {
    return;
  }

  // Logout must not block navigation, but it revokes the server-side refresh
  // token whenever the API is reachable.
  void fetch(`${API_URL}/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({ refresh }),
  }).catch(() => {});
}

export async function refreshAccessToken() {
  const refresh = authStorage().getItem("refresh");

  if (!refresh) {
    return null;
  }

  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearAuth();
    return null;
  }

  const data = await response.json();

  if (!data.access) {
    clearAuth();
    return null;
  }

  authStorage().setItem("access", data.access);
  if (data.refresh) {
    authStorage().setItem("refresh", data.refresh);
  }
  return data.access;
}

export async function apiFetch(endpoint, options = {}) {
  const token = getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && authStorage().getItem("refresh")) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      headers.Authorization = `Bearer ${refreshedToken}`;
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
    }
  }

  if (!response.ok) {
    // Try to parse JSON error payload for clearer messages
    let errorPayload = null;
    try {
      errorPayload = await response.json();
    } catch {
      // ignore json parse errors
    }

    // If authentication failed and refresh is not available or refresh failed, clear auth
    if (response.status === 401) {
      // Ensure tokens are cleared so UI can handle redirect to auth
      clearAuth();

      // Dispatch a global event so the app UI can react immediately
      try {
        const msg = (errorPayload && (errorPayload.detail || errorPayload.error || errorPayload.message)) || "Authentication required";
        window.dispatchEvent(new CustomEvent("auth:expired", { detail: { message: msg } }));
      } catch {
        // ignore in non-browser environments
      }

      throw new Error(
        (errorPayload && (errorPayload.detail || errorPayload.error || errorPayload.message)) ||
          "Authentication required",
      );
    }

    const message =
      (errorPayload && (errorPayload.detail || errorPayload.error || errorPayload.message)) ||
      (await response.text().catch(() => "")) ||
      "Request failed";

    throw new Error(message);
  }

  return response;
}
