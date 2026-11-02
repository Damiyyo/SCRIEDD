import SigninPage from "@/components/pages/SigninPage";
export const metadata = { title: "Sign in | Scried" };
export default async function Page({ searchParams }) {
  const { next = "" } = await searchParams;
  return <SigninPage next={next} />;
}
