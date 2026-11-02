import Link from "next/link";
import { SCRIED_SESSIONS } from "@/data/content";
import { Store } from "@/lib/store";
export default function AboutPage() {
  return (
    <div className="pg-about">
      <header className="page-head">
        <div className="wrap">
          <h1>We build possibilities.</h1>
          <p>Potential is everywhere. Possibility is not. Scried exists to close that gap for every student in Nigeria, and then Africa.</p>
        </div>
      </header>
      <main id="main">
        <section className="section story">
          <div className="wrap">
            <div className="story-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1719408937898-e15b8638e1d8?auto=format&fit=crop&w=1200&q=80"
                alt="A group of graduates posing together"
                loading="lazy"
              />
            </div>
            <div>
              <p className="big">Talent was never the problem. Access was.</p>
              <p>
                A student can be brilliant and never meet the person who needs their talent. A final-year project can be defended, graded and
                forgotten. A scholarship can close before the right student even hears about it.
              </p>
              <p>
                Meanwhile, companies search for young talent they can&apos;t find, and universities want closer ties to the industries their graduates
                are walking into.
              </p>
              <p>Scried is the bridge. We bring opportunities closer to students, and we bring students to the world.</p>
            </div>
          </div>
        </section>
        <section className="section band-forest">
          <div className="wrap">
            <h2>How a possibility happens.</h2>
            <ol className="path">
              <li>
                <h3>Discover</h3>
                <p>Students find verified opportunities and register in one tap.</p>
              </li>
              <li>
                <h3>Develop</h3>
                <p>Practical programs and trainings that build real skills.</p>
              </li>
              <li>
                <h3>Prove</h3>
                <p>Every completion and certificate is checked and added to their record.</p>
              </li>
              <li>
                <h3>Connect</h3>
                <p>Verified records go in front of the companies who need them.</p>
              </li>
              <li>
                <h3>Build</h3>
                <p>The best ideas get the support to become companies of their own.</p>
              </li>
            </ol>
          </div>
        </section>
        <section className="section">
          <div className="wrap">
            <h2>What we believe.</h2>
            <div className="beliefs">
              <div className="belief">
                <h3>Proof beats paper.</h3>
                <p>A degree matters. So does what you&apos;ve built, finished and been certified in. We keep the evidence.</p>
              </div>
              <div className="belief">
                <h3>Activity is not impact.</h3>
                <p>We don&apos;t count attendance. We count the students who applied, finished and got somewhere.</p>
              </div>
              <div className="belief">
                <h3>Every student deserves to know.</h3>
                <p>Opportunities shouldn&apos;t depend on who you know or which group chat you&apos;re in.</p>
              </div>
              <div className="belief">
                <h3>We don&apos;t choose your future.</h3>
                <p>We just make sure there are more of them to choose from.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="section band-gold">
          <div className="wrap">
            <h2>Where we&apos;ve been.</h2>
            <ul className="proof-list" id="proof">
              {SCRIED_SESSIONS.map((s) => (
                <li key={s.id}>
                  <b>{Store.school(s.school).name}</b>
                  <span>{s.unit}</span>
                  <span>{s.title}</span>
                </li>
              ))}
            </ul>
            <Link href="/sessions" className="btn btn-forest" style={{ marginTop: 40 }}>
              See our sessions
            </Link>
          </div>
        </section>
        {/* TEAM: replace names, initials, roles and LinkedIn links */}
        <section className="section">
          <div className="wrap">
            <h2>The people behind it.</h2>
            <div className="team-grid">
              <div>
                <div className="avatar">AB</div>
                <h3>[Full name]</h3>
                <p>Co-founder &amp; CEO</p>
                <a href="#">LinkedIn</a>
              </div>
              <div>
                <div className="avatar">CD</div>
                <h3>[Full name]</h3>
                <p>Co-founder &amp; CTO</p>
                <a href="#">LinkedIn</a>
              </div>
              <div>
                <div className="avatar">EF</div>
                <h3>[Full name]</h3>
                <p>[Role]</p>
                <a href="#">LinkedIn</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
