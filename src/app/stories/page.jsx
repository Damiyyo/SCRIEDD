import StoriesPage from "@/components/pages/StoriesPage";
export const metadata = {
  title: "Stories | Scried",
  description: "Guides, session recaps, alumni spotlights and student stories from Scried."
};
export default async function Page({ searchParams }) {
  const { c = "" } = await searchParams;
  return <StoriesPage initialCategory={c} />;
}
