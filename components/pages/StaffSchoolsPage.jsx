"use client";
import { useState } from "react";
import { SCRIED_TYPES } from "@/data/content";
import { useRequireStaff } from "@/lib/hooks";
import { Store } from "@/lib/store";
export default function StaffSchoolsPage({ initialType = "" }) {
  const staff = useRequireStaff();
  const [type, setType] = useState(initialType);
  const rows = staff ? Store.schoolRows(type) : [];
  const chips = [["", "All opportunities"], ...SCRIED_TYPES.map(([k, l]) => [k, l])];
  return (
    <main id="main" className="wrap rep">
      <div className="rep-head">
        <div>
          <p className="eyebrow">Staff</p>
          <h1>School ranking</h1>
          <p>Which campuses engage most, so you know where to push the next opportunity.</p>
        </div>
        <button className="btn btn-line-dark no-print" onClick={() => window.print()}>
          Print or save as PDF
        </button>
      </div>
      <nav className="chipbar no-print" id="chips" aria-label="Filter by opportunity type">
        {chips.map(([k, l]) => (
          <a
            href="#"
            key={k}
            aria-current={type === k ? "true" : "false"}
            onClick={(e) => {
              e.preventDefault();
              setType(k);
            }}
          >
            {l}
          </a>
        ))}
      </nav>
      <p className="formula">
        <b>How the score works:</b> each registration counts 1, each completion 2 more, and each verified certificate 3 more. Percentile is the share
        of other schools with a lower score, so 90 means the school is ahead of 90% of schools. Use it to share limited slots fairly, for example by
        giving top-25% schools first access.
      </p>
      <div className="box" id="box">
        {!staff ? null : rows.length ? (
          <div className="table-wrap">
            <table className="t">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th className="school-col">School</th>
                  <th className="n">Students</th>
                  <th className="n">Registered</th>
                  <th className="n">Completed</th>
                  <th className="n">Verified</th>
                  <th className="n">Completion rate</th>
                  <th className="n">Score</th>
                  <th style={{ minWidth: 110 }}></th>
                  <th className="n">Percentile</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.school.id}>
                    <td>{r.rank}</td>
                    <td>
                      <b>{r.school.name}</b>
                      <br />
                      <span style={{ color: "var(--muted)", fontSize: ".86rem" }}>{r.school.state}</span>
                    </td>
                    <td className="n">{r.students}</td>
                    <td className="n">{r.n}</td>
                    <td className="n">{r.done}</td>
                    <td className="n">{r.verified}</td>
                    <td className="n">{r.rate}%</td>
                    <td className="n">
                      <b>{r.score}</b>
                    </td>
                    <td>
                      <div className="score-bar">
                        <i style={{ width: r.bar + "%" }} />
                      </div>
                    </td>
                    <td className="n">{r.percentile}</td>
                    <td>
                      <span className={"tier " + (r.percentile >= 75 ? "top" : r.percentile >= 25 ? "mid" : "low")}>{r.tier}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: "var(--muted)" }}>No registrations for this type of opportunity yet.</p>
        )}
      </div>
    </main>
  );
}
