import RegisteredPage from "@/components/pages/RegisteredPage";
export const metadata = { title: "You're registered | Scried" };
export default async function Page({ params }) {
  const { id } = await params;
  return <RegisteredPage id={id} />;
}
