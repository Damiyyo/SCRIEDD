"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Field, FormError, useFormErrors } from "@/components/Forms";
import { SCRIED_TYPES } from "@/data/content";
import { useDocumentTitle, useRequireStaff } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { flash, formData } from "@/lib/ui";
export default function StaffOpportunityEditPage({ id = "" }) {
  const staff = useRequireStaff();
  const router = useRouter();
  const { errors, setErrors, formRef } = useFormErrors();
  const [confirmRemove, setConfirmRemove] = useState(false);
  const o = staff && id ? Store.getOpp(id) : null;
  useDocumentTitle(o ? "Edit opportunity | Scried" : null);
  const v = o || { type: "", verified: false, certificate: true };
  return (
    <main id="main" className="wrap apply-wrap">
      <aside>
        <p style={{ fontWeight: 600, color: "var(--forest)" }}>Staff</p>
        <h1 style={{ marginTop: 12 }} id="h">
          {o ? "Edit opportunity" : "Add an opportunity"}
        </h1>
        <p>Check the official source before you tick “Verified”. Students only see the tick when you do.</p>
        <p>Saved opportunities appear on the site straight away.</p>
        <button className="btn btn-line-dark" id="remove" type="button" hidden={!o} style={{ marginTop: 12 }} onClick={() => setConfirmRemove(true)}>
          Remove this opportunity
        </button>
        <p id="removeConfirm" className="formula" hidden={!confirmRemove} style={{ marginTop: 14 }}>
          Students will no longer see it. Its registrations stay in your reports.{" "}
          <button
            className="btn btn-forest"
            id="yes"
            style={{ padding: "8px 16px", fontSize: ".9rem", marginTop: 10 }}
            onClick={() => {
              if (!o) return;
              Store.removeOpp(o.id);
              flash("Opportunity removed.");
              router.push("/staff");
            }}
          >
            Yes, remove it
          </button>
        </p>
      </aside>
      {staff ? (
        <form
          className="form"
          id="form"
          noValidate
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            const d = formData(e.currentTarget);
            const errs = {};
            ["title", "org", "summary", "description", "eligibility"].forEach((k) => {
              if (!d[k].trim()) errs[k] = "This is required.";
            });
            if (!d.type) errs.type = "Choose a type.";
            if (!/^https?:\/\/\S+\.\S+/.test(d.link)) errs.link = "Paste the official link, starting with https://";
            if (Object.keys(errs).length) {
              setErrors(errs);
              return;
            }
            let slug = o
              ? o.id
              : d.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "")
                  .slice(0, 60) || "opportunity";
            if (!o && Store.getOpp(slug)) slug += "-" + Date.now().toString(36).slice(-4);
            Store.saveOpp({
              ...(o || {}),
              id: slug,
              title: d.title.trim(),
              org: d.org.trim(),
              type: d.type,
              summary: d.summary.trim(),
              description: d.description
                .split(/\n\s*\n/)
                .map((p) => p.trim())
                .filter(Boolean),
              eligibility: d.eligibility.trim(),
              location: d.location.trim() || "Nigeria",
              deadline: d.deadline || null,
              deadlineInDays: null,
              link: d.link.trim(),
              steps: d.steps
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
              partner: d.partner.trim(),
              verified: d.verified,
              certificate: d.certificate
            });
            flash(o ? "Opportunity updated." : "Opportunity published. It's live on the site now.");
            router.push("/staff");
          }}
        >
          <FormError message={errors.form} />
          <div id="fields">
            <Field name="title" label="Title" value={v.title} error={errors.title} />
            <div className="row">
              <Field name="org" label="Offered by" value={v.org} error={errors.org} />
              <Field name="type" label="Type" value={v.type} options={SCRIED_TYPES} placeholder="Choose a type" error={errors.type} />
            </div>
            <Field name="summary" label="One-line summary" value={v.summary} help="Shown in lists. One or two sentences." error={errors.summary} />
            <Field
              name="description"
              label="Full details"
              type="textarea"
              value={(v.description || []).join("\n\n")}
              help="Leave a blank line between paragraphs."
              error={errors.description}
            />
            <Field name="eligibility" label="Who can apply" value={v.eligibility} error={errors.eligibility} />
            <div className="row">
              <Field name="location" label="Where" value={v.location || "Nigeria"} error={errors.location} />
              <Field name="deadline" label="Deadline" type="date" value={v.deadline || ""} optional help="Leave empty for rolling deadlines." />
            </div>
            <Field name="link" label="Official application link" type="url" value={v.link} placeholder="https://" error={errors.link} />
            <Field
              name="steps"
              label="Steps after continuing"
              type="textarea"
              value={(v.steps || []).join("\n")}
              optional
              help="One step per line. Shown before the student leaves for the official site."
            />
            <Field name="partner" label="Impact report goes to" value={v.partner} optional placeholder="e.g. Google for Education, Nigeria" />
            <Check name="verified" label="Verified: someone on the team has checked the official source" checked={!!v.verified} />
            <Check name="certificate" label="Ask students for a certificate when they mark it complete" checked={!!v.certificate} />
          </div>
          <div className="btns">
            <button className="btn btn-forest" type="submit">
              Save opportunity
            </button>
            <Link className="btn btn-line-dark" href="/staff">
              Cancel
            </Link>
          </div>
        </form>
      ) : (
        <form className="form" id="form" noValidate />
      )}
    </main>
  );
}
