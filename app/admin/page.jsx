"use client";

import { useState } from "react";
import Link from "next/link";
import { backendRequest } from "@/lib/backend";

const initialDocument = { privacy: "", terms: "", version: "1.0" };

export default function AdminPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [session, setSession] = useState(null);
  const [document, setDocument] = useState(initialDocument);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  async function signIn(event) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const result = await backendRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      const accessToken = result?.data?.access_token;
      if (!accessToken) throw new Error("The API did not return an admin access token.");
      setSession({ accessToken, email: credentials.email });
      setStatus({ type: "success", text: "Signed in. You can now publish an approved consent version." });
    } catch (error) {
      setStatus({ type: "error", text: error.message || "Sign-in failed. Check the admin credentials." });
    } finally {
      setBusy(false);
    }
  }

  async function publish(event) {
    event.preventDefault();
    if (document.privacy.trim().length < 20 || document.terms.trim().length < 20 || !document.version.trim()) {
      setStatus({ type: "error", text: "Add a version plus at least 20 characters for both approved documents." });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      await backendRequest("/admin/consent-documents", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({
          version: document.version.trim(),
          privacy_notice_text: document.privacy.trim(),
          terms_text: document.terms.trim(),
        }),
      });
      setStatus({ type: "success", text: "Consent documents published successfully. The public registration flow can now read this version." });
      setDocument(initialDocument);
    } catch (error) {
      setStatus({ type: "error", text: error.message || "The consent documents could not be published." });
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    setSession(null);
    setCredentials({ email: "", password: "" });
    setDocument(initialDocument);
    setStatus(null);
  }

  return (
    <main className="admin-page" id="main">
      <div className="admin-topbar">
        <Link className="admin-brand" href="/">scried<span>.</span></Link>
        <div className="admin-top-actions">
          <Link className="admin-public-link" href="/">Visit public site</Link>
          {session && <button className="admin-signout-button" type="button" onClick={signOut}>Sign out</button>}
        </div>
      </div>
      <div className="admin-wrap">
        {!session ? (
          <section className="admin-login-card" aria-labelledby="admin-login-title">
            <div className="admin-mark">S</div>
            <p className="admin-eyebrow"></p>
            <h1 id="admin-login-title">Admin sign in</h1>
            <p className="admin-intro">Scried administrator account to manage the consent documents.</p>
            <form className="admin-form" onSubmit={signIn}>
              <label>Email<input type="email" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} autoComplete="username" required /></label>
              <label>Password<input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} autoComplete="current-password" required /></label>
              {status && <p className={`admin-status ${status.type}`} role="alert">{status.text}</p>}
              <button className="admin-button" type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in to admin"}</button>
            </form>
            <p className="admin-footnote"></p>
          </section>
        ) : (
          <>
            <header className="admin-heading">
              <div><p className="admin-eyebrow">Authenticated as {session.email}</p><h1>Consent control room</h1><p className="admin-intro">Publish the legally approved privacy notice and terms that the public app must present before registration or applications.</p></div>
            </header>
            <div className="admin-grid">
              <section className="admin-panel">
                <div className="admin-panel-kicker">Publish</div>
                <h2>Make your consent version active</h2>
                <p className="admin-muted">These messages are stored as an immutable version, therefore cannot be edited after publishing. Please do not use a drafted or unapproved wording here.</p>
                <form className="admin-form" onSubmit={publish}>
                  <label>Version<input value={document.version} onChange={(event) => setDocument({ ...document, version: event.target.value })} placeholder="1.1" required /></label>
                  <label>Privacy notice<textarea value={document.privacy} onChange={(event) => setDocument({ ...document, privacy: event.target.value })} placeholder="Paste the approved privacy notice..." minLength={20} required /></label>
                  <label>Terms of use<textarea value={document.terms} onChange={(event) => setDocument({ ...document, terms: event.target.value })} placeholder="Paste the approved terms of use..." minLength={20} required /></label>
                  {status && <p className={`admin-status ${status.type}`} role="status">{status.text}</p>}
                  <button className="admin-button" type="submit" disabled={busy}>{busy ? "Publishing..." : "Publish consent version"}</button>
                </form>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
