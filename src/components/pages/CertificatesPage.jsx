"use client";
import Link from "next/link";
import { useRequireUser } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { fmtDate, openCertificate } from "@/lib/ui";
export default function CertificatesPage() {
  const u = useRequireUser();
  const rows = u
    ? Store.myApps()
        .filter((a) => a.status !== "applied")
        .map((a) => ({ a, c: Store.completionFor(a.id), o: Store.getOpp(a.opp) || { title: "Removed opportunity", org: "" } }))
        .sort((x, y) => (y.c?.submitted || "").localeCompare(x.c?.submitted || ""))
    : [];
  const nVerified = rows.filter((r) => r.a.status === "verified").length;
  const nFiles = rows.filter((r) => r.c?.file).length;
  // Group by the year the certificate was submitted
  const years = new Map();
  rows.forEach((r) => {
    const y = r.c?.submitted ? r.c.submitted.slice(0, 4) : String(new Date().getFullYear());
    if (!years.has(y)) years.set(y, []);
    years.get(y).push(r);
  });
  return (
    <main id="main" className="wrap rep">
      <div className="rep-head">
        <div>
          <p className="eyebrow">Your record</p>
          <h1>My certificates.</h1>
          <p>
            Everything you&apos;ve completed and uploaded through Scried, newest first. Verified ones carry the Scried tick, ready to show employers.
          </p>
        </div>
        <div className="btns no-print">
          <Link className="btn btn-line-dark" href="/record">
            View my record
          </Link>
          <button className="btn btn-forest" onClick={() => window.print()}>
            Print or save as PDF
          </button>
        </div>
      </div>
      <p className="formula" id="summary" hidden={!rows.length}>
        <b>{rows.length}</b> completed · <b>{nVerified}</b> verified by Scried · <b>{nFiles}</b> certificate{nFiles === 1 ? "" : "s"} uploaded
      </p>
      <div id="certs">
        {[...years.keys()]
          .sort()
          .reverse()
          .map((y) => (
            <section className="cert-year" key={y}>
              <h2>
                <span>{y}</span>
              </h2>
              <ul className="rec-list">
                {years.get(y).map(({ a, c, o }) => (
                  <li key={a.id}>
                    <div>
                      <b>{o.title}</b>
                      <span>
                        {o.org} · {Store.outcomeLabel(c?.outcome)} · Completed{" "}
                        {fmtDate(c?.submitted, { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      {c?.gained ? <span style={{ display: "block", marginTop: 6, color: "var(--ink)" }}>“{c.gained}”</span> : null}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {a.status === "verified" ? (
                        <span className="status verified">✓ Verified</span>
                      ) : (
                        <span className="status completed">Awaiting verification</span>
                      )}
                      {c?.file ? (
                        <>
                          <br />
                          <button
                            className="linkish no-print"
                            style={{ fontSize: ".9rem", color: "var(--forest)", fontWeight: 600, marginTop: 6 }}
                            onClick={() => openCertificate(c.id)}
                          >
                            View certificate
                          </button>
                        </>
                      ) : (
                        <span style={{ display: "block", fontSize: ".85rem", color: "var(--muted)", marginTop: 6 }}>No file</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
      <div className="empty-state" id="empty" hidden={!(u && !rows.length)}>
        <b>No certificates yet.</b>When you mark an opportunity complete and upload its certificate, it appears here — grouped by year, with
        verification status.
        <br />
        <Link className="btn btn-forest" href="/opportunities">
          Browse opportunities
        </Link>
      </div>
    </main>
  );
}
