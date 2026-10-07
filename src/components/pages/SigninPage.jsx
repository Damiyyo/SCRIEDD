"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Field, FormError, useFormErrors } from "@/components/Forms";
import { useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { flash, formData, safeNext } from "@/lib/ui";
export default function SigninPage({ next = "" }) {
  const { ready } = useStore();
  const router = useRouter();
  const { errors, setErrors, formRef } = useFormErrors();
  const [show, setShow] = useState(false);
  const target = safeNext(next);
  // Staff-only pages need a staff account; otherwise honour ?next=
  const allowed = (u) => (target && (u.isStaff || !target.startsWith("/staff")) ? target : u.isStaff ? "/staff" : "/dashboard");
  // Already signed in? Don't show the form: send them on (only checked when the page opens).
  useEffect(() => {
    if (!ready) return;
    const u0 = Store.currentUser();
    if (u0) {
      if (target.startsWith("/staff") && !u0.isStaff) {
        flash("That page is for Scried staff. Sign out and sign in with a staff account to open it.", "error");
        router.replace("/dashboard");
      } else router.replace(allowed(u0));
    } else setShow(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  return (
    <main id="main" className="auth">
      <aside className="auth-side">
        <div>
          <h1>Welcome back.</h1>
          <p>Sign in and every application form fills itself in with your details.</p>
        </div>
        <ul>
          <li>Pick up your streak where you left off</li>
          <li>Mark opportunities complete and upload certificates</li>
        </ul>
      </aside>
      <section className="auth-main">
        <h2>Sign in</h2>
        <p className="sub">
          New here?{" "}
          <Link id="toJoin" href={next ? "/join?next=" + encodeURIComponent(next) : "/join"} style={{ color: "var(--forest)", fontWeight: 600 }}>
            Create an account
          </Link>
        </p>
        {show ? (
          <form
            className="form"
            id="form"
            noValidate
            ref={formRef}
            onSubmit={async (e) => {
              e.preventDefault();
              const d = formData(e.currentTarget);
              const res = await Store.signIn(d.email, d.password);
              if (res.error || !res.user) {
                setErrors({ form: res.error || "" });
                return;
              }
              router.push(allowed(res.user));
            }}
          >
            <FormError message={errors.form} />
            <div id="fields">
              <Field name="email" label="Email" type="email" autoComplete="email" autoFocus />
              <Field name="password" label="Password" type="password" autoComplete="current-password" />
            </div>
            <button className="btn btn-forest" type="submit" style={{ justifySelf: "start" }}>
              Sign in
            </button>
            <p className="auth-alt">
              <Link href="/forgot">Forgot your password?</Link>
            </p>
          </form>
        ) : (
          <form className="form" id="form" noValidate />
        )}
      </section>
    </main>
  );
}
