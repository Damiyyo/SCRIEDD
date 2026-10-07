"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { flash, flashNow } from "@/lib/ui";
export default function DemoPage() {
  const { ready } = useStore();
  const router = useRouter();
  const [pending, setPending] = useState(null);
  const o = ready ? Store.overview() : null;
  const signInAs = async (email, pw) => {
    if (!Store.demo) await Store.loadDemo();
    const r = await Store.signIn(email, pw);
    router.push(r.user?.isStaff ? "/staff" : "/dashboard");
  };
  const status = !o
    ? ""
    : Store.demo
      ? `Demo data is on: ${o.students} students, ${o.applications} registrations.`
      : `Demo data is off. ${o.students} real account${o.students === 1 ? "" : "s"} in this browser.`;
  return (
    <main id="main" className="wrap rep" style={{ maxWidth: 820 }}>
      <div className="rep-head">
        <div>
          <p className="eyebrow">Prototype</p>
          <h1>Demo data</h1>
          <p>This prototype saves everything in this browser. Sample students and opportunities are loaded so you can try every page.</p>
        </div>
      </div>
      <div className="box">
        <h2>Try it as</h2>
        <div className="table-wrap">
          <table className="t">
            <thead>
              <tr>
                <th>Role</th>
                <th>Email</th>
                <th>Password</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Student (Ada)", "ada@scried.test", "scried-demo-2026"],
                ["Staff", "admin@scried.test", "scried-admin-2026"]
              ].map(([role, email, pw]) => (
                <tr key={email}>
                  <td>{role}</td>
                  <td>{email}</td>
                  <td>{pw}</td>
                  <td>
                    <button className="btn btn-forest" style={{ padding: "8px 16px", fontSize: ".9rem" }} onClick={() => signInAs(email, pw)}>
                      Sign in
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="box">
        <h2>Status</h2>
        <p id="status" style={{ color: "var(--muted)" }}>
          {status}
        </p>
        <div className="btns" style={{ marginTop: 18 }}>
          <button
            className="btn btn-gold"
            id="load"
            onClick={async () => {
              await Store.loadDemo();
              flashNow("Demo data loaded.");
            }}
          >
            Load demo data
          </button>
          <button
            className="btn btn-line-dark"
            id="clear"
            onClick={() =>
              setPending({
                text: "This removes all sample students, sample opportunities and their data. Real accounts stay.",
                fn: () => {
                  Store.clearDemo();
                  flash("Demo data removed. Create your staff account to manage Scried.");
                  router.push("/staff/setup");
                }
              })
            }
          >
            Remove demo data
          </button>
          <button
            className="btn btn-line-dark"
            id="reset"
            onClick={() =>
              setPending({
                text: "This erases every account, registration and certificate saved in this browser.",
                fn: () => {
                  Store.resetAll();
                  localStorage.setItem("scried_demo_off", "1");
                  flash("Everything in this browser was erased.");
                  router.push("/");
                }
              })
            }
          >
            Erase everything in this browser
          </button>
        </div>
        <p id="confirm" className="formula" style={{ marginTop: 18 }} hidden={!pending}>
          {pending?.text}{" "}
          <button
            className="btn btn-forest"
            id="yes"
            style={{ padding: "8px 16px", fontSize: ".9rem", marginLeft: 8 }}
            onClick={async () => {
              await pending?.fn();
            }}
          >
            Yes, continue
          </button>
        </p>
      </div>
    </main>
  );
}
