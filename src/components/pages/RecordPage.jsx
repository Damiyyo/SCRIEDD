"use client";
import Link from "next/link";
import RecordView from "@/components/pages/RecordView";
import { useDocumentTitle, useRequireUser } from "@/lib/hooks";
import { Store } from "@/lib/store";
export default function RecordPage() {
  const u = useRequireUser();
  const r = u ? Store.record(u.id) : null;
  useDocumentTitle(u ? u.fullName + ": Scried record" : null);
  if (!r)
    return (
      <main id="main" className="record">
        <div className="record-head" />
      </main>
    );
  return (
    <RecordView
      r={r}
      actions={
        <>
          <button className="btn btn-forest" onClick={() => window.print()}>
            Print or save as PDF
          </button>
          <Link className="btn btn-line-dark" href="/certificates">
            My certificates
          </Link>
          <Link className="btn btn-line-dark" id="back" href="/dashboard">
            Back to dashboard
          </Link>
        </>
      }
    />
  );
}
