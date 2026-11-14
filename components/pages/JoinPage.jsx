"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Field, FormError, useFormErrors } from "@/components/Forms";
import { useAuth } from "@/lib/auth-context";
import { backendRequest } from "@/lib/backend";
import { formData } from "@/lib/ui";

export default function JoinPage({ next = "", email = "" }) {
  const router = useRouter();
  const { ready, isAuthenticated, signIn } = useAuth();
  const { errors, setErrors, formRef } = useFormErrors();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [justCreated, setJustCreated] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (isAuthenticated && !justCreated) router.replace("/dashboard");
    else if (!isAuthenticated) setShow(true);
  }, [ready, isAuthenticated, justCreated, router]);

  async function createAccount(event) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      const values = formData(event.currentTarget);
      if (!values.consent) throw new Error("Please accept the consent notice to create an account.");
      const consentResult = await backendRequest("/consent-documents/current");
      const documents = consentResult?.data?.documents || [];
      const consentVersion = documents[0]?.version;
      if (!consentVersion) throw new Error("Consent documents are not currently available. Please try again later.");
      const fullName = String(values.fullName || "").trim();
      const result = await backendRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: String(values.email || "").trim(),
          password: values.password,
          full_name: fullName,
          consent_accepted: true,
          consent_version: consentVersion,
        }),
      });
      const tokens = result?.data || result;
      if (tokens?.access_token) {
        setJustCreated(true);
        await signIn({ email: String(values.email || "").trim(), password: values.password });
        router.replace("/campaigns?step=welcome");
      } else {
        setSuccess("Your account was created. Check your email to verify it, then sign in.");
      }
    } catch (error) {
      setJustCreated(false);
      setErrors({ form: error.message || "Unable to create your account." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main id="main" className="auth join-auth">
      <aside className="auth-side">
        <div><h1>One account. Every opportunity.</h1><p>Create your account in a few quick steps. Add your school and education details later from your profile.</p></div>
        <ul><li>Browse verified scholarships, internships, and programs</li><li>Track the opportunities you apply for</li><li>Build a record of completed opportunities and certificates</li></ul>
      </aside>
      <section className="auth-main">
        <h2>Create your account</h2>
        <p className="sub">Already have one? <Link href={next ? `/signin?next=${encodeURIComponent(next)}` : "/signin"} style={{ color: "var(--forest)", fontWeight: 600 }}>Sign in</Link></p>
        {success ? <div className="admin-status success" role="status">{success}</div> : show && (
          <form className="form" noValidate ref={formRef} onSubmit={createAccount}>
            <FormError message={errors.form} />
            <Field name="fullName" label="Full name" autoComplete="name" error={errors.fullName} inputProps={{ required: true, minLength: 2, maxLength: 160 }} />
            <Field name="email" label="Email address" type="email" value={email} autoComplete="email" error={errors.email} inputProps={{ required: true, maxLength: 254 }} />
            <Field name="password" label="Password" type="password" help="At least 8 characters." error={errors.password} autoComplete="new-password" inputProps={{ required: true, minLength: 8 }} />
            <Check name="consent" label="I agree that Scried can store my details to share opportunities with me and to report on program impact. Scried never sells my data." error={errors.consent} />
            <button className="btn btn-forest" type="submit" disabled={busy} style={{ justifySelf: "start" }}>{busy ? "Creating account…" : "Create my account"}</button>
          </form>
        )}
      </section>
    </main>
  );
}
