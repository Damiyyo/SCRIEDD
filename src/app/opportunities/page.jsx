import OpportunitiesPage from "@/components/pages/OpportunitiesPage";
export const metadata = {
  title: "Opportunities for Nigerian students | Scried",
  description: "Verified scholarships, internships, fellowships, competitions, grants and free tools for Nigerian students."
};
export default async function Page({ searchParams }) {
  const { type = "", q = "" } = await searchParams;
  return <OpportunitiesPage type={type} q={q} />;
}
