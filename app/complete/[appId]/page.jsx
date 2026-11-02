import CompletePage from "@/components/pages/CompletePage";
export const metadata = { title: "Mark complete | Scried" };
export default async function Page({ params }) {
  const { appId } = await params;
  return <CompletePage appId={appId} />;
}
