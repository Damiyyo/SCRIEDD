import OpportunityPage from "@/components/pages/OpportunityPage";
export const metadata = { title: "Opportunity | Scried" };
export default async function Page({ params }) {
  const { id } = await params;
  return <OpportunityPage id={id} />;
}
