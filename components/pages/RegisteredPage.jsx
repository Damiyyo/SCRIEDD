"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { first } from "@/lib/ui";
export default function RegisteredPage({ id }) {
  const { ready } = useStore();
  const router = useRouter();
  const o = ready ? Store.getOpp(id) : null;
  const app = ready ? Store.myApp(id) : null;
  const u = ready ? Store.currentUser() : null;
  useEffect(() => {
    if (!ready) return;
    if (!Store.getOpp(id)) router.replace("/opportunities");
    else if (!Store.myApp(id)) router.replace(`/opportunities/${encodeURIComponent(id)}/apply`);
  }, [ready, id, router]);
  const show = !!(o && app);
  return (
    <main id="main" className="done-wrap">
      <div className="done-tick" aria-hidden="true">
        ✓
      </div>
      <h1 id="title">{show ? `You're registered, ${first(app.fullName)}.` : "You're registered."}</h1>
      <p id="sub">{show ? `One more step: finish your application on the official ${o.org} page.` : ""}</p>
      <div className="steps-box" id="steps" hidden={!(show && (o.steps || []).length)}>
        <h2>What to do next</h2>
        <ol id="stepList">{show ? (o.steps || []).map((s, i) => <li key={i}>{s}</li>) : null}</ol>
      </div>
      <div className="btns" style={{ marginTop: 28 }}>
        <a
          className="btn btn-gold"
          href="#"
          id="go"
          onClick={(e) => {
            e.preventDefault();
            window.open(Store.clickThrough(id), "_blank", "noopener");
          }}
        >
          {show ? "Continue to " + o.org : ""}
        </a>
      </div>
      <p className="after" id="after">
        {show ? (
          u ? (
            <>
              When you&apos;re done, <Link href="/dashboard">mark it complete on your dashboard</Link> and upload your certificate.
            </>
          ) : (
            <>
              Want to track this and add it to your record? <Link href={"/join?email=" + encodeURIComponent(app.email)}>Create a free account</Link>{" "}
              with {app.email}.
            </>
          )
        ) : null}
      </p>
    </main>
  );
}
