const API_BASE = "/api/backend";

export async function backendRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof body === "object" && body ? body.message || body.error : body;
    const error = new Error(message || `Scried API request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return body;
}

export const backendApiBase = API_BASE;
