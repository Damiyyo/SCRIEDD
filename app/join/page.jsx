import JoinPage from "@/components/pages/JoinPage";
export const metadata = { title: "Join Scried" };
export default async function Page({ searchParams }) {
  const { next = "", email = "" } = await searchParams;
  return <JoinPage next={next} email={email} />;
}
