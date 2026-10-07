"use client";
import Link from "next/link";
import { useState } from "react";
import { StoryCard } from "@/components/Cards";
import { SCRIED_CONFIG } from "@/data/content";
import { useDemo } from "@/lib/hooks";
import { CATS, catLabel, fmtDate, visiblePosts } from "@/lib/ui";
export default function StoriesPage({ initialCategory = "" }) {
  const demo = useDemo();
  const posts = visiblePosts(demo);
  const [cat, setCat] = useState(initialCategory);
  const used = new Set(posts.map((p) => p.category));
  const cats = [["", "All"], ...CATS.filter(([k]) => used.has(k))];
  const f = posts[0];
  const list = cat ? posts.filter((p) => p.category === cat) : posts.slice(1);
  const choose = (k) => {
    setCat(k);
    window.history.replaceState(null, "", "/stories" + (k ? "?c=" + k : ""));
  };
  return (
    <div className="pg-stories">
      <header className="page-head">
        <div className="wrap">
          <h1>Stories.</h1>
          <p>Guides to the opportunities that matter, what happens at our sessions, and alumni making their mark around the world.</p>
        </div>
      </header>
      <main id="main">
        <div className="wrap">
          <div id="featured">
            {!cat && f ? (
              <Link className="featured" href={"/stories/" + encodeURIComponent(f.id)}>
                <div className="story-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {f.image ? <img src={f.image} alt={f.imageAlt} /> : null}
                </div>
                <div>
                  <p className="story-meta">
                    <b>{catLabel(f.category)}</b> · {fmtDate(f.date, { day: "numeric", month: "long", year: "numeric" })} · {f.minutes} min read
                  </p>
                  <h2>{f.title}</h2>
                  <p className="story-ex">{f.excerpt}</p>
                  <span className="read">Read the story</span>
                </div>
              </Link>
            ) : null}
          </div>
          <nav className="chipbar" id="chips" style={{ padding: "40px 0 20px" }} aria-label="Filter by category">
            {cats.map(([k, l]) => (
              <a
                href="#"
                key={k}
                aria-current={cat === k ? "true" : "false"}
                onClick={(e) => {
                  e.preventDefault();
                  choose(k);
                }}
              >
                {l}
              </a>
            ))}
          </nav>
          <div className="story-grid" id="grid" style={{ marginTop: 20 }}>
            {list.map((s) => (
              <StoryCard s={s} key={s.id} />
            ))}
          </div>
          <p id="empty" style={{ color: "var(--muted)", padding: "20px 0 40px" }} hidden={list.length > 0}>
            No stories in this category yet. Check back soon.
          </p>
        </div>
        <section className="section band-forest" style={{ marginTop: 110 }}>
          <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            <div>
              <h2>Know an alumnus doing big things?</h2>
              <p className="lead">We celebrate graduates of Nigerian campuses making their mark anywhere in the world. Tell us about them.</p>
            </div>
            <a
              id="nominate"
              className="btn btn-gold"
              target="_blank"
              rel="noopener"
              href={`https://wa.me/${SCRIED_CONFIG.whatsapp}?text=${encodeURIComponent("Hi Scried, I want to nominate an alumnus for a spotlight:")}`}
            >
              Nominate someone
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
