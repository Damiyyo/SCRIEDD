"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SCRIED_CONFIG as C } from "@/data/content";
import { useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { FLASH_EVENT, flash } from "@/lib/ui";
/** Which nav item is "current" for a given route (mirrors the `page` option of the original renderChrome). */
function pageKey(pathname) {
  if (pathname === "/") return "home";
  const seg = pathname.split("/")[1];
  switch (seg) {
    case "opportunities":
      return "opportunities";
    case "sessions":
    case "stories":
    case "partner":
    case "about":
    case "privacy":
    case "join":
    case "demo":
      return seg;
    case "signin":
    case "forgot":
      return "signin";
    case "dashboard":
    case "certificates":
    case "profile":
    case "record":
    case "complete":
      return "dashboard";
    case "staff":
      return "staff";
    default:
      return "";
  }
}
// join / signin / forgot are full-screen split layouts without the site footer (data-nofooter in the original)
const NO_FOOTER = new Set(["join", "signin", "forgot"]);
function takeFlash() {
  const raw = sessionStorage.getItem("scried_flash");
  if (!raw) return null;
  sessionStorage.removeItem("scried_flash");
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function FlashBox() {
  const pathname = usePathname();
  const [msg, setMsg] = useState(null);
  const last = useRef(null);
  // A flash set before navigating shows on the next page, then goes away on the one after.
  useEffect(() => {
    const m = takeFlash();
    if (m) setMsg(m);
    else if (last.current !== null && last.current !== pathname) setMsg(null);
    last.current = pathname;
  }, [pathname]);
  // Flash messages for the page you're already on (errors, in-place updates).
  useEffect(() => {
    const on = () => {
      const m = takeFlash();
      if (m) setMsg(m);
    };
    window.addEventListener(FLASH_EVENT, on);
    return () => window.removeEventListener(FLASH_EVENT, on);
  }, []);
  if (!msg) return null;
  return (
    <div className="flash" role="status">
      <p className={msg.kind}>{msg.text}</p>
    </div>
  );
}
export default function Chrome({ children }) {
  const { ready } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const page = pageKey(pathname);
  const u = ready ? Store.currentUser() : null;
  const cur = (p) => (p === page ? "page" : undefined);
  useEffect(() => setOpen(false), [pathname]);
  const signOut = () => {
    Store.signOut();
    flash("You're signed out.");
    router.push("/");
  };
  let account;
  if (u && u.isStaff) {
    account = (
      <>
        <li>
          <Link href="/staff" aria-current={cur("staff")}>
            Staff
          </Link>
        </li>
        <li>
          <button className="linkish" onClick={signOut}>
            Sign out
          </button>
        </li>
      </>
    );
  } else if (u) {
    const s = Store.streak(u.id);
    account = (
      <>
        <li>
          <Link href="/dashboard" className="nav-user" aria-current={cur("dashboard")}>
            <span className={"flame-pill " + (s ? "" : "off")} title="Your streak">
              🔥 {s}
            </span>{" "}
            My dashboard
          </Link>
        </li>
        <li>
          <button className="linkish" onClick={signOut}>
            Sign out
          </button>
        </li>
      </>
    );
  } else {
    account = (
      <li>
        <Link href="/signin" className="nav-signin" aria-current={cur("signin")}>
          Sign in
        </Link>
      </li>
    );
  }
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <nav className="nav solid" aria-label="Main">
        <div className="wrap">
          <Link href="/" className="logo" aria-label="Scried home">
            scried<i>.</i>
          </Link>
          <button className="menu-btn" aria-expanded={open} aria-controls="nav-links" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <ul className={"nav-links" + (open ? " open" : "")} id="nav-links">
            <li>
              <Link href="/opportunities" aria-current={cur("opportunities")}>
                Opportunities
              </Link>
            </li>
            <li>
              <Link href="/sessions" aria-current={cur("sessions")}>
                Our sessions
              </Link>
            </li>
            <li>
              <Link href="/stories" aria-current={cur("stories")}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/partner" aria-current={cur("partner")}>
                Partner with us
              </Link>
            </li>
            {account}
          </ul>
        </div>
      </nav>
      {u && u.isStaff && (
        <div className="staff-bar">
          <div className="wrap">
            <Link href="/staff">Overview</Link>
            <Link href="/staff/schools">School ranking</Link>
            <Link href="/staff/verify">Verify certificates</Link>
            <Link href="/staff/opportunity-edit">Add an opportunity</Link>
          </div>
        </div>
      )}
      <FlashBox />
      {children}
      {!NO_FOOTER.has(pathname.split("/")[1]) && (
        <footer>
          <div className="wrap">
            <div className="foot-top">
              <div>
                <Link href="/" className="logo">
                  scried<i>.</i>
                </Link>
                <p>Something is possible here.</p>
              </div>
              <div>
                <h4>Explore</h4>
                <ul>
                  <li>
                    <Link href="/opportunities">Opportunities</Link>
                  </li>
                  <li>
                    <Link href="/sessions">Our sessions</Link>
                  </li>
                  <li>
                    <Link href="/stories">Blog</Link>
                  </li>
                  <li>
                    <Link href="/partner">Partner with us</Link>
                  </li>
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4>Talk to us</h4>
                <ul>
                  <li>
                    <a href={`mailto:${C.email}`}>{C.email}</a>
                  </li>
                  <li>
                    <a href={`https://wa.me/${C.whatsapp}`} target="_blank" rel="noopener">
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <Link href="/privacy">Privacy</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="foot-bottom">
              <span>© {new Date().getFullYear()} Scried. Made in Nigeria.</span>
              <span>
                Photos from <a href="https://unsplash.com">Unsplash</a>.
                {ready && Store.demo && (
                  <>
                    {" · "}
                    <Link href="/demo">Demo data is on</Link>
                  </>
                )}
              </span>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
