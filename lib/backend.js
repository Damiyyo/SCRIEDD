const API_BASE = process.env.NEXT_PUBLIC_SCRIED_API_BASE_URL || "https://scried-backend.onrender.com/api/v1";

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
    throw new Error(message || `Scried API request failed (${response.status})`);
  }
  return body;
}

export const backendApiBase = API_BASE;
