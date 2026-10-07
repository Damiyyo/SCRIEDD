"use client";
import Link from "next/link";
import { useState } from "react";
import { useRequireStaff } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { ago } from "@/lib/ui";
export default function StaffIndexPage() {
  const staff = useRequireStaff();
  const [find, setFind] = useState("");
  if (!staff)
    return (
      <main id="main" className="wrap rep">
        <div className="rep-head">
          <div>
            <p className="eyebrow">Staff</p>
            <h1>Overview</h1>
          </div>
        </div>
      </main>
    );
  const o = Store.overview();
  const k = (n, l) => (
    <div className="kpi" key={l}>
      <b>{n.toLocaleString()}</b>
      <span>{l}</span>
    </div>
  );
  const top = Store.schoolRows().slice(0, 5);
  const q = find.trim().toLowerCase();
  const hits = q.length < 2 ? [] : Store.searchStudents(q).slice(0, 10);
  return (
    <main id="main" className="wrap rep">
      <div className="rep-head">
        <div>
          <p className="eyebrow">Staff</p>
          <h1>Overview</h1>
          <p id="asof">
            Everything happening on Scried, as of{" "}
            {new Date().toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" })}.
          </p>
        </div>
        <Link className="btn btn-forest" href="/staff/opportunity-edit">
          Add an opportunity
        </Link>
      </div>
      <div className="kpis" id="kpis">
        {k(o.students, "Student accounts")}
        {k(o.applications, "Registrations")}
        {k(o.completions, "Completions")}
        {k(o.verified, "Verified certificates")}
        {k(o.schools, "Schools reached")}
      </div>
      <p className="formula" id="pending" style={{ background: "#FFF5D6", color: "#5A4300" }} hidden={!o.pending}>
        <b>{o.pending}</b> submission{o.pending > 1 ? "s" : ""} waiting for verification.{" "}
        <Link href="/staff/verify" style={{ color: "var(--forest)", fontWeight: 700 }}>
          Review now
        </Link>
      </p>
      <div className="box">
        <h2>Opportunities and impact reports</h2>
        <div className="table-wrap">
          <table className="t">
            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Type</th>
                <th className="n">Registered</th>
                <th className="n">Went to link</th>
                <th className="n">Completed</th>
                <th className="n">Verified</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="opps">
              {o.opps.length ? (
                o.opps.map((x) => (
                  <tr key={x.id}>
                    <td>
                      <Link href={"/staff/report/" + encodeURIComponent(x.id)}>{x.title}</Link>
                      <br />
                      <span style={{ color: "var(--muted)", fontSize: ".88rem" }}>
                        {x.org} · {Store.dueLabel(x)} ·{" "}
                        <Link href={"/staff/opportunity-edit/" + encodeURIComponent(x.id)} style={{ fontWeight: 500 }}>
                          Edit
                        </Link>
                      </span>
                    </td>
                    <td>{Store.typeLabel(x.type)}</td>
                    <td className="n">{x.n}</td>
                    <td className="n">{x.clicked}</td>
                    <td className="n">{x.done}</td>
                    <td className="n">{x.verified}</td>
                    <td className="n">
                      <Link href={"/staff/report/" + encodeURIComponent(x.id)}>Report</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    No opportunities yet. <Link href="/staff/opportunity-edit">Add the first one</Link>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid-2">
        <div className="box">
          <h2>Top schools</h2>
          <div id="schools">
            {top.length ? (
              <>
                <div className="table-wrap">
                  <table className="t">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>School</th>
                        <th className="n">Registered</th>
                        <th className="n">Completed</th>
                        <th className="n">Percentile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top.map((r) => (
                        <tr key={r.school.id}>
                          <td>{r.rank}</td>
                          <td>{r.school.short}</td>
                          <td className="n">{r.n}</td>
                          <td className="n">{r.done}</td>
                          <td className="n">{r.percentile}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: 14 }}>
                  <Link href="/staff/schools" style={{ color: "var(--forest)", fontWeight: 600 }}>
                    Full school ranking
                  </Link>
                </p>
              </>
            ) : (
              <p style={{ color: "var(--muted)" }}>Rankings appear once students register for opportunities.</p>
            )}
          </div>
        </div>
        <div className="box">
          <h2>New enquiries</h2>
          <div id="enq">
            {o.enquiries.length ? (
              o.enquiries.map((e) => (
                <p key={e.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                  <b>{e.organisation}</b> · {e.kind === "opportunity" ? "Opportunity submission" : "Partnership"}
                  <br />
                  <span style={{ color: "var(--muted)", fontSize: ".92rem" }}>
                    {e.name}, {e.email} · {ago(e.created)}
                  </span>
                  <br />
                  <span style={{ fontSize: ".93rem" }}>{e.details}</span>
                  {e.link ? (
                    <>
                      <br />
                      <a href={e.link} target="_blank" rel="noopener" style={{ fontSize: ".9rem", color: "var(--forest)" }}>
                        {e.link}
                      </a>
                    </>
                  ) : null}
                </p>
              ))
            ) : (
              <p style={{ color: "var(--muted)" }}>No partnership or opportunity enquiries yet.</p>
            )}
          </div>
        </div>
      </div>
      <div className="box">
        <h2>Find a student</h2>
        <input
          id="find"
          type="search"
          placeholder="Search by name, email or course"
          value={find}
          onChange={(e) => setFind(e.target.value)}
          style={{ width: "100%", font: "inherit", padding: "12px 16px", border: "1.5px solid var(--line)", borderRadius: 12 }}
          aria-label="Find a student"
        />
        <div className="table-wrap" style={{ marginTop: 12 }}>
          <table className="t">
            <tbody id="found">
              {q.length < 2 ? null : hits.length ? (
                hits.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <Link href={"/staff/student/" + u.id}>{u.fullName}</Link>
                    </td>
                    <td>{u.email}</td>
                    <td>{Store.schoolName(u)}</td>
                    <td>{u.course || ""}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={{ color: "var(--muted)" }}>No students match that.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
