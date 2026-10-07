"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Field, FormError, ProfileFields, useFormErrors } from "@/components/Forms";
import { useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { first, flash, formData, safeNext } from "@/lib/ui";
export default function JoinPage({ next = "", email = "" }) {
  const { ready } = useStore();
  const router = useRouter();
  const { errors, setErrors, formRef } = useFormErrors();
  const [show, setShow] = useState(false);
  const target = safeNext(next);
  // Already signed in? Go straight to the dashboard (only checked when the page opens).
  useEffect(() => {
    if (!ready) return;
    if (Store.currentUser()) router.replace("/dashboard");
    else setShow(true);
  }, [ready, router]);
  return (
    <main id="main" className="auth">
      <aside className="auth-side">
        <div>
          <h1>One account. Every opportunity.</h1>
          <p>Fill in your details once. After that, applying for any opportunity on Scried takes one tap.</p>
        </div>
        <ul>
          <li>Your details fill themselves in on every application</li>
          <li>Track what you&apos;ve applied for and what you&apos;ve finished</li>
          <li>Build a verified record of certificates employers can trust</li>
          <li>Keep your streak alive and never miss a deadline</li>
        </ul>
      </aside>
      <section className="auth-main">
        <h2>Create your account</h2>
        <p className="sub">
          It takes about a minute. Already have one?{" "}
          <Link
            id="toSignin"
            href={next ? "/signin?next=" + encodeURIComponent(next) : "/signin"}
            style={{ color: "var(--forest)", fontWeight: 600 }}
          >
            Sign in
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
              const res = await Store.signUp(formData(e.currentTarget));
              if (res.errors) {
                setErrors(res.errors);
                return;
              }
              flash(`Welcome to Scried, ${first(res.user?.fullName)}. Your details are saved, so applying is one tap from now on.`);
              router.push(target || "/dashboard");
            }}
          >
            <FormError message={errors.form} />
            <div id="fields">
              <ProfileFields values={{ email }} errors={errors} />
              <Field
                name="password"
                label="Password"
                type="password"
                help="At least 8 characters."
                autoComplete="new-password"
                error={errors.password}
              />
              <Check
                name="consent"
                label="I agree that Scried can store my details to share opportunities with me and to report on program impact. Scried never sells my data."
                error={errors.consent}
              />
            </div>
            <button className="btn btn-forest" type="submit" style={{ justifySelf: "start" }}>
              Create my account
            </button>
          </form>
        ) : (
          <form className="form" id="form" noValidate />
        )}
      </section>
    </main>
  );
}
