"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, Field, FormError, useFormErrors } from "@/components/Forms";
import { SCRIED_OUTCOMES } from "@/data/content";
import { useRequireUser } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { flash, formData } from "@/lib/ui";
export default function CompletePage({ appId }) {
  const u = useRequireUser();
  const router = useRouter();
  const { errors, setErrors, formRef } = useFormErrors();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const finished = useRef(false); // set once we submit successfully, so the "already complete" redirect below stays out of the way
  const a = u ? Store.myApps().find((x) => x.id === appId) : undefined;
  const already = a ? !!Store.completionFor(a.id) : false;
  useEffect(() => {
    if (!u) return;
    if (!a) {
      flash("We couldn't find that application on your account.", "error");
      router.replace("/dashboard");
    } else if (already && !busy && !finished.current) {
      flash("You've already marked this one complete.", "info");
      router.replace("/dashboard");
    }
  }, [u, a, already, busy, router]);
  const o = a ? Store.getOpp(a.opp) || { title: "This opportunity", org: "the organiser", certificate: false } : null;
  return (
    <main id="main" className="wrap apply-wrap">
      <aside>
        <p style={{ fontWeight: 600, color: "var(--forest)" }}>Mark complete</p>
        <h1 style={{ marginTop: 12 }} id="title">
          {o ? o.title : ""}
        </h1>
        <p id="why">
          {o ? `Tell us how it went. Your answers help ${o.org} improve, and help us bring more opportunities like this to students.` : ""}
        </p>
        <p id="why2">
          {o
            ? `Once we verify your ${o.certificate ? "certificate" : "proof"}, it's added to your Scried record, which you can share with future employers.`
            : ""}
        </p>
      </aside>
      {a && o && !already ? (
        <form
          className="form"
          id="form"
          noValidate
          ref={formRef}
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              const res = await Store.complete(a.id, formData(e.currentTarget), fileRef.current?.files?.[0] || null);
              if (res.errors) {
                setErrors(res.errors);
                return;
              }
              finished.current = true;
              flash(
                `Nice work. “${o.title}” is now on your Scried record.` + (res.completion?.file ? " We'll verify your certificate shortly." : "")
              );
              router.push("/dashboard");
            } catch (err) {
              setErrors({ form: err.message });
            } finally {
              setBusy(false);
            }
          }}
        >
          <FormError message={errors.form} />
          <fieldset className={"field" + (errors.outcome ? " has-error" : "")} data-field="outcome" style={{ border: 0 }}>
            <legend style={{ fontWeight: 600, fontSize: ".95rem", marginBottom: 10 }}>What happened?</legend>
            <div className="radios" id="outcomes">
              {SCRIED_OUTCOMES.map(([k, l]) => (
                <label key={k}>
                  <input type="radio" name="outcome" value={k} /> {l}
                </label>
              ))}
            </div>
            <p className="err" hidden={!errors.outcome}>
              {errors.outcome}
            </p>
          </fieldset>
          <fieldset className={"field" + (errors.rating ? " has-error" : "")} data-field="rating" style={{ border: 0 }}>
            <legend style={{ fontWeight: 600, fontSize: ".95rem", marginBottom: 10 }}>How useful was it? (1 = not useful, 5 = very useful)</legend>
            <div className="radios row5" id="ratings">
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n}>
                  <input type="radio" name="rating" value={n} /> {n}
                </label>
              ))}
            </div>
            <p className="err" hidden={!errors.rating}>
              {errors.rating}
            </p>
          </fieldset>
          <div id="text">
            <Field
              name="gained"
              label="What did you gain from it?"
              type="textarea"
              placeholder="e.g. I learned to use AI to summarise my lecture notes and prepare for exams."
              error={errors.gained}
            />
            <Field name="usedFor" label="How have you used it, or how will you?" type="textarea" optional error={errors.usedFor} />
            <Check name="recommend" label="I'd recommend it to other students" checked />
          </div>
          <div className={"field" + (errors.file ? " has-error" : "")} data-field="file">
            <label htmlFor="f-file" id="fileLabel">
              {o.certificate ? "Certificate" : "Proof (screenshot)"}
            </label>
            <input id="f-file" type="file" accept=".pdf,.jpg,.jpeg,.png" ref={fileRef} />
            <p className="help" id="fileHelp">
              {"PDF, JPG or PNG, up to 5MB. " +
                (o.certificate
                  ? "Required if you finished or were selected."
                  : "Optional. A screenshot showing it's active on your account helps us verify it.")}
            </p>
            <p className="err" hidden={!errors.file}>
              {errors.file}
            </p>
          </div>
          <div className="btns">
            <button className="btn btn-forest" type="submit" disabled={busy}>
              Submit and mark complete
            </button>
            <Link className="btn btn-line-dark" href="/dashboard">
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
