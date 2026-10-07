"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Field, FormError, ProfileFields, useFormErrors } from "@/components/Forms";
import { useDocumentTitle, useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { flash, formData } from "@/lib/ui";
export default function ApplyPage({ id }) {
  const { ready } = useStore();
  const router = useRouter();
  const o = ready ? Store.getOpp(id) : null;
  const u = ready ? Store.currentUser() : null;
  const { errors, setErrors, formRef } = useFormErrors();
  const [busy, setBusy] = useState(false);
  const [savePw, setSavePw] = useState(false);
  // Where this page should send you instead (decided once the data is ready)
  useEffect(() => {
    if (!ready) return;
    const opp = Store.getOpp(id);
    if (!opp) {
      router.replace("/opportunities");
      return;
    }
    if (Store.myApp(id)) {
      router.replace(`/opportunities/${encodeURIComponent(id)}/registered`);
      return;
    }
    if (!Store.isOpen(opp)) {
      flash("This opportunity has closed.", "error");
      router.replace(`/opportunities/${encodeURIComponent(id)}`);
    }
  }, [ready, id, router]);
  useDocumentTitle(o ? "Apply: " + o.title + " | Scried" : null);
  const usable = !!o && Store.isOpen(o) && !Store.myApp(id);
  return (
    <main id="main" className="wrap apply-wrap">
      <aside>
        <p style={{ fontWeight: 600, color: "var(--forest)" }} id="kicker">
          {o ? Store.typeLabel(o.type) + " · " + o.org : ""}
        </p>
        <h1 style={{ marginTop: 12 }} id="title">
          {o ? o.title : ""}
        </h1>
        <p>Register your details, then we&apos;ll send you to the official page to finish your application.</p>
        <p>Your name is used exactly as you type it on any certificate and in your Scried record, so check the spelling.</p>
        <div className="signin-nudge" id="nudge" hidden={!(usable && !u)}>
          <b>Applied through Scried before?</b>
          <p>Sign in and this form fills itself in.</p>
          <Link className="btn btn-forest" id="nudgeLink" href={"/signin?next=" + encodeURIComponent(`/opportunities/${id}/apply`)}>
            Sign in
          </Link>
        </div>
      </aside>
      {usable ? (
        <form
          className="form"
          id="form"
          noValidate
          ref={formRef}
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            setBusy(true);
            try {
              const res = await Store.apply(id, formData(form));
              if (res.errors) {
                setErrors(res.errors);
                return;
              }
              if (res.existing) flash("You've already registered for this one. Here's your link again.", "info");
              else if (res.createdAccount) flash("Your account is ready. Next time, this form fills itself in.");
              router.push(`/opportunities/${encodeURIComponent(id)}/registered`);
            } catch (err) {
              setErrors({ form: err.message });
            } finally {
              setBusy(false);
            }
          }}
        >
          <FormError message={errors.form} />
          <p className="autofill" id="autofill" hidden={!u}>
            ✓ Filled in from your profile. Change anything that&apos;s out of date.
          </p>
          <div id="fields">
            <ProfileFields values={u || {}} lockEmail={!!u} errors={errors} />
          </div>
          {!u && (
            <div className="save-box" id="saveBox">
              <Check name="saveDetails" label="Save my details so I don't have to type them again" onChange={setSavePw} />
              <div id="pw" hidden={!savePw}>
                <Field
                  name="password"
                  label="Create a password"
                  type="password"
                  help="At least 8 characters. Lets you track your progress and apply in one tap next time."
                  autoComplete="new-password"
                  error={errors.password}
                />
              </div>
            </div>
          )}
          <div id="consent">
            <Check
              name="consent"
              label="I agree that Scried can store these details and share anonymised totals with the organisation offering this opportunity."
              error={errors.consent}
            />
          </div>
          <button className="btn btn-gold" type="submit" style={{ justifySelf: "start" }} disabled={busy}>
            Register and continue
          </button>
        </form>
      ) : (
        <form className="form" id="form" noValidate />
      )}
    </main>
  );
}
