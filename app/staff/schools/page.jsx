import StaffSchoolsPage from "@/components/pages/StaffSchoolsPage";
export const metadata = { title: "School ranking | Scried" };
export default async function Page({ searchParams }) {
  const { type = "" } = await searchParams;
  return <StaffSchoolsPage initialType={type} />;
}
