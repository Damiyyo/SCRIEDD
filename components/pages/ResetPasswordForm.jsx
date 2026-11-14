"use client";
import Link from "next/link";
import { useState } from "react";
import { Field, FormError, useFormErrors } from "@/components/Forms";
import { backendRequest } from "@/lib/backend";

export default function ResetPasswordForm({ initialToken = "" }) {
  const { errors, setErrors, formRef } = useFormErrors();
  const [token, setToken] = useState(initialToken);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  return <section className="auth-main"><h2>Choose a new password</h2><p className="sub">Use the secure reset token from your email and choose a password for your Scried account.</p>{done ? <div className="admin-status success" role="status">Your password has been reset. You can now sign in with your new password.</div> : <form className="form" noValidate ref={formRef} onSubmit={async (event) => { event.preventDefault(); setBusy(true); setErrors({}); const form = new FormData(event.currentTarget); const password = String(form.get("new_password") || ""); const confirm = String(form.get("confirm_password") || ""); if (password !== confirm) { setErrors({ confirm_password: "Passwords do not match." }); setBusy(false); return; } try { await backendRequest("/auth/reset-password", { method: "POST", body: JSON.stringify({ token: String(form.get("token") || "").trim(), new_password: password }) }); setDone(true); } catch (error) { setErrors({ form: error.message || "Unable to reset your password. The link may have expired." }); } finally { setBusy(false); } }}><FormError message={errors.form} /><Field name="token" label="Reset token" type="text" autoComplete="one-time-code" value={token} onChange={(event) => setToken(event.target.value)} error={errors.token} /><Field name="new_password" label="New password" type="password" autoComplete="new-password" minLength={8} error={errors.new_password} /><Field name="confirm_password" label="Confirm new password" type="password" autoComplete="new-password" minLength={8} error={errors.confirm_password} /><button className="btn btn-forest" type="submit" disabled={busy || !token.trim()} style={{ justifySelf: "start" }}>{busy ? "Updating password..." : "Reset password"}</button><p className="auth-alt"><Link href="/signin">Back to sign in</Link></p></form>}</section>;
}
