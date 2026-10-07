"use client";
import { useState } from "react";
import { Field, useFormErrors } from "@/components/Forms";
import { useStore } from "@/lib/hooks";
import { Store } from "@/lib/store";
import { flashNow, formData } from "@/lib/ui";
function EnquiryForm({ kind }) {
  const opp = kind === "opportunity";
  const prefix = opp ? "o-" : "p-";
  const { errors, setErrors, formRef } = useFormErrors();
  // changing the key resets the (uncontrolled) inputs after a successful send, like the original page reload did
  const [round, setRound] = useState(0);
  return (
    <form
      className="form"
      data-kind={kind}
      noValidate
      ref={formRef}
      key={round}
      onSubmit={(e) => {
        e.preventDefault();
        const d = formData(e.currentTarget);
        const res = Store.addEnquiry(kind, d);
        if (res.errors) {
          setErrors(res.errors);
          return;
        }
        setErrors({});
        flashNow("Thanks. We've received your message and will reply within two working days.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        setRound((r) => r + 1);
      }}
    >
      <div className="row">
        <Field prefix={prefix} name="name" label="Your name" error={errors.name} />
        <Field prefix={prefix} name="organisation" label="Organisation" error={errors.organisation} />
      </div>
      <div className="row">
        <Field prefix={prefix} name="email" label="Email" type="email" error={errors.email} />
        <Field prefix={prefix} name="phone" label="Phone" type="tel" optional error={errors.phone} />
      </div>
      <Field
        prefix={prefix}
        name="link"
        label={opp ? "Official link" : "Website"}
        type="url"
        optional={!opp}
        placeholder="https://"
        error={errors.link}
      />
      <Field
        prefix={prefix}
        name="details"
        label={opp ? "Opportunity name, type, who can apply and deadline" : "What would you like to do together?"}
        type="textarea"
        error={errors.details}
      />
      <button className={"btn " + (opp ? "btn-forest" : "btn-gold")} type="submit" style={{ justifySelf: "start" }}>
        {opp ? "Submit opportunity" : "Send message"}
      </button>
    </form>
  );
}
export default function PartnerPage() {
  const { ready } = useStore();
  const partners =
    Store.schools()
      .filter((s) => s.partner)
      .map((s) => s.name)
      .join(", ") + ".";
  return (
    <div className="pg-partner">
      <header className="page-head">
        <div className="wrap">
          <h1>Let&apos;s open doors together.</h1>
          <p>Whether you run a university, a company or a foundation, the students you&apos;re looking for are already in our network.</p>
        </div>
      </header>
      <main id="main">
        <section className="section">
          <div className="wrap">
            <div className="paths">
              <div className="path">
                <p className="path-for">For universities</p>
                <h3>Bring the world to your campus.</h3>
                <p>We run programs with your departments and centres at no cost to the institution.</p>
                <ul>
                  <li>Practical courses and trainings, designed with your faculty</li>
                  <li>Industry talks, challenges and company visits</li>
                  <li>Internship and graduate job pathways</li>
                  <li>A report on how your students engage with every opportunity</li>
                </ul>
                <a href="#talk" className="btn btn-forest">
                  Start a partnership
                </a>
              </div>
              <div className="path">
                <p className="path-for">For companies</p>
                <h3>Meet talent with proof.</h3>
                <p>Every student on Scried builds a record of verified certificates and completed programs, not just a CV.</p>
                <ul>
                  <li>Interns and graduate hires with verified records</li>
                  <li>Innovation challenges on your real problems</li>
                  <li>Employer branding and campus campaigns</li>
                  <li>Brand partnerships with student creators</li>
                </ul>
                <a href="#talk" className="btn btn-forest">
                  Hire through Scried
                </a>
              </div>
              <div className="path">
                <p className="path-for">For organisations with opportunities</p>
                <h3>Know exactly who you reached.</h3>
                <p>Every student registers before they apply, so after your program closes you get an impact report, not a guess.</p>
                <ul>
                  <li>Registrations by school, course, level and age range</li>
                  <li>How many went on to apply and how many completed</li>
                  <li>Verified certificates and student feedback</li>
                  <li>Targeted alerts to the right students</li>
                </ul>
                <a href="#post" className="btn btn-forest">
                  Post an opportunity
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="section band-forest split" id="talk">
          <div className="wrap">
            <div>
              <h2>Talk to us.</h2>
              <p className="lead">Tell us a little about you and what you&apos;d like to build. We reply within two working days.</p>
              <ul className="checklist">
                <li>
                  <b>Already trusted on campus</b>
                  <span id="partners">{partners}</span>
                </li>
                <li>
                  <b>Start small</b>
                  <span>Most partnerships begin with one program and grow from there.</span>
                </li>
              </ul>
            </div>
            {ready ? <EnquiryForm kind="partner" /> : <form className="form" data-kind="partner" noValidate />}
          </div>
        </section>
        <section className="section split" id="post">
          <div className="wrap">
            <div>
              <h2>Post an opportunity.</h2>
              <p className="lead">
                Scholarships, internships, jobs, fellowships, competitions, trainings and grants for Nigerian students. Listing is free.
              </p>
              <p className="lead">We check every submission against its official source before it goes live, to keep students safe from scams.</p>
            </div>
            {ready ? <EnquiryForm kind="opportunity" /> : <form className="form" data-kind="opportunity" noValidate />}
          </div>
        </section>
      </main>
    </div>
  );
}
