import OpportunitiesPage from "@/components/pages/OpportunitiesPage";
export const metadata = {
  title: "Opportunities for Nigerian students | Scried",
  description: "Scholarships, jobs, internships, fellowships, competitions, grants and free tools for Nigerian students. Scried clearly marks listings that have not been verified."
};
export default async function Page({ searchParams }) {
  const { type = "", q = "", onboarding = "" } = await searchParams;
  return <OpportunitiesPage type={type} q={q} onboarding={onboarding === "1"} />;
}
