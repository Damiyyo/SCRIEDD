"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { StoryCard } from "@/components/Cards";
import { SCRIED_POSTS } from "@/data/posts";
import { useDemo, useDocumentTitle, useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { catLabel, esc, fmtDate, initials, visiblePosts } from "@/lib/ui";
export default function StoryPage({ id }) {
  const { ready } = useStore();
  const demo = useDemo();
  const router = useRouter();
  const articleRef = useRef(null);
  const [copy, setCopy] = useState("Copy link");
  const [href, setHref] = useState("");
  const posts = visiblePosts(demo);
  // Real posts are known at build time; sample posts only exist while demo data is on.
  const p = SCRIED_POSTS.find((x) => x.id === id && (!x.sample || demo));
  const signedIn = ready && !!Store.currentUser();
  useDocumentTitle(p ? p.title + " | Scried" : null);
  useEffect(() => {
    setHref(window.location.href);
  }, []);
  useEffect(() => {
    if (ready && p) Store.logActivity("read", p.id);
  }, [ready, p]);
  // Signed-in readers already have an account: point Join boxes at their dashboard instead.
  useEffect(() => {
    const root = articleRef.current;
    if (!root || !signedIn) return;
    root.querySelectorAll(".cta-box a[href='/join']").forEach((a) => {
      a.textContent = "Go to my dashboard";
      a.setAttribute("href", "/dashboard");
      const p2 = a.closest(".cta-box")?.querySelector("p");
      if (p2) p2.textContent = "You're in. Applying for anything on Scried takes one tap from your dashboard.";
    });
  }, [signedIn, p]);
  // The article body is HTML from posts.ts. Make its internal links client-side navigations.
  const onArticleClick = (e) => {
    const a = e.target.closest("a");
    const h = a?.getAttribute("href");
    if (!a || !h || !h.startsWith("/") || h.startsWith("//") || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    e.preventDefault();
    router.push(h);
  };
  if (!p) {
    return (
      <>
        <header className="post-head">
          <div className="wrap">
            <Link href="/stories" className="back">
              ← All stories
            </Link>
            <br />
            <span className="post-cat" id="cat"></span>
            <h1 id="title">{ready ? "We couldn't find that story" : ""}</h1>
            <p className="post-by" id="by"></p>
          </div>
        </header>
        <div className="post-hero" id="hero"></div>
        <main id="main">
          <article className="article" id="article">
            {ready ? (
              <p>
                <Link href="/stories">See all stories</Link>
              </p>
            ) : null}
          </article>
        </main>
      </>
    );
  }
  const alum =
    p.category === "alumni" && p.alumniName
      ? `<div class="alum-card"><div class="av" aria-hidden="true">${esc(initials(p.alumniName))}</div>
    <div><b>${esc(p.alumniName)}</b><span>${esc(p.alumniNow)}${p.alumniSchool ? " · Alumnus of " + esc(p.alumniSchool) : ""}</span></div></div>`
      : "";
  const here = encodeURIComponent(href);
  const t = encodeURIComponent(p.title);
  const rel = posts
    .filter((x) => x.id !== p.id)
    .sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category))
    .slice(0, 2);
  return (
    <>
      <header className="post-head">
        <div className="wrap">
          <Link href="/stories" className="back">
            ← All stories
          </Link>
          <br />
          <span className="post-cat" id="cat">
            {catLabel(p.category)}
          </span>
          <h1 id="title">{p.title}</h1>
          <p className="post-by" id="by">
            By <b>{p.author}</b> · {fmtDate(p.date, { day: "numeric", month: "long", year: "numeric" })} · {p.minutes} min read
          </p>
        </div>
      </header>
      <div className="post-hero" id="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.image ? <img src={p.image} alt={p.imageAlt} /> : null}
      </div>
      <main id="main">
        {/* The article's children must be the post's own elements (the stylesheet spaces them with `.article > * + *`),
            so the author card and the body are injected together, as in the original. Body is written by the Scried team in data/posts.ts. */}
        <article
          className="article"
          id="article"
          ref={articleRef}
          style={p.image ? undefined : { paddingTop: 56 }}
          onClick={onArticleClick}
          dangerouslySetInnerHTML={{ __html: alum + p.body }}
        />
        <div className="share" aria-label="Share this story">
          <span>Share</span>
          <a id="sWa" target="_blank" rel="noopener" href={`https://wa.me/?text=${t}%20${here}`}>
            WhatsApp
          </a>
          <a id="sX" target="_blank" rel="noopener" href={`https://twitter.com/intent/tweet?text=${t}&url=${here}`}>
            X
          </a>
          <a id="sLi" target="_blank" rel="noopener" href={`https://www.linkedin.com/sharing/share-offsite/?url=${here}`}>
            LinkedIn
          </a>
          <button
            type="button"
            id="copyLink"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href).then(
                () => {
                  setCopy("Link copied");
                  setTimeout(() => setCopy("Copy link"), 2000);
                },
                () => setCopy("Couldn't copy")
              );
            }}
          >
            {copy}
          </button>
        </div>
        <section className="related">
          <div className="wrap">
            <h2>Keep reading</h2>
            <div className="story-grid" id="related">
              {rel.map((s) => (
                <StoryCard s={s} key={s.id} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
