"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OppRow, Testimonial } from "@/components/Cards";
import { SCRIED_SESSIONS } from "@/data/content";
import { SCRIED_POSTS } from "@/data/posts";
import { useDemo, useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { visibleTestimonials } from "@/lib/ui";
const SLIDES = [
  { tag: "CEO", src: "https://images.unsplash.com/photo-1706901775513-55c4ce19dfab?auto=format&fit=crop&w=2000&q=80" },
  { tag: "founder", src: "https://images.unsplash.com/photo-1615891081220-9116de3e1afd?auto=format&fit=crop&w=2000&q=80" },
  { tag: "engineer", src: "https://images.unsplash.com/photo-1620829813573-7c9e1877706f?auto=format&fit=crop&w=2000&q=80" },
  { tag: "creative director", src: "https://images.unsplash.com/photo-1620829813795-9855fe1ff0e3?auto=format&fit=crop&w=2000&q=80" },
  { tag: "leaders", src: "https://images.unsplash.com/photo-1719408937898-e15b8638e1d8?auto=format&fit=crop&w=2000&q=80" }
];
const MARQUEE = ["a scholarship", "a mentor", "an internship", "a first job", "a certificate", "a co-founder", "a company"];
function Hero({ secondHref, secondLabel }) {
  const [cur, setCur] = useState(0);
  // Advance every 6s; restarts whenever a dot is clicked (cur changes), unless the visitor prefers reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setCur((c) => (c + 1) % SLIDES.length), 6000);
    return () => clearTimeout(t);
  }, [cur]);
  return (
    <header className="hero">
      <div className="slides" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <div className={"slide" + (i === cur ? " on" : "")} data-tag={s.tag} key={s.tag}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt="" loading={i === 0 ? undefined : "lazy"} />
          </div>
        ))}
      </div>
      <div className="wrap">
        <h1>Something is possible here.</h1>
        <p className="hero-sub">For every Nigerian student with more talent than opportunity.</p>
        <div className="btns">
          <Link href="/opportunities" className="btn btn-gold">
            Find opportunities
          </Link>
          <Link href={secondHref} className="btn btn-line" id="heroSecond">
            {secondLabel}
          </Link>
        </div>
      </div>
      <div className="future">
        <div className="future-tag" aria-live="polite">
          <b>Future</b> <span id="futureTag">{SLIDES[cur].tag}</span>
        </div>
        <div className="dots" id="dots">
          {SLIDES.map((s, i) => (
            <button key={s.tag} aria-label={"Show photo " + (i + 1)} aria-current={i === cur ? "true" : "false"} onClick={() => setCur(i)} />
          ))}
        </div>
      </div>
    </header>
  );
}
export default function HomePage() {
  const { ready } = useStore();
  const demo = useDemo();
  const u = ready ? Store.currentUser() : null;
  const mine = new Set(ready ? Store.myApps().map((a) => a.opp) : []);
  const opps = ready ? Store.listOpps().slice(0, 4) : [];
  const voices = visibleTestimonials(demo).filter((t) => t.featured);
  const alumni = SCRIED_POSTS.filter((p) => !p.sample || demo)
    .filter((p) => p.category === "alumni")
    .slice(0, 3);
  // Already have an account: the hero and close sections invite them in, not to join.
  const joinHref = u ? (u.isStaff ? "/staff" : "/dashboard") : "/join";
  const joinHero = u ? (u.isStaff ? "Staff overview" : "My dashboard") : "Join Scried free";
  const joinClose = u ? (u.isStaff ? "Staff overview" : "Go to my dashboard") : "Join as a student";
  const cards = voices.map((t, i) => <Testimonial t={t} key={i} />);
  return (
    <div className="pg-home">
      <Hero secondHref={joinHref} secondLabel={joinHero} />

      <main id="main">
        <section className="manifesto">
          <div className="wrap">
            <p className="big">
              Somewhere on a Nigerian campus right now, a student is sitting on the idea that changes everything.{" "}
              <span>Nobody has met them yet.</span>
            </p>
          </div>
        </section>

        <section className="promises" aria-label="What Scried does">
          <div className="promise">
            <div>
              <div className="promise-arrow" aria-hidden="true">
                ↓
              </div>
              <h2>Opportunities, brought to you.</h2>
              <p>Scholarships, internships, fellowships, competitions, grants and free tools. Verified, in one place, before the deadline passes.</p>
            </div>
            <Link href="/opportunities">Browse opportunities</Link>
          </div>
          <div className="promise">
            <div>
              <div className="promise-arrow" aria-hidden="true">
                ↑
              </div>
              <h2>You, brought to the world.</h2>
              <p>
                Every opportunity you finish builds a verified record of what you can do, ready for the companies, mentors and investors who need you.
              </p>
            </div>
            <Link href="/partner">Work with our talent</Link>
          </div>
        </section>

        {opps.length > 0 && (
          <section className="section" id="oppSection">
            <div className="wrap">
              <div className="opp-head">
                <div>
                  <h2>Open right now</h2>
                  <p className="lead">Closing soonest first. Don&apos;t let another one pass you by.</p>
                </div>
                <Link href="/opportunities" className="btn btn-forest">
                  See all opportunities
                </Link>
              </div>
              <ul className="opp-list" id="opps">
                {opps.map((o) => (
                  <OppRow o={o} mine={mine} key={o.id} />
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="walk" aria-label="What students leave with">
          <div className="wrap">
            <p className="walk-lead">Walk in with potential. Walk out with</p>
          </div>
          <div className="marquee" aria-hidden="true">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </section>

        {voices.length > 0 && (
          <section className="section" id="voiceSection">
            <div className="wrap">
              <div className="opp-head">
                <div>
                  <h2>In their own words</h2>
                  <p className="lead">Students who&apos;ve been through our sessions.</p>
                </div>
                <Link href="/sessions" className="btn btn-line-dark">
                  See all sessions
                </Link>
              </div>
              <div className="tstrip">
                <div className="marquee" id="voices">
                  {cards}
                  {/* duplicated for a seamless scroll loop */}
                  <div style={{ display: "contents" }} aria-hidden="true">
                    {voices.map((t, i) => (
                      <Testimonial t={t} key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="lecture">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1655720348590-c739c860beed?auto=format&fit=crop&w=2000&q=80"
            alt="Young people working together on laptops"
            loading="lazy"
          />
          <div className="wrap">
            <h2>The future of Africa is sitting in a lecture hall.</h2>
            <p>We&apos;re building the bridge between that hall and everything waiting on the other side.</p>
          </div>
        </section>

        <section className="section dreams">
          <div className="wrap">
            <h2>A world where talent always finds its way.</h2>

            <div className="dream">
              <div className="dream-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1689255170246-9073b4818667?auto=format&fit=crop&w=1000&q=80"
                  alt="A young woman in a graduation cap and gown"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="who">For students</p>
                <h3>Be seen for what you can do.</h3>
                <p>Not your connections. Not your surname. What you&apos;ve built, what you&apos;ve made and who you&apos;re becoming.</p>
              </div>
            </div>

            <div className="dream">
              <div className="dream-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1604933762021-54a5858c9832?auto=format&fit=crop&w=1000&q=80"
                  alt="A young woman with braids working at a laptop"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="who">For companies</p>
                <h3>Meet tomorrow&apos;s best people today.</h3>
                <p>The engineers, creatives and leaders you&apos;ll compete for in five years are on campus right now. Get there first.</p>
              </div>
            </div>

            <div className="dream">
              <div className="dream-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1642929456654-f4540e3e2a85?auto=format&fit=crop&w=1000&q=80"
                  alt="A young woman working at a table with a laptop"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="who">For universities</p>
                <h3>Become the place where futures start.</h3>
                <p>Every final-year project deserves a life after graduation. Every graduate deserves a door already open.</p>
              </div>
            </div>
          </div>
        </section>

        {alumni.length > 0 && (
          <section className="section" id="alumniSection">
            <div className="wrap">
              <div className="opp-head">
                <div>
                  <h2>Alumni doing big things</h2>
                  <p className="lead">Graduates of Nigerian campuses, making their mark around the world.</p>
                </div>
                <Link href="/stories?c=alumni" className="btn btn-line-dark">
                  More alumni stories
                </Link>
              </div>
              <div className="alumni" id="alumni">
                {alumni.map((p) => (
                  <Link className="alum" href={"/stories/" + encodeURIComponent(p.id)} key={p.id}>
                    <div className="story-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.image ? <img src={p.image} alt={p.imageAlt} loading="lazy" /> : null}
                    </div>
                    <p className="now">{p.alumniNow}</p>
                    <h3>{p.alumniName || p.title}</h3>
                    {p.alumniSchool ? <p className="from">Alumnus of {p.alumniSchool}</p> : null}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GALLERY: replace with real photos from your sessions. Put files in public/images and swap the URLs. */}
        <section className="section gallery-band">
          <div className="wrap">
            <div className="opp-head">
              <div>
                <h2>It looks like this.</h2>
                <p className="lead">Campuses, sessions and the students who show up. This could be your school next.</p>
              </div>
              <Link href="/sessions" className="btn btn-line-dark">
                See our sessions
              </Link>
            </div>
            <div className="gb-grid">
              {[
                [
                  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=75",
                  "Students working together around a table"
                ],
                ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=75", "Two students pairing on a laptop"],
                [
                  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=75",
                  "Graduates in gowns on graduation day"
                ],
                [
                  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=75",
                  "A session in a university lecture room"
                ]
              ].map(([src, alt]) => (
                <Link href="/sessions" key={src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} loading="lazy" />
                </Link>
              ))}
            </div>
            <div className="gb-row2">
              {[
                ["https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=75", "A university lecture hall"],
                ["https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1600&q=75", "A speaker leading a workshop"]
              ].map(([src, alt]) => (
                <Link href="/sessions" key={src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section band-forest proof">
          <div className="wrap">
            <div>
              <h2>It&apos;s already happening.</h2>
              <p className="lead">Campuses that have opened their doors with us.</p>
              <Link href="/sessions" className="btn btn-gold" style={{ marginTop: 32 }}>
                See our sessions
              </Link>
            </div>
            <ul className="schools" id="schools">
              {SCRIED_SESSIONS.map((s) => (
                <li key={s.id}>
                  <b>{Store.school(s.school).name}</b>
                  <span>{s.field}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section close">
          <div className="wrap">
            <h2>Build what&apos;s possible with us.</h2>
            <p className="lead">Universities, companies, students, dreamers: there&apos;s a place for you here.</p>
            <div className="btns">
              <Link href={joinHref} className="btn btn-forest" id="closeJoin">
                {joinClose}
              </Link>
              <Link href="/partner" className="btn btn-line-dark">
                Partner with us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
