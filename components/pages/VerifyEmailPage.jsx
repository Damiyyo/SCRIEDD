"use client";
import Link from "next/link";
import { useState } from "react";
import { backendRequest } from "@/lib/backend";

export default function VerifyEmailPage({ token = "" }) {
  const [state, setState] = useState(token ? "ready" : "missing");
  const [message, setMessage] = useState(token ? "Confirm to verify the email address for your Scried account." : "The verification link is missing its token. Please open the complete link from your email.");
  const [busy, setBusy] = useState(false);

  async function verify() {
    setBusy(true);
    setState("verifying");
    setMessage("Verifying your email address...");
    try {
      await backendRequest("/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) });
      setState("success");
      setMessage("Your email has been verified. You can now sign in to Scried.");
    } catch (error) {
      setState("error");
      setMessage(error.message || "This verification link may have expired or already been used.");
    } finally {
      setBusy(false);
    }
  }

  return <main id="main" className="auth"><aside className="auth-side"><div><h1>Email verification.</h1><p>One quick step to finish setting up your Scried account.</p></div></aside><section className="auth-main"><div className={`verify-result ${state}`} role="status" aria-live="polite"><span className="verify-mark" aria-hidden="true">{state === "success" ? "✓" : state === "error" || state === "missing" ? "!" : state === "verifying" ? "…" : "@"}</span><h2>{state === "success" ? "You’re verified" : state === "verifying" ? "Verifying your email" : state === "ready" ? "Confirm your email" : "Verification link issue"}</h2><p>{message}</p>{state === "ready" && <button className="btn btn-forest" type="button" onClick={verify} disabled={busy}>Verify email</button>}{state === "success" && <Link className="btn btn-forest" href="/signin">Continue to sign in</Link>}{(state === "error" || state === "missing") && <Link className="btn btn-forest" href="/join">Back to registration</Link>}</div></section></main>;
}
