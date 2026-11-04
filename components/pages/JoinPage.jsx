"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Field, FormError, ProfileFields, useFormErrors } from "@/components/Forms";
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
   useEffect(() => { if (!ready) return; if (isAuthenticated) router.replace("/dashboard"); else setShow(true); }, [ready, isAuthenticated, router]);

  return <main id="main" className="auth join-auth"><aside className="auth-side"><div><h1>One account. Every opportunity.</h1><p>Fill in your details once. After that, applying for any opportunity on Scried takes one tap.</p></div><ul><li>Your details fill themselves in on every application</li><li>Track what you&apos;ve applied for and what you&apos;ve finished</li><li>Build a verified record of certificates employers can trust</li></ul></aside><section className="auth-main"><h2>Create your account</h2><p className="sub">Already have one? <Link href={next ? `/signin?next=${encodeURIComponent(next)}` : "/signin"} style={{ color: "var(--forest)", fontWeight: 600 }}>Sign in</Link></p>{success ? <div className="admin-status success" role="status">{success}</div> : show && <form className="form" noValidate ref={formRef} onSubmit={async (event) => { event.preventDefault(); setBusy(true); setErrors({}); try { const values = formData(event.currentTarget); if (!values.consent) throw new Error("Please accept the consent notice to create an account."); const consentResult = await backendRequest("/consent-documents/current");
        const documents = consentResult?.data?.documents || [];
        const consentVersion = documents[0]?.version;
        if (!consentVersion) throw new Error("Consent documents are not currently available. Please try again later.");
        const result = await backendRequest("/auth/register", { method: "POST", body: JSON.stringify({ email: values.email, password: values.password, full_name: values.fullName, consent_accepted: true, consent_version: consentVersion }) }); const tokens = result?.data || result; if (tokens?.access_token) { await signIn({ email: values.email, password: values.password });
        router.replace("/campaigns"); } else setSuccess("Your account was created. Check your email to verify it, then sign in."); } catch (error) { setErrors({ form: error.message || "Unable to create your account." }); } finally { setBusy(false); } }}><FormError message={errors.form} /><div id="fields"><ProfileFields values={{ email }} errors={errors} /><Field name="password" label="Password" type="password" help="At least 8 characters." error={errors.password} autoComplete="new-password" /><Check name="consent" label="I agree that Scried can store my details to share opportunities with me and to report on program impact. Scried never sells my data." error={errors.consent} /></div><button className="btn btn-forest" type="submit" disabled={busy} style={{ justifySelf: "start" }}>{busy ? "Creating account..." : "Create my account"}</button></form>}</section></main>;
}
