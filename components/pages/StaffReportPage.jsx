"use client";
import { Bars } from "@/components/Cards";
import { useDocumentTitle, useRequireStaff } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { download, fmtDate } from "@/lib/ui";
export default function StaffReportPage({ id }) {
  const staff = useRequireStaff();
  const r = staff ? Store.oppReport(id) : null;
  useDocumentTitle(r ? "Impact report: " + r.opp.title + " | Scried" : null);
  if (!staff) return <main id="main" className="wrap rep" />;
  if (!r)
    return (
      <main id="main" className="wrap rep">
        <div className="rep-head">
          <div>
            <p className="eyebrow">Impact report</p>
            <h1 id="title">We couldn&apos;t find that opportunity</h1>
          </div>
        </div>
      </main>
    );
  const o = r.opp;
  const k = (n, l, s = "") => (
    <div className="kpi" key={l}>
      <b>{n.toLocaleString()}</b>
      <span>{l}</span>
      {s ? <small>{s}</small> : null}
    </div>
  );
  const short = { day: "numeric", month: "short" };
  return (
    <main id="main" className="wrap rep">
      <div className="rep-head">
        <div>
          <p className="eyebrow" id="eyebrow">
            Impact report · {o.org}
          </p>
          <h1 id="title">{o.title}</h1>
          <p id="prepared">
            {`Prepared by Scried on ${fmtDate(new Date().toISOString(), { day: "numeric", month: "long", year: "numeric" })}.` +
              (o.partner ? ` For ${o.partner}.` : "")}
          </p>
        </div>
        <div className="btns no-print">
          <button className="btn btn-line-dark" id="csv" onClick={() => download(`scried-${o.id}-participants.csv`, Store.oppCsv(o.id))}>
            Download participants (CSV)
          </button>
          <button className="btn btn-forest" onClick={() => window.print()}>
            Print or save as PDF
          </button>
        </div>
      </div>
      <div className="kpis" id="kpis">
        {k(r.total, "Students registered")}
        {k(r.clicked, "Went on to apply", r.clickRate + "% of registered")}
        {k(r.done, "Completed", r.doneRate + "% completion rate")}
        {k(r.verified, "Verified certificates")}
        {k(r.nSchools, "Schools reached")}
      </div>
      <div className="box" id="timeBox" hidden={!r.days.length}>
        <h2>Registrations over time</h2>
        <div className="cols" id="cols" role="img" aria-label={`Daily registrations for the last ${r.days.length} days`}>
          {r.days.map((d) => (
            <div key={d.day} style={{ height: d.h + "%" }} title={`${fmtDate(d.day, short)}: ${d.n}`} />
          ))}
        </div>
        <div className="cols-lab" id="colsLab">
          {r.days.length ? (
            <>
              <span>{fmtDate(r.days[0].day, short)}</span>
              <span>{fmtDate(r.days[r.days.length - 1].day, short)}</span>
            </>
          ) : null}
        </div>
      </div>
      <div className="box">
        <h2>By school</h2>
        <div className="table-wrap">
          <table className="t">
            <thead>
              <tr>
                <th>School</th>
                <th className="n">Registered</th>
                <th className="n">Share</th>
                <th className="n">Completed</th>
                <th style={{ width: "30%" }}></th>
              </tr>
            </thead>
            <tbody id="schools">
              {r.schools.length ? (
                r.schools.map((s) => (
                  <tr key={s.label}>
                    <td>{s.label}</td>
                    <td className="n">{s.n}</td>
                    <td className="n">{s.pct}%</td>
                    <td className="n">{s.done}</td>
                    <td>
                      <div className="score-bar">
                        <i style={{ width: s.pct + "%" }} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No registrations yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid-2">
        <div className="box">
          <h2>By level</h2>
          <div id="levels">
            <Bars rows={r.levels} />
          </div>
        </div>
        <div className="box">
          <h2>By age range</h2>
          <div id="ages">
            <Bars rows={r.ages} tone="gold" />
          </div>
        </div>
        <div className="box">
          <h2>Top courses</h2>
          <div id="courses">
            <Bars rows={r.courses} />
          </div>
        </div>
        <div className="box">
          <h2>Outcomes</h2>
          <div id="outcomes">
            {r.nFeedback ? (
              <>
                <p style={{ color: "var(--muted)", marginBottom: 14 }}>
                  From {r.nFeedback} student{r.nFeedback > 1 ? "s" : ""} who marked it complete. Average usefulness{" "}
                  <b style={{ color: "var(--ink)" }}>{r.avgRating}/5</b>. <b style={{ color: "var(--ink)" }}>{r.recommend}%</b> would recommend it.
                </p>
                <Bars rows={r.outcomes} tone="gold" />
              </>
            ) : (
              <p style={{ color: "var(--muted)" }}>Outcomes appear when students mark this opportunity complete.</p>
            )}
          </div>
        </div>
      </div>
      <div className="box" id="voicesBox" hidden={!r.voices.length}>
        <h2>What students said they gained</h2>
        <div className="quote-list" id="voices">
          {r.voices.map(({ c, a }) => (
            <blockquote key={c.id}>
              “{c.gained}”
              <cite>
                {a.course}, {Store.levelLabel(a.level)}, {Store.schoolName(a)}
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
      <p className="print-note">
        Figures count students who registered through Scried before continuing to the official link. Completions are self-reported; verified
        completions have a certificate or proof checked by the Scried team.
      </p>
    </main>
  );
}
