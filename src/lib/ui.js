import { SCRIED_POSTS } from "@/data/posts";
import { SCRIED_TESTIMONIALS } from "@/data/content";
import { Store } from "./store";
/** HTML-escape text that is inserted into an HTML string (only needed where markup is injected, e.g. story bodies). */
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export const initials = (n) =>
  String(n || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "S";
export const first = (n) => String(n || "").split(" ")[0];
export const fmtDate = (iso, opts = { day: "numeric", month: "short", year: "numeric" }) =>
  iso ? new Date(iso.length === 10 ? iso + "T12:00:00" : iso).toLocaleDateString("en-GB", opts) : "";
export const ago = (iso) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 3600) return Math.max(1, Math.round(s / 60)) + " min ago";
  if (s < 86400) return Math.round(s / 3600) + " hours ago";
  return Math.round(s / 86400) + " days ago";
};
// ---------------------------------------------------------- flash messages
// Stored in sessionStorage (as in the original) and announced to the <Flash/> component.
export const FLASH_EVENT = "scried:flash";
/** Queue a message for the next page you navigate to (the original shows it after the page change). */
export function flash(text, kind = "success") {
  sessionStorage.setItem("scried_flash", JSON.stringify({ text, kind }));
}
/** Show a message on the page you're already on. */
export function flashNow(text, kind = "success") {
  flash(text, kind);
  window.dispatchEvent(new Event(FLASH_EVENT));
}
export const alertBox = (text) => flashNow(text, "error");
/** Photos / videos listed in the content files live in /public (e.g. public/images/…). */
export const assetUrl = (p) => (/^(https?:)?\/\//.test(p) || p.startsWith("/") ? p : "/" + p);
// ---------------------------------------------------------- redirects
/** Only allow same-site relative paths in ?next= redirects. */
export const safeNext = (next) => (next && next.startsWith("/") && !next.startsWith("//") ? next : "");
// ---------------------------------------------------------- forms
export function formData(form) {
  const d = {};
  form.querySelectorAll("input, select, textarea").forEach((el) => {
    if (!el.name) return;
    if (el instanceof HTMLInputElement && el.type === "checkbox") d[el.name] = el.checked;
    else if (el instanceof HTMLInputElement && el.type === "radio") {
      if (el.checked) d[el.name] = el.value;
    } else if (!(el instanceof HTMLInputElement && el.type === "file")) d[el.name] = el.value;
  });
  return d;
}
// ---------------------------------------------------------- content visibility (sample items only show while demo data is on)
export const visibleTestimonials = (demo) => SCRIED_TESTIMONIALS.filter((t) => !t.sample || demo);
export const visiblePosts = (demo) => SCRIED_POSTS.filter((p) => !p.sample || demo);
export const CATS = [
  ["guides", "Guides"],
  ["sessions", "Sessions"],
  ["alumni", "Alumni spotlight"],
  ["students", "Student stories"],
  ["insights", "Insights"]
];
export const catLabel = (k) => (CATS.find((c) => c[0] === k) || [k, k])[1];
export const youtubeId = (u) => {
  const m = String(u || "").match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
};
// ---------------------------------------------------------- downloads / files
export function download(name, text, type = "text/csv") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  document.body.append(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 1000);
}
export async function openCertificate(id) {
  const f = await Store.openCertificate(id);
  if (!f) {
    alertBox("This certificate isn't available on this device.");
    return;
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(f.blob);
  a.target = "_blank";
  a.rel = "noopener";
  document.body.append(a);
  a.click();
  setTimeout(() => a.remove(), 1000);
}
