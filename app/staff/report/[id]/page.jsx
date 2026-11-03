import StaffReportPage from "@/components/pages/StaffReportPage";
export const metadata = { title: "Impact report | Scried" };
export default async function Page({ params }) {
  const { id } = await params;
  return <StaffReportPage id={id} />;
}
