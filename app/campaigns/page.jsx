"use client";

import Link from "next/link";
import { first } from "@/lib/ui";
import { useAuth } from "@/lib/auth-context";

export default function CampaignsPage() {
  const { user } = useAuth();
  const name = first(user?.full_name || user?.fullName || "there");

  return (
    <main id="main" className="campaigns-page welcome-page">
      <section className="welcome-modal" aria-labelledby="campaigns-title" role="dialog" aria-modal="true">
        <p className="eyebrow">Your next step</p>
        <h1 id="campaigns-title">Welcome to Scried, {name}.</h1>
        <p>A place where something is possible. Your account is ready. Add your school and education details to get started.</p>
        <Link className="btn btn-forest" href="/profile?onboarding=1">Next</Link>
      </section>
    </main>
  );
}
