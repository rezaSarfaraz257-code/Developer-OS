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

let refreshPromise = null;
let refreshTokenInFlight = null;

function formatErrorMessage(payload, fallback = "Request failed.") {
  if (!payload) {
    return fallback;
  }
  if (typeof payload === "string") {
    return payload || fallback;
  }
  if (Array.isArray(payload)) {
    return payload.filter(Boolean).join(" ") || fallback;
  }

  const directMessage = payload.detail || payload.error || payload.message;
  if (directMessage) {
    return Array.isArray(directMessage)
      ? directMessage.join(" ")
      : String(directMessage);
  }

  // Django REST Framework returns validation failures as field -> messages.
  // Preserve those messages instead of replacing them with "Request failed".
  const fieldMessages = Object.entries(payload)
    .map(([field, messages]) => {
      const text = Array.isArray(messages)
        ? messages.join(" ")
        : typeof messages === "string"
          ? messages
          : "";
      return text ? `${field}: ${text}` : "";
    })
    .filter(Boolean);

  return fieldMessages.join(" ") || fallback;
}

async function readErrorPayload(response) {
  const responseText = await response.text().catch(() => "");
  if (!responseText) {
    return null;
  }
  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

async function requestRefreshToken(refresh) {
  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  // A logout or new login occurred while this request was in flight.
  // Never overwrite or clear that newer session with an old refresh result.
  if (authStorage().getItem("refresh") !== refresh) {
    return null;
  }

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

export function refreshAccessToken() {
  const refresh = authStorage().getItem("refresh");
  if (!refresh) {
    return Promise.resolve(null);
  }

  // Refresh-token rotation invalidates the previous refresh token. A single
  // shared request prevents simultaneous API calls from invalidating each
  // other's refresh attempt and producing random 401s.
  if (!refreshPromise || refreshTokenInFlight !== refresh) {
    refreshTokenInFlight = refresh;
    refreshPromise = requestRefreshToken(refresh).finally(() => {
      // A newer login may already be refreshing a different token.
      if (refreshTokenInFlight === refresh) {
        refreshPromise = null;
        refreshTokenInFlight = null;
      }
    });
  }
  return refreshPromise;
}

export async function apiFetch(endpoint, options = {}) {
  const token = getAccessToken();
  let tokenUsedForRequest = token;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  // The browser must set the multipart boundary itself. Sending a generic
  // Content-Type header would make otherwise valid image uploads unreadable.
  if (isFormData) {
    Object.keys(headers).forEach((key) => {
      if (key.toLowerCase() === "content-type") {
        delete headers[key];
      }
    });
  }

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
      tokenUsedForRequest = refreshedToken;
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
    }
  }

  if (!response.ok) {
    const errorPayload = await readErrorPayload(response);
    const message = formatErrorMessage(errorPayload);

    // If authentication failed and refresh is not available or refresh failed, clear auth.
    if (response.status === 401) {
      // Do not let an old in-flight request clear a session created after it.
      if (getAccessToken() === tokenUsedForRequest) {
        clearAuth();
      }

      try {
        window.dispatchEvent(
          new CustomEvent("auth:expired", {
            detail: { message: formatErrorMessage(errorPayload, "Authentication required") },
          }),
        );
      } catch {
        // Ignore browser-event failures outside the browser.
      }

      throw new Error(formatErrorMessage(errorPayload, "Authentication required"));
    }

    throw new Error(message);
  }

  return response;
}
