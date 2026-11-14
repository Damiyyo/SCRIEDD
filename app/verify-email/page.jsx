"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VerifyEmailPage from "@/components/pages/VerifyEmailPage";

function VerifyEmailContent() {
  const params = useSearchParams();
  return <VerifyEmailPage token={params.get("token") || params.get("verification_token") || ""} />;
}

export default function VerifyEmailRoute() {
  return <Suspense fallback={<main className="auth"><section className="auth-main"><p>Loading verification...</p></section></main>}><VerifyEmailContent /></Suspense>;
}
