const API_URL = "http://127.0.0.1:8000/api";

export function clearAuth() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");

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

  localStorage.setItem("access", data.access);
  return data.access;
}

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("access");

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

  if (response.status === 401 && localStorage.getItem("refresh")) {
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
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }

  return response;
}
