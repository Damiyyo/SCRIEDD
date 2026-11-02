"use client";
import { Store } from "@/lib/store";
import { fmtDate, openCertificate } from "@/lib/ui";
/** The printable "talent record": shared by a student's own record page and the staff view of a student. */
export default function RecordView({ r, actions }) {
  if (!r) {
    return (
      <main id="main" className="record">
        <div className="record-head">
          <div>
            <span className="logo">
              scried<i>.</i>
            </span>
            <h1 id="name">We couldn&apos;t find that student</h1>
          </div>
        </div>
      </main>
    );
  }
  const u = r.user;
  const prog = r.apps.filter((a) => a.status === "applied");
  return (
    <main id="main" className="record">
      <div className="record-head">
        <div>
          <span className="logo">
            scried<i>.</i>
          </span>
          <h1 id="name">{u.fullName}</h1>
          <p id="line">{[Store.schoolName(u), u.course, u.level ? Store.levelLabel(u.level) : ""].filter(Boolean).join(" · ")}</p>
        </div>
        <div className="stamp" id="stamp">
          Scried talent record
          <br />
          Member since {fmtDate(u.joined, { month: "long", year: "numeric" })}
          <br />
          Generated {fmtDate(new Date().toISOString())}
        </div>
      </div>
      <div className="kpis" style={{ marginTop: 32 }} id="kpis">
        <div className="kpi">
          <b>{r.done.length}</b>
          <span>Opportunities completed</span>
        </div>
        <div className="kpi">
          <b>{r.verified.length}</b>
          <span>Verified by Scried</span>
        </div>
        <div className="kpi">
          <b>{r.rate}%</b>
          <span>Follow-through rate</span>
          <small>
            {r.done.length} of {r.apps.length} started
          </small>
        </div>
        <div className="kpi">
          <b>{r.longest}</b>
          <span>Longest streak (days)</span>
          <small>
            {r.activeDays} active day{r.activeDays === 1 ? "" : "s"} in total
          </small>
        </div>
      </div>
      <h2>Completed and verified</h2>
      <div id="done">
        {r.done.length ? (
          <ul className="rec-list">
            {r.done.map((a) => (
              <li key={a.id}>
                <div>
                  <b>{a.opp.title}</b>
                  <span>
                    {a.opp.org} · {Store.typeLabel(a.opp.type)} · {Store.outcomeLabel(a.completion?.outcome)} ·{" "}
                    {fmtDate(a.completion?.submitted, { month: "short", year: "numeric" })}
                  </span>
                  {a.completion?.gained ? <span style={{ display: "block", marginTop: 6, color: "var(--ink)" }}>“{a.completion.gained}”</span> : null}
                </div>
                <div>
                  {a.status === "verified" ? (
                    <span className="status verified">✓ Verified</span>
                  ) : (
                    <span className="status completed">Pending verification</span>
                  )}
                  {a.completion?.file ? (
                    <>
                      <br />
                      <button
                        className="linkish no-print"
                        style={{ fontSize: ".88rem", color: "var(--forest)", fontWeight: 600 }}
                        onClick={() => openCertificate(a.completion.id)}
                      >
                        Certificate
                      </button>
                    </>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "var(--muted)" }}>No completed opportunities yet.</p>
        )}
      </div>
      <div id="progressWrap">
        {prog.length ? (
          <>
            <h2>In progress</h2>
            <ul className="rec-list">
              {prog.map((a) => (
                <li key={a.id}>
                  <div>
                    <b>{a.opp.title}</b>
                    <span>
                      {a.opp.org} · Registered {fmtDate(a.created)}
                    </span>
                  </div>
                  <div></div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
      <p className="print-note">
        Verified items have a certificate or proof checked by the Scried team. You can print this page or save it as a PDF to share.
      </p>
      <div className="btns no-print" style={{ marginTop: 20 }}>
        {actions}
      </div>
    </main>
  );
}
