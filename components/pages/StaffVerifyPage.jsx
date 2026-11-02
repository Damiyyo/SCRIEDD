"use client";
import Link from "next/link";
import { useRequireStaff } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { ago, flashNow, fmtDate, openCertificate } from "@/lib/ui";
export default function StaffVerifyPage() {
  const staff = useRequireStaff();
  const p = staff ? Store.pendingVerifications() : [];
  const r = staff ? Store.recentVerified() : [];
  const onSubmit = (e, id) => {
    e.preventDefault();
    const f = e.currentTarget;
    const submitter = e.nativeEvent.submitter;
    const approve = (submitter || f.querySelector('button[value="approve"]')).value === "approve";
    Store.verify(id, approve, f.elements.namedItem("note").value);
    flashNow(approve ? "Verified. It's now on the student's record." : "Note saved. The student will see it on their dashboard.");
  };
  return (
    <main id="main" className="wrap rep">
      <div className="rep-head">
        <div>
          <p className="eyebrow">Staff</p>
          <h1>Verify certificates</h1>
          <p>Check each certificate against the student&apos;s name and the opportunity, then approve it or leave a note.</p>
        </div>
      </div>
      <div className="box">
        <h2 id="waitingH">{staff ? `Waiting (${p.length})` : "Waiting"}</h2>
        <div id="pending">
          {staff && !p.length ? (
            <p style={{ color: "var(--muted)" }}>Nothing waiting. Every submission has been reviewed.</p>
          ) : (
            p.map(({ c, a, opp }) => (
              <div className="verify-item" key={c.id}>
                <div>
                  <h3>{a.fullName}</h3>
                  <p>
                    {opp.title || "Removed opportunity"} · {Store.outcomeLabel(c.outcome)} · Rated {c.rating}/5 · {ago(c.submitted)}
                  </p>
                  <p>
                    {Store.schoolName(a)} · {a.course}
                  </p>
                  <p>
                    {c.file ? (
                      <button className="linkish" style={{ color: "var(--forest)", fontWeight: 600 }} onClick={() => openCertificate(c.id)}>
                        Open certificate
                      </button>
                    ) : (
                      "No file uploaded"
                    )}
                    {a.userId ? (
                      <>
                        {" · "}
                        <Link href={"/staff/student/" + a.userId} style={{ color: "var(--forest)", fontWeight: 600 }}>
                          Student record
                        </Link>
                      </>
                    ) : null}
                  </p>
                  {c.note ? <span className="note-flag">Note: {c.note}</span> : null}
                </div>
                <form onSubmit={(e) => onSubmit(e, c.id)}>
                  <label className="sr-only" htmlFor={"n-" + c.id}>
                    Note to student
                  </label>
                  <input type="text" id={"n-" + c.id} name="note" placeholder="Note if it can't be verified" />
                  <button className="btn btn-line-dark" value="note" type="submit">
                    Save note
                  </button>
                  <button className="btn btn-forest" value="approve" type="submit">
                    Verify
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="box" id="recentBox" hidden={!r.length}>
        <h2>Recently verified</h2>
        <div className="table-wrap">
          <table className="t">
            <tbody id="recent">
              {r.map(({ c, a, opp }) => (
                <tr key={c.id}>
                  <td>{a.fullName}</td>
                  <td>{opp.title || ""}</td>
                  <td className="n">{fmtDate(c.verifiedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
