import Link from "next/link";
import { Store } from "@/lib/store";
import { assetUrl, catLabel, initials, youtubeId } from "@/lib/ui";
/** One opportunity in a list (home + opportunities pages). */
export function OppRow({ o, mine }) {
  const href = "/opportunities/" + encodeURIComponent(o.id);
  return (
    <li className="opp">
      <div className="opp-main">
        <div className="opp-type">{Store.typeLabel(o.type)}</div>
        <div>
          <h3>
            <Link href={href} style={{ textDecoration: "none" }}>
              {o.title}
            </Link>
          </h3>
          <p className="opp-org">
            {o.org}
            {o.verified && (
              <>
                {" · "}
                <span className="ver">✓ Verified by Scried</span>
              </>
            )}
            {mine.has(o.id) && (
              <>
                {" · "}
                <span className="ver">You&apos;re registered</span>
              </>
            )}
          </p>
        </div>
        <div className="opp-side">
          <span className={"due" + (Store.closingSoon(o) ? " soon" : "")}>{Store.dueLabel(o)}</span>
          <Link href={href} className="btn btn-forest" style={{ padding: "10px 18px", fontSize: ".92rem" }}>
            View
          </Link>
        </div>
      </div>
    </li>
  );
}
/** A participant's words: video, X / LinkedIn post, or plain quote. */
export function Testimonial({ t }) {
  const yt = youtubeId(t.url);
  const hasMedia = !!(yt || t.video);
  return (
    <article className={"voice" + (hasMedia ? "" : " text-only")}>
      {yt ? (
        <div className="media">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${yt}`}
            title={`${t.name} on Scried`}
            loading="lazy"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : t.video ? (
        <div className="media">
          <video src={assetUrl(t.video)} controls preload="metadata" />
        </div>
      ) : null}
      <div className="body">
        {t.quote && <blockquote>“{t.quote}”</blockquote>}
        <div className="who">
          <div className="av" aria-hidden="true">
            {initials(t.name)}
          </div>
          <div>
            <b>{t.name}</b>
            <span>{t.role}</span>
          </div>
        </div>
        {t.url && t.kind !== "video" && (
          <a className="src" href={t.url} target="_blank" rel="noopener">
            View the original post on {t.kind === "x" ? "X" : t.kind === "linkedin" ? "LinkedIn" : "the original platform"}
          </a>
        )}
      </div>
    </article>
  );
}
/** A story / blog card. */
export function StoryCard({ s }) {
  return (
    <Link className="story-card" href={"/stories/" + encodeURIComponent(s.id)}>
      <div className="story-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {s.image ? <img src={s.image} alt={s.imageAlt} loading="lazy" /> : null}
      </div>
      <p className="story-meta">
        <b>{catLabel(s.category)}</b> · {s.minutes} min read
      </p>
      <h3>{s.title}</h3>
      {s.category === "alumni" && s.alumniNow ? (
        <p className="story-meta" style={{ color: "var(--forest)", fontWeight: 600 }}>
          {s.alumniNow}
        </p>
      ) : null}
      <p className="story-ex">{s.excerpt}</p>
    </Link>
  );
}
/** Horizontal bars used on the impact report. */
export function Bars({ rows, tone = "" }) {
  if (!rows.length) return <p style={{ color: "var(--muted)" }}>No data yet.</p>;
  return (
    <div className="bars">
      {rows.map((r) => (
        <div className="bar-row" key={r.label}>
          <span className="lab" title={r.label}>
            {r.label}
          </span>
          <span className="num">{r.n}</span>
          <div className="track-bar">
            <i className={tone} style={{ width: r.pct + "%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
