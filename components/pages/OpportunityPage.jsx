"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useDocumentTitle, useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { fmtDate } from "@/lib/ui";
export default function OpportunityPage({ id }) {
  const { ready } = useStore();
  const o = ready ? Store.getOpp(id) : null;
  useDocumentTitle(o ? o.title + " | Scried" : null);
  useEffect(() => {
    if (ready && o) Store.logActivity("view", o.id);
  }, [ready, o?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const missing = ready && !o;
  const app = ready && o ? Store.myApp(o.id) : null;
  const u = ready ? Store.currentUser() : null;
  let card = null;
  if (o) {
    if (o.externalUnverified && o.link) {
      card = (
        <>
          <h2>External listing — not verified</h2>
          <p>Scried has not confirmed this opening or its application page. Verify it directly with {o.org.split(" (listing via")[0]} before sharing personal details. Never pay a recruitment or application fee.</p>
          <a className="btn btn-gold" href={o.link} target="_blank" rel="noopener noreferrer">Open external listing</a>
        </>
      );
    } else if (app) {
      card = (
        <>
          <h2>You&apos;re registered</h2>
          <p>You registered on {fmtDate(app.created)}. Continue on the official site whenever you&apos;re ready.</p>
          <a
            className="btn btn-gold"
            href="#"
            id="go"
            onClick={(e) => {
              e.preventDefault();
              const link = Store.clickThrough(o.id);
              window.open(link, "_blank", "noopener");
            }}
          >
            Continue to {o.org}
          </a>
          {u ? (
            <p className="small">
              <Link href="/dashboard">Track it on your dashboard</Link>
            </p>
          ) : null}
        </>
      );
    } else if (!Store.isOpen(o)) {
      card = (
        <>
          <h2>This one has closed</h2>
          <p>The listed registration deadline has passed. Check the official page in case the organiser has extended registration.</p>
          {o.link ? <a className="btn btn-gold" href={o.link} target="_blank" rel="noreferrer">Check the official page</a> : null}
        </>
      );
    } else {
      card = (
        <>
          <h2>Apply through Scried</h2>
          <p>Register your details in under a minute, then we&apos;ll take you to the official {o.org} page to finish.</p>
          <Link className="btn btn-gold" href={`/opportunities/${encodeURIComponent(o.id)}/apply`}>
            {u ? "Apply now. Your details are filled in" : "Register and continue"}
          </Link>
          {u ? null : (
            <p className="small">
              Have an account?{" "}
              <Link href={"/signin?next=" + encodeURIComponent(`/opportunities/${o.id}/apply`)}>Sign in to fill the form automatically</Link>
            </p>
          )}
          <div className="why-box">
            Why register first? It lets us show {o.org} how many students we reached, so they keep sending opportunities to campuses like yours.
          </div>
        </>
      );
    }
  }
  return (
    <>
      <header className="od-head">
        <div className="wrap">
          <Link href="/opportunities" className="back">
            ← All opportunities
          </Link>
          <h1 id="title">{missing ? "We couldn't find that opportunity" : o ? o.title : "Loading…"}</h1>
          <div className="od-meta" id="meta">
            {o ? (
              <>
                <span className="gold">{Store.typeLabel(o.type)}</span>
                <span>{o.org}</span>
                <span>{Store.dueLabel(o)}</span>
                {o.verified ? <span>✓ Verified by Scried</span> : o.externalUnverified ? <span>Not verified by Scried</span> : null}
              </>
            ) : null}
          </div>
        </div>
      </header>
      <main id="main" className="wrap od-body">
        <div>
          <div className="prose" id="prose">
            {missing ? (
              <p>
                It may have been removed.{" "}
                <Link href="/opportunities" style={{ color: "var(--forest)", fontWeight: 600 }}>
                  See all opportunities
                </Link>
              </p>
            ) : (
              o?.description.map((p, i) => <p key={i}>{p}</p>)
            )}
          </div>
          <dl id="facts">
            {o ? (
              <>
                <dt>Who can apply</dt>
                <dd>{o.eligibility}</dd>
                <dt>Where</dt>
                <dd>{o.location}</dd>
                <dt>Deadline</dt>
                <dd>{o.deadline ? fmtDate(o.deadline, { day: "numeric", month: "long", year: "numeric" }) : "No fixed deadline. Apply early."}</dd>
                <dt>Offered by</dt>
                <dd>{o.org}</dd>
              </>
            ) : null}
          </dl>
        </div>
        <aside className="apply-card" id="card" hidden={missing || !o}>
          {card}
        </aside>
      </main>
    </>
  );
}
