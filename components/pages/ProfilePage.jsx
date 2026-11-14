"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FormError, useFormErrors } from "@/components/Forms";
import { useRequireUser } from "@/lib/hooks";
import { useAuth } from "@/lib/auth-context";
import { SCRIED_LEVELS } from "@/data/content";
import { flashNow } from "@/lib/ui";
// Official NUC registry snapshot (2026-11-13) keeps suggestions available without a live external lookup.
import NIGERIAN_UNIVERSITIES from "@/data/nigerian-universities.json";
import { NIGERIAN_FACULTIES, NIGERIAN_STATES } from "@/data/nigeria-profile-options";

const PROFILE_AGE_RANGES = [
  ["under_18", "Under 18"],
  ["18_20", "18–20"],
  ["21_24", "21–24"],
  ["25_29", "25–29"],
  ["30_plus", "30 and above"],
  ["prefer_not_to_say", "Prefer not to say"],
];
const completionFields = ["whatsapp_number", "school_name", "state", "course", "level", "age_range"];

export default function ProfilePage({ onboarding = false }) {
  const router = useRouter();
  const user = useRequireUser();
  const { authenticatedRequest, refreshUser } = useAuth();
  const { errors, setErrors, formRef } = useFormErrors();
  const [busy, setBusy] = useState(false);
  const profile = user?.profile || {};
  const stateOptions = profile.state && !NIGERIAN_STATES.some(([value]) => value === profile.state)
    ? [[profile.state, profile.state], ...NIGERIAN_STATES]
    : NIGERIAN_STATES;
  const completeCount = user ? completionFields.filter((key) => Boolean(profile[key])).length + (user.full_name ? 1 : 0) : 0;
  const completion = Math.round((completeCount / (completionFields.length + 1)) * 100);

  async function saveProfile(event) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    const form = new FormData(event.currentTarget);
    const optionalText = (key) => String(form.get(key) || "").trim() || null;
    const interests = String(form.get("interests") || "")
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean);
    const payload = {
      full_name: String(form.get("full_name") || "").trim(),
      whatsapp_number: optionalText("whatsapp_number"),
      school_name: optionalText("school_name"),
      state: optionalText("state"),
      faculty: optionalText("faculty"),
      department: optionalText("department"),
      course: optionalText("course"),
      level: optionalText("level"),
      age_range: optionalText("age_range"),
      matriculation_number: optionalText("matriculation_number"),
      interests,
    };
    const requiredValues = [
      ["full_name", payload.full_name],
      ["whatsapp_number", payload.whatsapp_number],
      ["school_name", payload.school_name],
      ["state", payload.state],
      ["faculty", payload.faculty],
      ["department", payload.department],
      ["course", payload.course],
      ["level", payload.level],
      ["age_range", payload.age_range],
      ["matriculation_number", payload.matriculation_number],
      ["interests", interests.length ? interests.join(",") : ""],
    ];
    const missingFields = onboarding ? requiredValues.filter(([, value]) => !value).map(([key]) => key) : [];
    if (missingFields.length) {
      setErrors({
        form: "Complete every profile field before continuing to opportunities.",
        ...Object.fromEntries(missingFields.map((key) => [key, "This field is required to finish setup."])),
      });
      setBusy(false);
      return;
    }

    try {
      await authenticatedRequest("/auth/me", { method: "PATCH", body: JSON.stringify(payload) });
      await refreshUser().catch(() => undefined);
      flashNow("Your profile has been saved.", "success");
      if (onboarding) {
        router.replace("/opportunities?onboarding=1");
      }
    } catch (error) {
      setErrors({ form: error.message || "We couldn’t save your profile. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return <main id="main" className="wrap apply-wrap"><section className="form profile-loading" aria-live="polite">Loading your profile…</section></main>;
  }

  return (
    <main id="main" className="wrap apply-wrap profile-page">
      <aside className="profile-intro">
        <p className="eyebrow">Your Scried account</p>
        <h1>{onboarding ? "Complete your profile" : "Your profile"}</h1>
        <p>{onboarding ? "Fill in every field to finish setting up your Scried account and see opportunities selected for you." : "Keep your details current. We’ll use them to make opportunity applications quicker and to personalise your experience."}</p>
        <div className="profile-progress" aria-label={`Profile ${completion}% complete`}>
          <div className="profile-progress-heading"><span>Profile completeness</span><strong>{completion}%</strong></div>
          <div className="profile-progress-track"><span style={{ width: `${completion}%` }} /></div>
          <p>A few accurate details now mean less typing later.</p>
        </div>
        {!onboarding && (
          <nav className="profile-shortcuts" aria-label="Profile shortcuts">
            <Link href="/record">View my Scried record</Link>
            <Link href="/certificates">My certificates</Link>
          </nav>
        )}
      </aside>

      <form className="form profile-form" ref={formRef} noValidate onSubmit={saveProfile}>
        <FormError message={errors.form} />
        <section className="profile-form-section" aria-labelledby="profile-personal-title">
          <div className="profile-section-heading"><span>01</span><div><h2 id="profile-personal-title">Personal details</h2><p>Your name appears on your Scried record and certificates.</p></div></div>
          <Field name="full_name" label="Full name" value={user.full_name || user.fullName} autoComplete="name" error={errors.full_name} inputProps={{ required: true, minLength: 2, maxLength: 160 }} />
          <Field name="email" label="Email address" type="email" value={user.email} disabled autoComplete="email" help="Email address can’t be changed here." />
          <div className="row">
            <Field name="whatsapp_number" label="WhatsApp number" type="tel" value={profile.whatsapp_number} placeholder="e.g. 0803 000 0000" autoComplete="tel" required={onboarding} error={errors.whatsapp_number} inputProps={{ required: onboarding, maxLength: 40 }} />
            <Field name="state" label="State" value={profile.state} options={stateOptions} placeholder="Choose your state" autoComplete="address-level1" required={onboarding} error={errors.state} />
          </div>
        </section>

        <section className="profile-form-section" aria-labelledby="profile-education-title">
          <div className="profile-section-heading"><span>02</span><div><h2 id="profile-education-title">Education</h2><p>Pick your university, state, and faculty from suggestions, then add your course details.</p></div></div>
          <Field name="school_name" label="School or institution" value={profile.school_name} placeholder="Search or enter your university" autoComplete="off" help="Choose from Nigeria’s NUC-listed universities, or enter your institution if it isn’t listed." error={errors.school_name} inputProps={{ list: "nigerian-universities", maxLength: 255, required: onboarding }} />
          <datalist id="nigerian-universities">
            {NIGERIAN_UNIVERSITIES.map((university) => <option value={university} key={university} />)}
          </datalist>
          <div className="row">
            <Field name="faculty" label="Faculty" value={profile.faculty} placeholder="Search or enter your faculty" autoComplete="off" help="Choose a common faculty or type your institution’s name for it." error={errors.faculty} inputProps={{ list: "nigerian-faculties", maxLength: 160, required: onboarding }} />
            <datalist id="nigerian-faculties">
              {NIGERIAN_FACULTIES.map((faculty) => <option value={faculty} key={faculty} />)}
            </datalist>
            <Field name="department" label="Department" value={profile.department} placeholder="e.g. Computer Science" error={errors.department} inputProps={{ required: onboarding, maxLength: 160 }} />
          </div>
          <Field name="course" label="Course of study" value={profile.course} placeholder="e.g. Computer Science" error={errors.course} inputProps={{ required: onboarding, maxLength: 160 }} />
          <div className="row">
            <Field name="level" label="Current level" value={profile.level} options={SCRIED_LEVELS} placeholder="Choose your level" required={onboarding} error={errors.level} />
            <Field name="age_range" label="Age range" value={profile.age_range} options={PROFILE_AGE_RANGES} placeholder="Choose an age range" required={onboarding} error={errors.age_range} />
          </div>
          <Field name="matriculation_number" label="Matriculation number" value={profile.matriculation_number} optional={!onboarding} required={onboarding} placeholder="Enter your matric number" error={errors.matriculation_number} inputProps={{ maxLength: 80 }} />
        </section>

        <section className="profile-form-section" aria-labelledby="profile-interests-title">
          <div className="profile-section-heading"><span>03</span><div><h2 id="profile-interests-title">Interests</h2><p>Separate interests with commas. This helps us surface relevant opportunities.</p></div></div>
          <Field name="interests" label="Areas you’re interested in" type="textarea" value={(profile.interests || []).join(", ")} placeholder="e.g. software, design, entrepreneurship" optional={!onboarding} required={onboarding} error={errors.interests} />
        </section>

        <div className="btns profile-actions">
          <button className="btn btn-forest" type="submit" disabled={busy}>{busy ? "Saving your profile…" : onboarding ? "Save and continue" : "Save profile"}</button>
          {!onboarding && <Link className="btn btn-line-dark" href="/dashboard">Back to dashboard</Link>}
        </div>
      </form>
    </main>
  );
}
