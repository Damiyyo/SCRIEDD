/* =========================================================
   SCRIED STORE
   Every read and write of data goes through this file.

   RIGHT NOW: data is saved in this browser only (localStorage, and
   IndexedDB for certificate files). Good for demos and testing.

   TO GO LIVE: replace the functions marked [BACKEND] with calls to
   Firebase or Supabase. The pages only use the functions exported at
   the bottom, so nothing else has to change.
   ========================================================= */
import {
  SCRIED_AGES,
  SCRIED_LEVELS,
  SCRIED_OPPORTUNITIES,
  SCRIED_OUTCOMES,
  SCRIED_SAMPLE_OPPORTUNITIES,
  SCRIED_SCHOOLS,
  SCRIED_TYPES
} from "@/data/content";
const hasWindow = typeof window !== "undefined";
const KEY = "scried_db_v1";
const SESSION = "scried_session";
const GUEST = "scried_guest_apps";
const DONE = ["completed", "verified"];
// ---------------------------------------------------------- helpers
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const today = (d = new Date()) => d.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
const addDays = (iso, n) => {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return today(d);
};
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const norm = (s) => String(s || "").trim();
const lower = (s) => norm(s).toLowerCase();
async function hash(password, salt) {
  const text = salt + ":" + password;
  if (hasWindow && window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 0;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) | 0;
  return "x" + h; // fallback for very old browsers
}
let readyFlag = false;
let snapshot = { v: 0, ready: false };
const SERVER_SNAPSHOT = { v: 0, ready: false };
const listeners = new Set();
function emit() {
  snapshot = { v: snapshot.v + 1, ready: readyFlag };
  listeners.forEach((l) => l());
}
const subscribe = (l) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const getSnapshot = () => snapshot;
const getServerSnapshot = () => SERVER_SNAPSHOT;
// ---------------------------------------------------------- [BACKEND] load / save
function empty() {
  return { users: [], apps: [], completions: [], activity: [], opps: [], hiddenOpps: [], enquiries: [], demo: false };
}
let db = empty();
function load() {
  let parsed = null;
  if (hasWindow) {
    try {
      parsed = JSON.parse(localStorage.getItem(KEY) || "null") || null;
    } catch {
      parsed = null;
    }
  }
  db = parsed || empty();
  const base = empty();
  const cur = db;
  for (const k of Object.keys(base)) if (!(k in cur)) cur[k] = base[k];
  return db;
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch (e) {
    console.warn("Scried: could not save", e);
    throw new Error("Your browser couldn't save this. Free up some space or turn off private browsing, then try again.");
  }
  emit();
}
load();
// The original site was one page per file, so every page re-read localStorage on load.
// In a single-page app another tab can change the data underneath us, so pick those changes up too.
if (hasWindow) {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY || e.key === SESSION || e.key === null) {
      load();
      emit();
    }
  });
}
// ---------------------------------------------------------- [BACKEND] certificate files (IndexedDB)
function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open("scried_files", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("files");
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function putFile(id, file) {
  const d = await idb();
  return new Promise((res, rej) => {
    const tx = d.transaction("files", "readwrite");
    tx.objectStore("files").put({ blob: file, name: file.name, type: file.type }, id);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}
async function getFile(id) {
  const d = await idb();
  return new Promise((res, rej) => {
    const r = d.transaction("files").objectStore("files").get(id);
    r.onsuccess = () => res(r.result || null);
    r.onerror = () => rej(r.error);
  });
}
// ---------------------------------------------------------- reference data
const schools = () => SCRIED_SCHOOLS;
const school = (id) => SCRIED_SCHOOLS.find((s) => s.id === id) || null;
const label = (list, key) => (list.find((x) => x[0] === key) || [null, key || "Not given"])[1];
const levelLabel = (k) => label(SCRIED_LEVELS, k);
const ageLabel = (k) => label(SCRIED_AGES, k);
const typeLabel = (k) => label(SCRIED_TYPES, k);
const outcomeLabel = (k) => label(SCRIED_OUTCOMES, k);
const schoolName = (rec) => (rec.school ? (school(rec.school) || { name: "" }).name : norm(rec.schoolOther)) || "Not given";
// ---------------------------------------------------------- opportunities
function allOpps() {
  const base = [...SCRIED_OPPORTUNITIES];
  if (db.demo) base.push(...SCRIED_SAMPLE_OPPORTUNITIES);
  const map = new Map(base.map((o) => [o.id, { ...o }]));
  for (const o of db.opps) map.set(o.id, { ...map.get(o.id), ...o }); // staff edits and new ones
  return [...map.values()]
    .filter((o) => !db.hiddenOpps.includes(o.id))
    .map((o) => {
      if (o.deadlineInDays != null && !o.deadline) o.deadline = addDays(today(), o.deadlineInDays); // sample listings stay "closing soon" relative to today
      return o;
    });
}
function daysLeft(o) {
  if (!o.deadline) return null;
  return Math.round((new Date(o.deadline + "T12:00:00").getTime() - new Date(today() + "T12:00:00").getTime()) / 86400000);
}
const isOpen = (o) => o.deadline == null || daysLeft(o) >= 0;
function dueLabel(o) {
  const d = daysLeft(o);
  if (d === null) return "Open now";
  if (d < 0) return "Closed";
  if (d === 0) return "Closes today";
  if (d === 1) return "1 day left";
  if (d <= 7) return d + " days left";
  return "Closes " + new Date(o.deadline + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
const closingSoon = (o) => {
  const d = daysLeft(o);
  return d !== null && d >= 0 && d <= 7;
};
const getOpp = (id) => allOpps().find((o) => o.id === id) || null;
function listOpps({ q = "", type = "", includeClosed = false } = {}) {
  q = lower(q);
  return allOpps()
    .filter((o) => includeClosed || isOpen(o))
    .filter((o) => !type || o.type === type)
    .filter((o) => !q || [o.title, o.org, o.eligibility, o.summary, typeLabel(o.type)].join(" ").toLowerCase().includes(q))
    .sort((a, b) => (daysLeft(a) ?? 9999) - (daysLeft(b) ?? 9999));
}
function saveOpp(o) {
  const i = db.opps.findIndex((x) => x.id === o.id);
  if (i >= 0) db.opps[i] = o;
  else db.opps.push(o);
  db.hiddenOpps = db.hiddenOpps.filter((x) => x !== o.id);
  save();
  return o;
}
function removeOpp(id) {
  db.opps = db.opps.filter((o) => o.id !== id);
  db.hiddenOpps.push(id);
  save();
}
// ---------------------------------------------------------- accounts
const findUser = (email) => db.users.find((u) => u.email === lower(email));
const userById = (id) => db.users.find((u) => u.id === id) || null;
function currentUser() {
  const id = hasWindow ? localStorage.getItem(SESSION) : null;
  return id ? userById(id) : null;
}
function setSession(u) {
  localStorage.setItem(SESSION, u.id);
  emit();
}
function signOut() {
  localStorage.removeItem(SESSION);
  emit();
}
const PROFILE = ["fullName", "phone", "school", "schoolOther", "course", "level", "age"];
function validateProfile(f, { needEmail = true } = {}) {
  const e = {};
  if (!norm(f.fullName)) e.fullName = "Enter your name as it should appear on certificates.";
  if (needEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm(f.email))) e.email = "Enter a valid email address, like name@gmail.com.";
  if (!/^[+\d][\d\s-]{6,}$/.test(norm(f.phone))) e.phone = "Enter your WhatsApp number, like 0803 000 0000.";
  if (!f.school && !norm(f.schoolOther)) e.school = "Choose your school, or type it in the box below if it's not listed.";
  if (!norm(f.course)) e.course = "Enter your course.";
  if (!f.level) e.level = "Choose your level.";
  if (!f.age) e.age = "Choose your age range.";
  return e;
}
function checkPassword(pw) {
  if (!pw || pw.length < 8) return "Use at least 8 characters.";
  if (/^\d+$/.test(pw)) return "Use letters as well as numbers.";
  if (["password", "12345678", "password1", "qwertyui"].includes(pw.toLowerCase())) return "That password is too common. Choose another.";
  return null;
}
function linkGuestApps(u) {
  db.apps.filter((a) => !a.userId && a.email === u.email).forEach((a) => (a.userId = u.id));
}
async function signUp(f) {
  const errors = validateProfile(f);
  if (findUser(f.email)) errors.email = "An account with this email already exists. Sign in instead.";
  const pwErr = checkPassword(f.password);
  if (pwErr) errors.password = pwErr;
  if (!f.consent) errors.consent = "Tick the box to agree before creating your account.";
  if (Object.keys(errors).length) return { errors };
  const salt = uid();
  const u = { id: uid(), email: lower(f.email), salt, pw: await hash(f.password, salt), joined: new Date().toISOString(), isStaff: false };
  PROFILE.forEach((k) => (u[k] = norm(f[k])));
  db.users.push(u);
  linkGuestApps(u);
  save();
  setSession(u);
  return { user: u };
}
async function signIn(email, password) {
  const u = findUser(email);
  if (!u || (await hash(password, u.salt)) !== u.pw) return { error: "That email and password don't match. Check them and try again." };
  linkGuestApps(u);
  save();
  setSession(u);
  return { user: u };
}
function updateProfile(f) {
  const u = currentUser();
  if (!u) return { errors: { fullName: "Sign in again." } };
  const errors = validateProfile(f, { needEmail: false });
  if (Object.keys(errors).length) return { errors };
  PROFILE.forEach((k) => (u[k] = norm(f[k])));
  save();
  return { user: u };
}
async function resetPassword(email, newPassword) {
  // Prototype only: a real backend emails a reset link instead.
  const u = findUser(email);
  if (!u) return { error: "No account uses that email." };
  const e = checkPassword(newPassword);
  if (e) return { error: e };
  u.pw = await hash(newPassword, u.salt);
  save();
  return { ok: true };
}
const profileComplete = (u) =>
  PROFILE.filter((k) => k !== "school" && k !== "schoolOther").every((k) => norm(u[k])) && !!(u.school || norm(u.schoolOther));
// ---------------------------------------------------------- activity and streaks
function logActivity(kind, ref = "") {
  const u = currentUser();
  if (!u || u.isStaff) return;
  const day = today();
  if (!db.activity.some((a) => a.userId === u.id && a.day === day && a.kind === kind && a.ref === ref)) {
    db.activity.push({ userId: u.id, day, kind, ref });
    save();
  }
}
const activeDays = (userId) => new Set(db.activity.filter((a) => a.userId === userId).map((a) => a.day));
function streak(userId) {
  const days = activeDays(userId);
  let cur = days.has(today()) ? today() : addDays(today(), -1),
    n = 0;
  while (days.has(cur)) {
    n++;
    cur = addDays(cur, -1);
  }
  return n;
}
function longestStreak(userId) {
  const days = [...activeDays(userId)].sort();
  let best = 0,
    run = 0,
    prev = null;
  for (const d of days) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}
function week(userId) {
  const days = activeDays(userId),
    t = new Date(today() + "T12:00:00");
  const monday = addDays(today(), -((t.getDay() + 6) % 7));
  return [...Array(7)].map((_, i) => {
    const d = addDays(monday, i);
    return { day: d, label: "MTWTFSS"[i], done: days.has(d), today: d === today(), future: d > today() };
  });
}
const todayLog = (userId) => db.activity.filter((a) => a.userId === userId && a.day === today());
// ---------------------------------------------------------- applications
function guestMap() {
  try {
    return JSON.parse(localStorage.getItem(GUEST) || "null") || {};
  } catch {
    return {};
  }
}
function myApp(oppId) {
  const u = currentUser();
  if (u) return db.apps.find((a) => a.opp === oppId && a.email === u.email) || null;
  if (!hasWindow) return null;
  const id = guestMap()[oppId];
  return id ? db.apps.find((a) => a.id === id) || null : null;
}
async function apply(oppId, f) {
  const opp = getOpp(oppId);
  if (!opp) return { errors: { form: "This opportunity no longer exists." } };
  if (!isOpen(opp)) return { errors: { form: "This opportunity has closed." } };
  let u = currentUser();
  const email = u ? u.email : lower(f.email);
  const errors = validateProfile({ ...f, email });
  if (!f.consent) errors.consent = "Tick the box to agree before you continue.";
  if (!u && f.saveDetails) {
    if (findUser(email)) errors.email = "You already have an account with this email. Sign in to fill this form automatically.";
    else {
      const e = checkPassword(f.password);
      if (e) errors.password = e;
    }
  }
  if (Object.keys(errors).length) return { errors };
  const existing = db.apps.find((a) => a.opp === oppId && a.email === email);
  if (existing) {
    rememberGuest(oppId, existing.id);
    return { app: existing, existing: true };
  }
  if (!u && f.saveDetails) {
    const res = await signUp({ ...f, email, consent: true });
    if (res.errors) return { errors: res.errors };
    u = res.user;
  }
  const a = {
    id: uid(),
    opp: oppId,
    userId: u ? u.id : null,
    email,
    consent: true,
    status: "applied",
    created: new Date().toISOString(),
    clicked: null
  };
  PROFILE.forEach((k) => (a[k] = norm(f[k])));
  if (u) {
    const uu = u;
    PROFILE.forEach((k) => {
      if (norm(f[k])) uu[k] = norm(f[k]);
    });
    if (!f.school) u.school = ""; // keep profile current
  }
  db.apps.push(a);
  save();
  rememberGuest(oppId, a.id);
  logActivity("apply", oppId);
  return { app: a, createdAccount: !!(f.saveDetails && u) };
}
function rememberGuest(oppId, appId) {
  const m = guestMap();
  m[oppId] = appId;
  localStorage.setItem(GUEST, JSON.stringify(m));
}
function clickThrough(oppId) {
  const a = myApp(oppId);
  if (!a) return null;
  if (!a.clicked) {
    a.clicked = new Date().toISOString();
    save();
  }
  return getOpp(oppId).link;
}
const myApps = () => {
  const u = currentUser();
  return u ? db.apps.filter((a) => a.userId === u.id).sort((a, b) => b.created.localeCompare(a.created)) : [];
};
const completionFor = (appId) => db.completions.find((c) => c.appId === appId) || null;
function reopen(appId) {
  const u = currentUser();
  const a = db.apps.find((x) => x.id === appId && u && x.userId === u.id);
  if (!a) return;
  db.completions = db.completions.filter((c) => c.appId !== appId);
  a.status = "applied";
  a.clicked = a.clicked || null;
  save();
}
async function complete(appId, f, file) {
  const u = currentUser();
  const a = db.apps.find((x) => x.id === appId && u && x.userId === u.id);
  if (!a) return { errors: { form: "We couldn't find that application on your account." } };
  if (completionFor(appId)) return { errors: { form: "You've already marked this one complete." } };
  const opp = getOpp(a.opp) || {};
  const errors = {};
  if (!f.outcome) errors.outcome = "Choose what happened.";
  if (!f.rating) errors.rating = "Rate how useful it was.";
  if (file) {
    if (file.size > 5 * 1024 * 1024) errors.file = "That file is bigger than 5MB. Upload a smaller photo or PDF.";
    else if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) errors.file = "Upload a PDF, JPG or PNG file.";
  } else if (opp.certificate && ["finished", "selected"].includes(f.outcome)) {
    errors.file = "Upload your certificate or proof so we can verify your completion.";
  }
  if (Object.keys(errors).length) return { errors };
  const c = {
    id: uid(),
    appId,
    outcome: f.outcome,
    rating: +f.rating,
    gained: norm(f.gained),
    usedFor: norm(f.usedFor),
    recommend: !!f.recommend,
    file: file ? { name: file.name, type: file.type } : null,
    submitted: new Date().toISOString(),
    verified: false,
    verifiedAt: null,
    note: ""
  };
  if (file) await putFile(c.id, file);
  db.completions.push(c);
  a.status = "completed";
  save();
  logActivity("complete", a.opp);
  return { completion: c };
}
async function openCertificate(completionId) {
  const u = currentUser();
  const c = db.completions.find((x) => x.id === completionId);
  if (!u || !c) return null;
  const a = db.apps.find((x) => x.id === c.appId);
  if (!(u.isStaff || (a && a.userId === u.id))) return null; // private: owner and staff only
  return getFile(completionId);
}
// ---------------------------------------------------------- staff
const requireStaff = () => {
  const u = currentUser();
  return !!(u && u.isStaff);
};
function verify(completionId, approve, note = "") {
  if (!requireStaff()) return;
  const c = db.completions.find((x) => x.id === completionId);
  if (!c) return;
  const a = db.apps.find((x) => x.id === c.appId);
  if (approve) {
    c.verified = true;
    c.verifiedAt = new Date().toISOString();
    c.note = "";
    a.status = "verified";
  } else c.note = norm(note) || "Certificate could not be verified";
  save();
}
function checkEnquiry(kind, f) {
  const e = {};
  if (kind === "opportunity" && !/^https?:\/\/\S+\.\S+/.test(norm(f.link))) e.link = "Paste the official link, starting with https://";
  if (!norm(f.name)) e.name = "Enter your name.";
  if (!norm(f.organisation)) e.organisation = "Enter your organisation.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm(f.email))) e.email = "Enter a valid email address.";
  if (!norm(f.details)) e.details = "Tell us a little more.";
  return e;
}
function addEnquiry(kind, f) {
  const e = checkEnquiry(kind, f);
  if (Object.keys(e).length) return { errors: e };
  db.enquiries.unshift({ id: uid(), kind, ...f, created: new Date().toISOString() });
  save();
  return { ok: true };
}
function overview() {
  return {
    students: db.users.filter((u) => !u.isStaff).length,
    applications: db.apps.length,
    completions: db.apps.filter((a) => DONE.includes(a.status)).length,
    verified: db.apps.filter((a) => a.status === "verified").length,
    schools: new Set(db.apps.filter((a) => a.school).map((a) => a.school)).size,
    pending: db.completions.filter((c) => !c.verified).length,
    enquiries: db.enquiries.slice(0, 5),
    opps: allOpps()
      .map((o) => {
        const apps = db.apps.filter((a) => a.opp === o.id);
        return {
          ...o,
          n: apps.length,
          clicked: apps.filter((a) => a.clicked).length,
          done: apps.filter((a) => DONE.includes(a.status)).length,
          verified: apps.filter((a) => a.status === "verified").length
        };
      })
      .sort((a, b) => b.n - a.n)
  };
}
function breakdown(items, keyFn, labelFn, limit) {
  const m = new Map();
  items.forEach((x) => {
    const k = keyFn(x);
    m.set(k, (m.get(k) || 0) + 1);
  });
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit || 99)
    .map(([k, n]) => ({ label: labelFn ? labelFn(k) : k || "Not given", n, pct: pct(n, items.length) }));
}
function oppReport(oppId) {
  const opp = getOpp(oppId);
  if (!opp) return null;
  const apps = db.apps.filter((a) => a.opp === oppId);
  const done = apps.filter((a) => DONE.includes(a.status));
  const comps = apps.map((a) => completionFor(a.id)).filter((c) => !!c);
  const byDay = new Map();
  apps.forEach((a) => {
    const d = today(new Date(a.created));
    byDay.set(d, (byDay.get(d) || 0) + 1);
  });
  const days = [];
  if (apps.length) {
    const end = [...byDay.keys(), today()].sort().pop();
    const first = [...byDay.keys()].sort()[0];
    let start = addDays(end, -29);
    if (first > start) start = first;
    const peak = Math.max(...byDay.values());
    for (let d = start; d <= end; d = addDays(d, 1)) days.push({ day: d, n: byDay.get(d) || 0, h: pct(byDay.get(d) || 0, peak) });
  }
  const schoolsRows = breakdown(apps, schoolName).map((r) => ({ ...r, done: done.filter((a) => schoolName(a) === r.label).length }));
  const titleCase = (s) =>
    norm(s)
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\b(And|Of|In)\b/g, (w) => w.toLowerCase());
  return {
    opp,
    total: apps.length,
    clicked: apps.filter((a) => a.clicked).length,
    done: done.length,
    verified: apps.filter((a) => a.status === "verified").length,
    clickRate: pct(apps.filter((a) => a.clicked).length, apps.length),
    doneRate: pct(done.length, apps.length),
    schools: schoolsRows,
    nSchools: schoolsRows.length,
    levels: breakdown(apps, (a) => a.level, levelLabel),
    ages: breakdown(apps, (a) => a.age, ageLabel),
    courses: breakdown(apps, (a) => titleCase(a.course), null, 8),
    outcomes: breakdown(comps, (c) => c.outcome, outcomeLabel),
    avgRating: comps.length ? (comps.reduce((s, c) => s + c.rating, 0) / comps.length).toFixed(1) : null,
    recommend: pct(comps.filter((c) => c.recommend).length, comps.length),
    nFeedback: comps.length,
    voices: comps
      .filter((c) => c.gained)
      .slice(0, 6)
      .map((c) => ({ c, a: db.apps.find((a) => a.id === c.appId) })),
    days,
    apps
  };
}
function oppCsv(oppId) {
  const rows = [
    [
      "Name on certificate",
      "Email",
      "WhatsApp",
      "School",
      "Course",
      "Level",
      "Age range",
      "Registered",
      "Went to official link",
      "Status",
      "Outcome",
      "Rating",
      "Would recommend",
      "Certificate verified"
    ]
  ];
  db.apps
    .filter((a) => a.opp === oppId)
    .forEach((a) => {
      const c = completionFor(a.id);
      rows.push([
        a.fullName ?? "",
        a.email,
        a.phone ?? "",
        schoolName(a),
        a.course ?? "",
        levelLabel(a.level),
        ageLabel(a.age),
        a.created.slice(0, 16).replace("T", " "),
        a.clicked ? "Yes" : "No",
        a.status,
        c ? outcomeLabel(c.outcome) : "",
        c ? c.rating : "",
        c ? (c.recommend ? "Yes" : "No") : "",
        c ? (c.verified ? "Yes" : "No") : ""
      ]);
    });
  return rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
}
/* School ranking.
   Score = registrations + 2 × completions + 3 × verified certificates.
   Percentile = share of other schools with a lower score. */
function schoolRows(type = "") {
  const opps = new Map(allOpps().map((o) => [o.id, o]));
  const apps = db.apps.filter((a) => a.school && (!type || (opps.get(a.opp) || {}).type === type));
  const m = new Map();
  apps.forEach((a) => {
    const r = m.get(a.school) || { school: school(a.school), n: 0, done: 0, verified: 0, emails: new Set() };
    r.n++;
    if (DONE.includes(a.status)) r.done++;
    if (a.status === "verified") r.verified++;
    r.emails.add(a.email);
    m.set(a.school, r);
  });
  const rows = [...m.values()].map((r) => ({ ...r, students: r.emails.size, rate: pct(r.done, r.n), score: r.n + 2 * r.done + 3 * r.verified }));
  rows.sort((a, b) => b.score - a.score || b.rate - a.rate);
  const top = rows.length ? rows[0].score : 1;
  return rows.map((r, i) => {
    const percentile = rows.length > 1 ? pct(rows.filter((x) => x.score < r.score).length, rows.length - 1) : 100;
    return {
      ...r,
      rank: i + 1,
      percentile,
      tier: percentile >= 75 ? "Top 25%" : percentile >= 25 ? "Middle 50%" : "Bottom 25%",
      bar: pct(r.score, top)
    };
  });
}
function record(userId) {
  const u = userById(userId);
  if (!u) return null;
  const apps = db.apps
    .filter((a) => a.userId === userId)
    .sort((a, b) => b.created.localeCompare(a.created))
    .map((a) => ({ ...a, opp: getOpp(a.opp) || { title: "Removed opportunity", org: "", type: "" }, completion: completionFor(a.id) }));
  const done = apps.filter((a) => DONE.includes(a.status));
  return {
    user: u,
    apps,
    done,
    verified: done.filter((a) => a.status === "verified"),
    rate: pct(done.length, apps.length),
    streak: streak(u.id),
    longest: longestStreak(u.id),
    activeDays: activeDays(u.id).size
  };
}
const pendingVerifications = () =>
  db.completions
    .filter((c) => !c.verified)
    .sort((a, b) => a.submitted.localeCompare(b.submitted))
    .map((c) => {
      const a = db.apps.find((x) => x.id === c.appId);
      return { c, a, opp: getOpp(a.opp) || {} };
    });
const recentVerified = () =>
  db.completions
    .filter((c) => c.verified)
    .sort((a, b) => (b.verifiedAt || "").localeCompare(a.verifiedAt || ""))
    .slice(0, 8)
    .map((c) => {
      const a = db.apps.find((x) => x.id === c.appId);
      return { c, a, opp: getOpp(a.opp) || {} };
    });
function searchStudents(q) {
  q = lower(q);
  return db.users.filter((u) => !u.isStaff && [u.fullName, u.email, u.course, schoolName(u)].join(" ").toLowerCase().includes(q));
}
const hasStaff = () => db.users.some((u) => u.isStaff);
async function createStaff(f) {
  if (hasStaff()) return { errors: { form: "A staff account already exists. Sign in instead." } };
  const e = {};
  if (!norm(f.fullName)) e.fullName = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm(f.email))) e.email = "Enter a valid email address.";
  else if (findUser(f.email)) e.email = "That email already has an account. Use another.";
  const pe = checkPassword(f.password);
  if (pe) e.password = pe;
  if (Object.keys(e).length) return { errors: e };
  const salt = uid();
  const u = {
    id: uid(),
    email: lower(f.email),
    salt,
    pw: await hash(f.password, salt),
    joined: new Date().toISOString(),
    isStaff: true,
    fullName: norm(f.fullName)
  };
  db.users.push(u);
  save();
  setSession(u);
  return { user: u };
}
// ---------------------------------------------------------- demo data
const FIRST = [
  "Chiamaka",
  "Tobi",
  "Ifeanyi",
  "Aisha",
  "Emeka",
  "Zainab",
  "Kelechi",
  "Funmi",
  "Uche",
  "Bola",
  "Ngozi",
  "Femi",
  "Halima",
  "Chidi",
  "Temi",
  "Musa",
  "Ada",
  "Segun",
  "Ebuka",
  "Kemi",
  "Obinna",
  "Amaka",
  "Yusuf",
  "Bisi"
];
const LAST = ["Okafor", "Adeyemi", "Eze", "Bello", "Nwosu", "Ibrahim", "Okeke", "Adebayo", "Obi", "Lawal", "Chukwu", "Ogunleye"];
const COURSES = [
  "Computer Science",
  "Mechanical Engineering",
  "Economics",
  "Mass Communication",
  "Accounting",
  "Electrical Engineering",
  "Microbiology",
  "Business Administration",
  "Law",
  "Medicine and Surgery",
  "Statistics",
  "English"
];
const GAINED = [
  "I use Deep Research to plan my project chapters, and it saves me hours every week.",
  "The practice quizzes from my lecture slides helped me prepare for my exams.",
  "I finally understood recursion after asking for three different explanations.",
  "I learned how to install and size a small solar system for a home.",
  "I use it to summarise long PDFs before lectures so I can follow along better.",
  "It helped me write a cleaner CV and practise for an interview."
];
async function loadDemo() {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const pickW = (arr, w) => {
    let t = rnd() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < arr.length; i++) {
      t -= w[i];
      if (t <= 0) return arr[i];
    }
    return arr[0];
  };
  clearDemo(false);
  db.demo = true;
  db.seededOn = today();
  const sch = schools();
  const weights = sch.map((s) => (s.partner ? 9 : ["unizik", "uniport", "rsu"].includes(s.id) ? 5 : 1));
  const mk = async (email, pw, extra) => {
    const salt = uid();
    const u = { id: uid(), email, salt, pw: await hash(pw, salt), joined: new Date().toISOString(), isStaff: false, isDemo: true, ...extra };
    db.users.push(u);
    return u;
  };
  await mk("admin@scried.test", "scried-admin-2026", { fullName: "Scried Admin", isStaff: true });
  const ada = await mk("ada@scried.test", "scried-demo-2026", {
    fullName: "Ada Obi (sample student)",
    phone: "08030000000",
    school: "coou",
    schoolOther: "",
    course: "Computer Science",
    level: "300",
    age: "18-21"
  });
  const opps = allOpps();
  const iso = (daysAgo, hours = 0) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(d.getHours() - hours);
    return d.toISOString();
  };
  for (let i = 0; i < 64; i++) {
    const u = await mk(`student${i}@scried.test`, "scried-demo-2026", {
      fullName: `${pick(FIRST)} ${pick(LAST)}`,
      phone: "0803" + Math.floor(1000000 + rnd() * 8999999),
      school: pickW(sch, weights).id,
      schoolOther: "",
      course: pick(COURSES),
      level: pick(["100", "200", "300", "400", "500"]),
      age: pickW(["18-21", "22-25", "26-30", "u18", "31+"], [50, 34, 10, 3, 3])
    });
    u.joined = iso(1 + Math.floor(rnd() * 25));
    for (const o of opps) {
      if (rnd() > (o.id === "google-ai-plus" ? 0.92 : 0.3)) continue;
      const created = iso(Math.floor(rnd() * 22), Math.floor(rnd() * 20));
      const a = {
        id: uid(),
        opp: o.id,
        userId: u.id,
        email: u.email,
        consent: true,
        status: "applied",
        created,
        clicked: rnd() < 0.85 ? created : null
      };
      PROFILE.forEach((k) => (a[k] = u[k] || ""));
      db.apps.push(a);
      db.activity.push({ userId: u.id, day: today(new Date(created)), kind: "apply", ref: o.id });
      if (a.clicked && rnd() < 0.5) {
        const v = rnd() < 0.6;
        db.completions.push({
          id: uid(),
          appId: a.id,
          outcome: pick(["finished", "finished", "selected", "dropped"]),
          rating: pickW([5, 4, 3, 2], [45, 35, 15, 5]),
          gained: pick(GAINED),
          usedFor: "",
          recommend: rnd() < 0.9,
          file: null,
          submitted: created,
          verified: v,
          verifiedAt: v ? new Date().toISOString() : null,
          note: ""
        });
        a.status = v ? "verified" : "completed";
      }
    }
    const start = Math.floor(rnd() * 5);
    for (let d = 0; d < Math.floor(rnd() * 10); d++)
      db.activity.push({ userId: u.id, day: addDays(today(), -(start + d)), kind: "view", ref: "demo" });
  }
  for (let d = 0; d < 5; d++) db.activity.push({ userId: ada.id, day: addDays(today(), -d), kind: "view", ref: "demo" });
  for (let d = 8; d < 16; d++) db.activity.push({ userId: ada.id, day: addDays(today(), -d), kind: "read", ref: "demo" });
  const base = { id: "", opp: "", userId: ada.id, email: ada.email, consent: true, status: "applied", created: "", clicked: null };
  PROFILE.forEach((k) => (base[k] = ada[k]));
  db.apps.push({ ...base, id: uid(), opp: "google-ai-plus", status: "applied", created: iso(2), clicked: iso(2) });
  const a2 = { ...base, id: uid(), opp: "sample-solar-bootcamp", status: "verified", created: iso(14), clicked: iso(14) };
  db.apps.push(a2);
  db.completions.push({
    id: uid(),
    appId: a2.id,
    outcome: "finished",
    rating: 5,
    gained: GAINED[3],
    usedFor: "",
    recommend: true,
    file: null,
    submitted: iso(10),
    verified: true,
    verifiedAt: iso(3),
    note: ""
  });
  save();
}
function clearDemo(persist = true) {
  const demoIds = new Set(db.users.filter((u) => u.isDemo).map((u) => u.id));
  const demoApps = new Set(db.apps.filter((a) => (a.userId && demoIds.has(a.userId)) || a.opp.startsWith("sample-")).map((a) => a.id));
  db.users = db.users.filter((u) => !demoIds.has(u.id));
  db.apps = db.apps.filter((a) => !demoApps.has(a.id));
  db.completions = db.completions.filter((c) => !demoApps.has(c.appId));
  db.activity = db.activity.filter((a) => !demoIds.has(a.userId));
  db.demo = false;
  const sid = localStorage.getItem(SESSION);
  if (sid && demoIds.has(sid)) signOut();
  if (persist) save();
}
function resetAll() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(SESSION);
  localStorage.removeItem(GUEST);
  load();
  emit();
}
// First visit: load demo data so the prototype has something to show.
// Set this to false before going live.
const AUTO_DEMO = true;
const ready = hasWindow
  ? AUTO_DEMO && !db.users.length && !localStorage.getItem("scried_demo_off")
    ? loadDemo()
    : Promise.resolve()
  : new Promise(() => {
      /* never resolves on the server: data lives in the browser */
    });
if (hasWindow) {
  ready.then(() => {
    readyFlag = true;
    emit();
  });
}
export const Store = {
  ready,
  subscribe,
  getSnapshot,
  getServerSnapshot,
  today,
  pct,
  schools,
  school,
  schoolName,
  levelLabel,
  ageLabel,
  typeLabel,
  outcomeLabel,
  allOpps,
  listOpps,
  getOpp,
  saveOpp,
  removeOpp,
  daysLeft,
  isOpen,
  dueLabel,
  closingSoon,
  currentUser,
  signUp,
  signIn,
  signOut,
  updateProfile,
  resetPassword,
  profileComplete,
  findUser,
  userById,
  logActivity,
  streak,
  longestStreak,
  week,
  todayLog,
  myApp,
  apply,
  clickThrough,
  myApps,
  completionFor,
  reopen,
  complete,
  openCertificate,
  verify,
  addEnquiry,
  overview,
  searchStudents,
  hasStaff,
  createStaff,
  oppReport,
  oppCsv,
  schoolRows,
  record,
  pendingVerifications,
  recentVerified,
  loadDemo,
  clearDemo: () => {
    clearDemo(true);
    localStorage.setItem("scried_demo_off", "1");
  },
  resetAll,
  get demo() {
    return db.demo;
  }
};
