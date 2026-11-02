"use client";
import Link from "next/link";
import { useState } from "react";
import { OppRow } from "@/components/Cards";
import { SCRIED_TYPES } from "@/data/content";
import { useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
function List({ initialType, initialQ }) {
  const [type, setType] = useState(initialType);
  const [q, setQ] = useState(initialQ);
  const used = new Set(Store.listOpps().map((o) => o.type));
  const types = [["", "All"], ...SCRIED_TYPES.filter(([k]) => used.has(k)).map(([k, l]) => [k, l])];
  const mine = new Set(Store.myApps().map((a) => a.opp));
  const items = Store.listOpps({ q, type });
  // keep the address bar in step with the filters, as the original did
  const sync = (nextQ, nextType) => {
    const p = new URLSearchParams();
    if (nextQ) p.set("q", nextQ);
    if (nextType) p.set("type", nextType);
    window.history.replaceState(null, "", "/opportunities" + (p.toString() ? "?" + p : ""));
  };
  return (
    <div className="wrap" style={{ paddingTop: 36 }}>
      <form className="search" role="search" id="searchForm" style={{ position: "relative", maxWidth: 560 }} onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="q" className="sr-only">
          Search opportunities
        </label>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="q"
          type="search"
          placeholder="Search by course, company or keyword"
          autoComplete="off"
          value={q}
          onChange={(e) => {
            const v = e.target.value.trim();
            setQ(e.target.value);
            sync(v, type);
          }}
          style={{
            width: "100%",
            font: "inherit",
            padding: "16px 18px 16px 50px",
            border: "1.5px solid var(--line)",
            borderRadius: 999,
            background: "#fff"
          }}
        />
      </form>
      <nav
        className="chipbar"
        id="chips"
        style={{ marginTop: 18 }}
        aria-label="Filter by type"
        onClick={(e) => {
          const a = e.target.closest("[data-type]");
          if (!a) return;
          e.preventDefault();
          const k = a.dataset.type;
          setType(k);
          sync(q.trim(), k);
        }}
      >
        {types.map(([k, l]) => (
          <a href="#" data-type={k} aria-current={type === k ? "true" : "false"} key={k}>
            {l}
          </a>
        ))}
      </nav>
      <p id="count" style={{ color: "var(--muted)", margin: "28px 0 14px" }} aria-live="polite">
        {items.length ? `${items.length} open opportunit${items.length === 1 ? "y" : "ies"}, closing soonest first` : ""}
      </p>
      <ul className="opp-list" id="list">
        {items.map((o) => (
          <OppRow o={o} mine={mine} key={o.id} />
        ))}
      </ul>
      <div className="empty-state" id="empty" style={{ textAlign: "center" }} hidden={items.length > 0}>
        <b>Nothing matches that yet.</b>Try another word or type. New opportunities are added every week.
        <br />
        <button
          className="btn btn-forest"
          id="reset"
          type="button"
          onClick={() => {
            setQ("");
            setType("");
            sync("", "");
          }}
        >
          Show all opportunities
        </button>
      </div>
      <Notes />
    </div>
  );
}
function Notes() {
  return (
    <div className="grid-2" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 40, margin: "64px 0 110px" }}>
      <div>
        <h3 style={{ fontSize: "1.35rem", marginBottom: 8 }}>Checked before it&apos;s posted</h3>
        <p style={{ color: "var(--muted)" }}>
          Someone on our team confirms every listing against the official source. You only see ✓ Verified when we have.
        </p>
      </div>
      <div>
        <h3 style={{ fontSize: "1.35rem", marginBottom: 8 }}>Always free to apply</h3>
        <p style={{ color: "var(--muted)" }}>No real opportunity asks you to pay to apply. If one does, don&apos;t pay, and report it to us.</p>
      </div>
      <div>
        <h3 style={{ fontSize: "1.35rem", marginBottom: 8 }}>Know one we missed?</h3>
        <p style={{ color: "var(--muted)" }}>
          Send it in. We&apos;ll check it and share it with every student on Scried.{" "}
          <Link href="/partner#post" style={{ color: "var(--forest)", fontWeight: 600 }}>
            Submit an opportunity
          </Link>
        </p>
      </div>
    </div>
  );
}
export default function OpportunitiesPage({ type = "", q = "" }) {
  const { ready } = useStore();
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <h1>Opportunities, closer to you.</h1>
          <p>
            Scholarships, internships, fellowships, competitions, grants and free tools for Nigerian students. Checked by us, in one place, before the
            deadline.
          </p>
        </div>
      </header>
      <main id="main">{ready ? <List initialType={type} initialQ={q} /> : <div className="wrap" style={{ paddingTop: 36 }} />}</main>
    </>
  );
}
