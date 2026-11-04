"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const campaigns = [
  {
    id: "gemini",
    eyebrow: "Student opportunity",
    title: "Learn with Gemini",
    description: "Explore Google Gemini for students and discover tools to help you learn, create, and prepare for what comes next.",
    href: "https://gemini.google/students/?utm_source=Uber&utm_medium=paid_media&utm_campaign=students_shortlink_social-uk",
    cta: "Explore Gemini for students",
  },
  {
    id: "idice",
    eyebrow: "iDICE Skills to Job — South East Program",
    title: "Your future starts here. Register now.",
    description: "A sponsored skills-to-job opportunity supported by the African Development Bank and Bank of Industry.",
    href: "https://www.activityinfo.org/c/cif8rkemseissxrud/946930",
    cta: "Register for iDICE",
  },
];

export default function CampaignsPage() {
  const [visited, setVisited] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("scried.campaignsVisited") || "[]");
      setVisited(Array.isArray(saved) ? saved : []);
    } catch {
      setVisited([]);
    }
  }, []);

  function markVisited(id) {
    setVisited((current) => {
      const next = current.includes(id) ? current : [...current, id];
      sessionStorage.setItem("scried.campaignsVisited", JSON.stringify(next));
      return next;
    });
  }

  return (
    <main className="campaigns-page">
      <section className="campaigns-intro" aria-labelledby="campaigns-title">
        <p className="eyebrow">Your next step</p>
        <h1 id="campaigns-title">Choose an opportunity to explore.</h1>
        <p>We found two opportunities for you. Open either one, come back when you&apos;re ready, and continue to your Scried dashboard.</p>
      </section>

      <section className="campaign-grid" aria-label="Available opportunities">
        {campaigns.map((campaign) => (
          <article className={`campaign-card campaign-${campaign.id}`} key={campaign.id}>
            <div className="campaign-number" aria-hidden="true">{campaign.id === "gemini" ? "01" : "02"}</div>
            <p className="eyebrow">{campaign.eyebrow}</p>
            <h2>{campaign.title}</h2>
            <p>{campaign.description}</p>
            {campaign.id === "idice" && (
              <ul className="campaign-benefits">
                <li>Sponsored by African Development Bank and Bank of Industry.</li>
                <li>Well-equipped training hubs for students.</li>
                <li>Part-time and full-time opportunities for participants.</li>
                <li>Stipends may apply; terms and conditions apply.</li>
                <li>International linkage with world tech giants.</li>
              </ul>
            )}
            <a className="campaign-link" href={campaign.href} target="_blank" rel="noreferrer" onClick={() => markVisited(campaign.id)}>
              {campaign.cta}<span aria-hidden="true">↗</span>
            </a>
            {visited.includes(campaign.id) && <p className="campaign-visited" role="status">Opened. You can return to explore the other opportunity.</p>}
          </article>
        ))}
      </section>

      <div className="campaigns-footer">
        <p>Registration deadline: <strong>5 November 2026</strong> for the iDICE opportunity.</p>
        <Link className={`btn btn-forest campaigns-continue${visited.length === 0 ? " is-disabled" : ""}`} aria-disabled={visited.length === 0} href={visited.length === 0 ? "#campaigns-title" : "/dashboard"} onClick={(event) => { if (visited.length === 0) event.preventDefault(); }}>
          Continue to dashboard
        </Link>
      </div>
    </main>
  );
}
