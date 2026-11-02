"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, FormError, useFormErrors } from "@/components/Forms";
import { useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { flash, formData } from "@/lib/ui";
export default function ForgotPage() {
  const { ready } = useStore();
  const router = useRouter();
  const { errors, setErrors, formRef } = useFormErrors();
  return (
    <main id="main" className="auth">
      <aside className="auth-side">
        <div>
          <h1>Locked out? It happens.</h1>
          <p>Set a new password for your account.</p>
        </div>
      </aside>
      <section className="auth-main">
        <h2>Reset your password</h2>
        <p className="sub">
          In this prototype you can set a new password straight away. Once Scried is connected to a server, this page will email a reset link instead.
        </p>
        {ready ? (
          <form
            className="form"
            id="form"
            noValidate
            ref={formRef}
            onSubmit={async (e) => {
              e.preventDefault();
              const d = formData(e.currentTarget);
              const res = await Store.resetPassword(d.email, d.password);
              if (res.error) {
                setErrors({ form: res.error });
                return;
              }
              flash("Password changed. Sign in with your new password.");
              router.push("/signin");
            }}
          >
            <FormError message={errors.form} />
            <div id="fields">
              <Field name="email" label="Email" type="email" />
              <Field name="password" label="New password" type="password" help="At least 8 characters." />
            </div>
            <button className="btn btn-forest" type="submit" style={{ justifySelf: "start" }}>
              Save new password
            </button>
            <p className="auth-alt">
              <Link href="/signin">Back to sign in</Link>
            </p>
          </form>
        ) : (
          <form className="form" id="form" noValidate />
        )}
      </section>
    </main>
  );
}
