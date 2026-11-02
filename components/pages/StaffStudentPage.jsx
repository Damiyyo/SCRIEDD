"use client";
import Link from "next/link";
import RecordView from "@/components/pages/RecordView";
import { useDocumentTitle, useRequireStaff } from "@/lib/hooks";
import { Store } from "@/lib/store";
export default function StaffStudentPage({ id }) {
  const staff = useRequireStaff();
  const r = staff ? Store.record(id) : null;
  useDocumentTitle(r ? r.user.fullName + ": Scried record" : null);
  if (!staff) return <main id="main" className="record" />;
  return (
    <RecordView
      r={r}
      actions={
        <>
          <button className="btn btn-forest" onClick={() => window.print()}>
            Print or save as PDF
          </button>
          <Link className="btn btn-line-dark" id="back" href="/staff">
            Back to overview
          </Link>
        </>
      }
    />
  );
}
