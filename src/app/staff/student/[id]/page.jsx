import StaffStudentPage from "@/components/pages/StaffStudentPage";
export const metadata = { title: "Student record | Scried" };
export default async function Page({ params }) {
  const { id } = await params;
  return <StaffStudentPage id={id} />;
}
