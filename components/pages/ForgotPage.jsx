"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Field, FormError, useFormErrors } from "@/components/Forms";
import { backendRequest } from "@/lib/backend";
import { formData } from "@/lib/ui";

export default function ForgotPage() {
  const { errors, setErrors, formRef } = useFormErrors();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  return <main id="main" className="auth"><aside className="auth-side"><div><h1>Locked out? It happens.</h1><p>Request a secure reset link for your Scried account.</p></div></aside><section className="auth-main"><h2>Reset your password</h2><p className="sub">Enter your account email and we&apos;ll send reset instructions if the account exists.</p>{sent ? <div className="admin-status success" role="status">If an account exists for that email, a password-reset link has been sent. Check your inbox and follow the link to finish resetting your password.</div> : <form className="form" noValidate ref={formRef} onSubmit={async (event) => { event.preventDefault(); setBusy(true); setErrors({}); try { await backendRequest("/auth/request-password-reset", { method: "POST", body: JSON.stringify({ email: formData(event.currentTarget).email }) }); setSent(true); } catch (error) { setErrors({ form: error.message || "Unable to request a reset link." }); } finally { setBusy(false); } }}><FormError message={errors.form} /><Field name="email" label="Email" type="email" autoComplete="email" autoFocus error={errors.email} /><button className="btn btn-forest" type="submit" disabled={busy} style={{ justifySelf: "start" }}>{busy ? "Sending..." : "Send reset link"}</button><p className="auth-alt"><Link href="/signin">Back to sign in</Link></p></form>}<p className="auth-alt"><Link href="/reset-password">Already have a reset token?</Link></p></section></main>;
}
