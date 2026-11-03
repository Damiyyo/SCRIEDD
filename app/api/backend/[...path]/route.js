const BACKEND_API_BASE = (
  process.env.SCRIED_BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_SCRIED_API_BASE_URL ||
  "https://scried-backend.onrender.com/api/v1"
).replace(/\/$/, "");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hopByHopHeaders = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

export async function proxyRequest(request, { params }) {
  const { path } = await params;
  const upstreamUrl = `${BACKEND_API_BASE}/${path.join("/")}${new URL(request.url).search}`;
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (!hopByHopHeaders.has(key.toLowerCase())) headers.set(key, value);
  });

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const response = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const contentType = response.headers.get("content-type");
  if (contentType) responseHeaders.set("content-type", contentType);
  const location = response.headers.get("location");
  if (location) responseHeaders.set("location", location);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
