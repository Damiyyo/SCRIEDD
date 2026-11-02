import ApplyPage from "@/components/pages/ApplyPage";
export const metadata = { title: "Apply | Scried" };
export default async function Page({ params }) {
  const { id } = await params;
  return <ApplyPage id={id} />;
}
