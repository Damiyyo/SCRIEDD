import StaffOpportunityEditPage from "@/components/pages/StaffOpportunityEditPage";
export const metadata = { title: "Edit opportunity | Scried" };
export default async function Page({ params }) {
  const { id } = await params;
  return <StaffOpportunityEditPage id={id} />;
}
