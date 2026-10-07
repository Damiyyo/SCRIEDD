"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileFields, useFormErrors } from "@/components/Forms";
import { useRequireUser } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { flash, formData } from "@/lib/ui";
export default function ProfilePage() {
  const u = useRequireUser();
  const router = useRouter();
  const { errors, setErrors, formRef } = useFormErrors();
  return (
    <main id="main" className="wrap apply-wrap">
      <aside>
        <h1>Your details</h1>
        <p>
          These fill in every application automatically. Keep them up to date, especially your name: it&apos;s what appears on certificates and
          reports.
        </p>
        <p>
          <Link href="/record" style={{ color: "var(--forest)", fontWeight: 600 }}>
            View my Scried record
          </Link>{" "}
          ·{" "}
          <Link href="/certificates" style={{ color: "var(--forest)", fontWeight: 600 }}>
            My certificates
          </Link>
        </p>
      </aside>
      {u ? (
        <form
          className="form"
          id="form"
          noValidate
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            const res = Store.updateProfile(formData(e.currentTarget));
            if (res.errors) {
              setErrors(res.errors);
              return;
            }
            flash("Profile saved. New applications will use these details.");
            router.push("/dashboard");
          }}
        >
          <div id="fields">
            <ProfileFields values={u} lockEmail errors={errors} />
          </div>
          <div className="btns">
            <button className="btn btn-forest" type="submit">
              Save details
            </button>
            <Link className="btn btn-line-dark" href="/dashboard">
              Cancel
            </Link>
          </div>
        </form>
      ) : (
        <form className="form" id="form" noValidate />
      )}
    </main>
  );
}
