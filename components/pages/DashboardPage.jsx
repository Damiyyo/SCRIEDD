"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useRequireUser } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { alertBox, first, flash, flashNow, fmtDate, openCertificate } from "@/lib/ui";
const MILESTONES = [3, 7, 14, 30, 60, 100];
export default function DashboardPage() {
  const u = useRequireUser();
  const router = useRouter();
  const toggle = async (a, back, e) => {
    const t = e.target;
    t.disabled = true;
    if (back) {
      // move back to In progress
      Store.reopen(a.id);
      flashNow("Moved back to In progress.", "info");
      return;
    }
    const o = Store.getOpp(a.opp);
    if (o && o.certificate) {
      // questions + certificate upload first
      flash("Answer the quick questions and upload your certificate to finish.", "info");
      router.push("/complete/" + encodeURIComponent(a.id));
      return;
    }
    const res = await Store.complete(a.id, { outcome: "finished", rating: 4, gained: "", usedFor: "", recommend: true }, null);
    if (res.errors) {
      t.disabled = false;
      t.checked = false;
      alertBox(res.errors.form || Object.values(res.errors)[0]);
      return;
    }
    flashNow(`“${(o && o.title) || "Opportunity"}” marked complete.`);
  };
  if (!u) {
    return (
      <>
        <header className="dash-head">
          <div className="wrap">
            <div>
              <h1 id="hi">Hi.</h1>
            </div>
          </div>
        </header>
        <main id="main" className="wrap dash-body" />
      </>
    );
  }
  const s = Store.streak(u.id),
    best = Store.longestStreak(u.id),
    doneToday = Store.todayLog(u.id).length;
  const next = MILESTONES.find((m) => m > s);
  const apps = Store.myApps();
  const prog = apps.filter((a) => a.status === "applied"),
    fin = apps.filter((a) => a.status !== "applied");
  const opp = (a) => Store.getOpp(a.opp) || { title: "Removed opportunity", org: "", id: a.opp, link: "", certificate: false };
  const applied = new Set(apps.map((a) => a.opp));
  const rec = Store.listOpps()
    .filter((o) => !applied.has(o.id))
    .slice(0, 4);
  return (
    <>
      <header className="dash-head">
        <div className="wrap">
          <div>
            <h1 id="hi">Hi {first(u.fullName)}.</h1>
            <p className="sub" id="sub">
              {doneToday
                ? "You've kept your streak alive today. See you tomorrow."
                : s
                  ? `Do one thing today to keep your ${s}-day streak going.`
                  : "Start a streak today: explore one opportunity or read one story."}
            </p>
            <p className="sub" id="finish" style={{ marginTop: 8 }} hidden={Store.profileComplete(u)}>
              <Link href="/profile">Finish your profile</Link> so applications fill in automatically.
            </p>
          </div>
          <section className="streak-card" aria-label="Your streak">
            <div className="streak-top">
              <svg className={"flame" + (s ? "" : " off")} id="flame" viewBox="0 0 64 64" aria-hidden="true">
                <path d="M32 4c3 10 14 16 14 30a14 14 0 0 1-28 0c0-7 3-11 6-15 1 5 4 7 6 7-2-9 0-16 2-22z" fill="#F2C14E" />
                <path d="M32 30c2 5 8 7 8 14a8 8 0 0 1-16 0c0-4 2-6 4-8 0 3 2 4 3 4-1-4 0-7 1-10z" fill="#FFF1C2" />
              </svg>
              <div>
                <div className={"streak-num" + (s ? "" : " off")} id="streak">
                  {s}
                </div>
                <div className="streak-lbl" id="streakLbl">
                  {"day streak" + (best > s ? ` · best ${best}` : "")}
                </div>
              </div>
            </div>
            <div className="week" id="week" aria-label="This week">
              {Store.week(u.id).map((d) => (
                <div className={`day ${d.done ? "done" : ""} ${d.today ? "today" : ""} ${d.future ? "future" : ""}`} key={d.day}>
                  <span>{d.label}</span>
                  <span className="dot" title={`${fmtDate(d.day, { weekday: "long", day: "numeric", month: "short" })}${d.done ? ": done" : ""}`}>
                    {d.done ? "✓" : ""}
                  </span>
                </div>
              ))}
            </div>
            <p className="goal" id="goal">
              {doneToday ? (
                <>
                  <b>Today&apos;s goal done.</b> {doneToday} thing{doneToday > 1 ? "s" : ""} done today.
                </>
              ) : (
                <>
                  <b>Today&apos;s goal:</b> <Link href="/opportunities">explore an opportunity</Link> or <Link href="/stories">read a story</Link>.
                </>
              )}
              {next ? (
                <>
                  <br />
                  {next - s} more day{next - s > 1 ? "s" : ""} to your {next}-day badge.
                </>
              ) : null}
            </p>
          </section>
        </div>
      </header>
      <main id="main" className="wrap dash-body">
        <div>
          <div className="panel-h">
            <h2>
              In progress{" "}
              <span className="count-pill" id="progCount">
                {prog.length || ""}
              </span>
            </h2>
            <Link href="/opportunities">Find more</Link>
          </div>
          <div id="progress">
            {prog.length ? (
              <ul className="track">
                {prog.map((a) => {
                  const o = opp(a);
                  return (
                    <li key={a.id}>
                      <div>
                        <h3>
                          {o.title} <span className="status applied">In progress</span>
                        </h3>
                        <p className="meta">
                          {o.org} · Registered {fmtDate(a.created)}
                          {a.clicked ? "" : " · You haven't opened the official link yet"}
                        </p>
                      </div>
                      <div className="acts">
                        {o.link ? (
                          <a
                            className="btn btn-line-dark"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(Store.clickThrough(a.opp), "_blank", "noopener");
                            }}
                          >
                            Official link
                          </a>
                        ) : null}
                        <label className="tgl">
                          <input type="checkbox" onChange={(e) => toggle(a, false, e)} />
                          <span className="tgl-ui" aria-hidden="true"></span>Mark as completed
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="empty-state">
                <b>Nothing in progress yet.</b>When you register for an opportunity through Scried, it moves here so you can track it, open the
                official link and mark it done.
                <br />
                <Link className="btn btn-forest" href="/opportunities">
                  Browse opportunities
                </Link>
              </div>
            )}
          </div>
          <div className="panel-h">
            <h2>Completed</h2>
            <span className="panel-links">
              <Link href="/certificates">My certificates</Link>
              {fin.length ? (
                <Link href="/record" id="recLink">
                  View my record
                </Link>
              ) : null}
            </span>
          </div>
          <div id="done">
            {fin.length ? (
              <ul className="track">
                {fin.map((a) => {
                  const o = opp(a),
                    c = Store.completionFor(a.id);
                  return (
                    <li key={a.id}>
                      <div>
                        <h3>
                          {o.title} <span className={"status " + a.status}>{a.status === "verified" ? "✓ Verified" : "Completed"}</span>
                        </h3>
                        <p className="meta">
                          {o.org} · {Store.outcomeLabel(c?.outcome)}
                          {c?.submitted ? " · " + fmtDate(c.submitted) : ""}
                          {o.certificate ? " · Certificate" : ""}
                        </p>
                        {c?.note && a.status !== "verified" ? <p className="note-flag">{c.note}</p> : null}
                      </div>
                      <div className="acts">
                        {c?.file ? (
                          <button className="btn btn-line-dark" onClick={() => openCertificate(c.id)}>
                            Certificate
                          </button>
                        ) : null}
                        {a.status === "verified" ? null : (
                          <label className="tgl">
                            <input type="checkbox" onChange={(e) => toggle(a, true, e)} />
                            <span className="tgl-ui" aria-hidden="true"></span>In progress again
                          </label>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="empty-state">
                <b>Nothing completed yet.</b>Toggle an opportunity to “Mark as completed” above. You&apos;ll answer a few quick questions and upload
                your certificate if the opportunity gives one. It then becomes part of your verified Scried record.
                <br />
                <Link className="btn btn-forest" href="/certificates">
                  See my certificates
                </Link>
              </div>
            )}
          </div>
        </div>
        <aside>
          <div className="side-card">
            <h3>Streak badges</h3>
            <p>Show up every day. Badges are earned by your longest streak.</p>
            <div className="badges" id="badges">
              {MILESTONES.map((m) => (
                <span className={"badge " + (best >= m ? "got" : "")} title={`${m}-day streak`} key={m}>
                  {m}
                </span>
              ))}
            </div>
          </div>
          {rec.length ? (
            <div className="side-card" id="recCard">
              <h3>Open for you</h3>
              <ul className="mini-opps" id="rec">
                {rec.map((o) => (
                  <li key={o.id}>
                    <Link href={"/opportunities/" + encodeURIComponent(o.id)}>{o.title}</Link>
                    <span>
                      {Store.typeLabel(o.type)} · {Store.dueLabel(o)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="side-card">
            <h3>Your details</h3>
            <p id="details">
              {u.fullName}
              <br />
              {Store.schoolName(u)}
              <br />
              {u.course || "Course not set"}
              {u.level ? " · " + Store.levelLabel(u.level) : ""}
              <br />
              <Link href="/certificates" style={{ color: "var(--forest)", fontWeight: 600 }}>
                My certificates →
              </Link>
            </p>
            <Link className="btn btn-line-dark" href="/profile">
              Edit profile
            </Link>
          </div>
        </aside>
      </main>
    </>
  );
}
