"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Field, FormError, useFormErrors } from "@/components/Forms";
import { useAuth } from "@/lib/auth-context";
import { formData, safeNext } from "@/lib/ui";

export default function SigninPage({ next = "" }) {
  const router = useRouter();
  const { ready, isAuthenticated, user, signIn } = useAuth();
  const { errors, setErrors, formRef } = useFormErrors();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const target = safeNext(next);
  const destination = user?.isStaff ? "/admin" : target || "/dashboard";

  useEffect(() => {
    if (!ready) return;
    if (isAuthenticated) router.replace(destination);
    else setShow(true);
  }, [ready, isAuthenticated, destination, router]);

  return <main id="main" className="auth"><aside className="auth-side"><div><h1>Welcome back.</h1><p>Sign in and every application form fills itself in with your details.</p></div><ul><li>Pick up your streak where you left off</li><li>Mark opportunities complete and upload certificates</li></ul></aside><section className="auth-main"><h2>Sign in</h2><p className="sub">New here? <Link href={next ? `/join?next=${encodeURIComponent(next)}` : "/join"} style={{ color: "var(--forest)", fontWeight: 600 }}>Create an account</Link></p>{show && <form className="form" noValidate ref={formRef} onSubmit={async (event) => { event.preventDefault(); setBusy(true); setErrors({}); try { await signIn(formData(event.currentTarget)); router.replace(destination); } catch (error) { setErrors({ form: error.message || "Unable to sign in." }); } finally { setBusy(false); } }}><FormError message={errors.form} /><div id="fields"><Field name="email" label="Email" type="email" autoComplete="email" autoFocus error={errors.email} /><Field name="password" label="Password" type="password" autoComplete="current-password" error={errors.password} /></div><button className="btn btn-forest" type="submit" disabled={busy} style={{ justifySelf: "start" }}>{busy ? "Signing in..." : "Sign in"}</button><p className="auth-alt"><Link href="/forgot">Forgot your password?</Link></p></form>}</section></main>;
}
