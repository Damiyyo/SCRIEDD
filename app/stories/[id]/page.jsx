import StoryPage from "@/components/pages/StoryPage";
import { SCRIED_POSTS } from "@/data/posts";
export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = SCRIED_POSTS.find((x) => x.id === id);
  return { title: p ? p.title + " | Scried" : "Story | Scried" };
}
export default async function Page({ params }) {
  const { id } = await params;
  return <StoryPage id={id} />;
}
