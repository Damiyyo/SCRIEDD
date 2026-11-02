"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, FormError, useFormErrors } from "@/components/Forms";
import { useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { flash, formData } from "@/lib/ui";
export default function StaffSetupPage() {
  const { ready } = useStore();
  const router = useRouter();
  const { errors, setErrors, formRef } = useFormErrors();
  return (
    <main id="main" className="wrap apply-wrap">
      <aside>
        <p style={{ fontWeight: 600, color: "var(--forest)" }}>Staff</p>
        <h1 style={{ marginTop: 12 }}>Create the first staff account</h1>
        <p>Staff can add opportunities, see impact reports and verify certificates. This page only works while no staff account exists.</p>
      </aside>
      {!ready ? (
        <form className="form" id="form" noValidate />
      ) : Store.hasStaff() && !Store.currentUser()?.isStaff ? (
        <form className="form" id="form" noValidate>
          <p>
            A staff account already exists.{" "}
            <Link href={"/signin?next=" + encodeURIComponent("/staff")} style={{ color: "var(--forest)", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </form>
      ) : (
        <form
          className="form"
          id="form"
          noValidate
          ref={formRef}
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await Store.createStaff(formData(e.currentTarget));
            if (res.errors) {
              setErrors(res.errors);
              return;
            }
            flash("Staff account created.");
            router.push("/staff");
          }}
        >
          <FormError message={errors.form} />
          <div id="fields">
            <Field name="fullName" label="Your name" error={errors.fullName} />
            <Field name="email" label="Email" type="email" error={errors.email} />
            <Field name="password" label="Password" type="password" help="At least 8 characters." error={errors.password} />
          </div>
          <button className="btn btn-forest" type="submit" style={{ justifySelf: "start" }}>
            Create staff account
          </button>
        </form>
      )}
    </main>
  );
}
