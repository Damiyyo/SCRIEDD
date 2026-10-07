"use client";
import Link from "next/link";
import { Testimonial } from "@/components/Cards";
import { SCRIED_SESSIONS as S } from "@/data/content";
import { useDemo } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { assetUrl, visibleTestimonials } from "@/lib/ui";
const Tally = ({ x, one, many }) => (
  <div>
    <b>{x}</b>
    <span>{x === 1 ? one : many}</span>
  </div>
);
export default function SessionsPage() {
  const demo = useDemo();
  const voices = visibleTestimonials(demo);
  const counted = S.filter((s) => typeof s.participants === "number");
  return (
    <div className="pg-sessions">
      <header className="page-head">
        <div className="wrap">
          <h1>Sessions so far.</h1>
          <p>Every program we run happens on a real campus, with real students, alongside the departments that know them best.</p>
          <div className="tally" id="tally">
            <Tally x={S.length} one="session delivered" many="sessions delivered" />
            <Tally x={new Set(S.map((s) => s.school)).size} one="university" many="universities" />
            <Tally x={new Set(S.map((s) => s.field)).size} one="field" many="fields" />
            {S.length && counted.length === S.length ? (
              <Tally x={counted.reduce((a, s) => a + s.participants, 0)} one="student trained" many="students trained" />
            ) : null}
          </div>
        </div>
      </header>
      <main id="main">
        <div className="wrap">
          <nav className="jump" id="jump" aria-label="Jump to a session">
            {S.map((s) => (
              <a href={"#" + s.id} key={s.id}>
                {Store.school(s.school).short}: {s.field}
              </a>
            ))}
          </nav>
          <div id="sessions">
            {S.map((s) => {
              const sch = Store.school(s.school);
              const facts = [s.date, s.duration, s.participants ? s.participants + " students" : ""].filter(Boolean);
              const tv = voices.filter((t) => t.session === s.id);
              return (
                <SessionBlock key={s.id}>
                  <article className="session" id={s.id}>
                    <div className="gallery">
                      {s.photos.length ? (
                        s.photos.slice(0, 5).map((p, i) => (
                          <a href={assetUrl(p)} target="_blank" rel="noopener" key={p}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={assetUrl(p)} alt={`${s.title} at ${sch.name}, photo ${i + 1}`} loading="lazy" />
                          </a>
                        ))
                      ) : (
                        <div className="mono" aria-hidden="true">
                          <b>{sch.short}</b>
                          <span>{s.field}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="s-school">{sch.name}</p>
                      <p className="s-unit">{s.unit}</p>
                      <h2>{s.title}</h2>
                      {facts.length ? (
                        <div className="facts">
                          {facts.map((f) => (
                            <span key={f}>{f}</span>
                          ))}
                        </div>
                      ) : null}
                      <p className="s-summary">{s.summary}</p>
                      {s.highlights.length ? (
                        <ul className="s-high">
                          {s.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </article>
                  {tv.length ? (
                    <div className="voices" style={{ padding: "0 0 80px", borderBottom: "1px solid var(--line)" }}>
                      {tv.map((t, i) => (
                        <Testimonial t={t} key={i} />
                      ))}
                    </div>
                  ) : null}
                </SessionBlock>
              );
            })}
          </div>
        </div>
        <section className="section band-gold next">
          <div className="wrap">
            <h2>Want a session on your campus?</h2>
            <p className="lead" style={{ color: "var(--forest)" }}>
              We design each program with your department or centre, at no cost to the institution.
            </p>
            <div className="btns">
              <Link href="/partner#talk" className="btn btn-forest">
                Bring Scried to your school
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
// A session and its testimonials are siblings inside #sessions (the stylesheet's :nth-child(even) relies on that),
// so this is just a fragment.
function SessionBlock({ children }) {
  return <>{children}</>;
}
