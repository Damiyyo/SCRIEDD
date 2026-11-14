"use client";
import { useEffect, useState } from "react";

/**
 * Opening animation: a blank page with "scried." in the middle that breathes in for 3.5s,
 * then fades away into the site. It lives in the root layout, so it plays once each time the
 * site is opened or refreshed, not on every page change.
 */
export const SPLASH_MS = 900;
const FADE_MS = 350;

export default function Splash() {
  const [phase, setPhase] = useState("in"); // in -> out -> gone

  useEffect(() => {
    document.documentElement.classList.add("splashing");
    const t1 = setTimeout(() => setPhase("out"), SPLASH_MS);
    const t2 = setTimeout(() => {
      setPhase("gone");
      document.documentElement.classList.remove("splashing");
    }, SPLASH_MS + FADE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.classList.remove("splashing");
    };
  }, []);

  if (phase === "gone") return null;
  return (
    <div className={"splash" + (phase === "out" ? " out" : "")} role="status" aria-label="Scried is loading">
      <span className="splash-logo" aria-hidden="true">
        scried<i>.</i>
      </span>
    </div>
  );
}
