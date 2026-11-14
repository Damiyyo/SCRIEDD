"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/pages/ResetPasswordForm";

function ResetPasswordContent() {
  const params = useSearchParams();
  return <main id="main" className="auth"><aside className="auth-side"><div><h1>Back to your account.</h1><p>Set a new password and continue where you left off.</p></div></aside><ResetPasswordForm initialToken={params.get("token") || params.get("reset_token") || ""} /></main>;
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="auth"><section className="auth-main"><p>Loading secure reset form...</p></section></main>}><ResetPasswordContent /></Suspense>;
}
