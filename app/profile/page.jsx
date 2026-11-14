import ProfilePage from "@/components/pages/ProfilePage";
export const metadata = { title: "My profile | Scried" };
export default async function Page({ searchParams }) {
  const { onboarding = "" } = await searchParams;
  return <ProfilePage onboarding={onboarding === "1"} />;
}
