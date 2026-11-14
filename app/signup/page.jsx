import JoinPage from "@/components/pages/JoinPage";

export const metadata = { title: "Sign up for Scried" };

export default async function Page({ searchParams }) {
  const { next = "", email = "" } = await searchParams;
  return <JoinPage next={next} email={email} />;
}
