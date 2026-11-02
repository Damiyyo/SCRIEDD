export default function PrivacyPage() {
  return (
    <>
      <header className="post-head" style={{ paddingBottom: 64 }}>
        <div className="wrap">
          <h1>How we use your details.</h1>
          <p className="post-by">In plain words.</p>
        </div>
      </header>
      <main id="main">
        <article className="article">
          <p className="intro">
            Scried collects only what we need to bring you opportunities and to show the organisations behind them that their programs reach real
            students.
          </p>
          <h2>What we collect</h2>
          <ul>
            <li>Your name as it should appear on certificates, email and WhatsApp number</li>
            <li>Your school, course, level and age range</li>
            <li>The opportunities you register for, whether you went to the official link, and whether you completed them</li>
            <li>Your answers when you mark an opportunity complete, and any certificate you upload</li>
            <li>The days you&apos;re active, to keep your streak</li>
          </ul>
          <h2>How we use it</h2>
          <ul>
            <li>To fill in your applications so you don&apos;t type the same details twice</li>
            <li>To send you opportunities that fit your course and level</li>
            <li>To build your Scried record, which only you and the Scried team can see unless you choose to share it</li>
            <li>
              To write impact reports for the organisations offering opportunities. These show totals and breakdowns, such as how many students from
              each school registered.
            </li>
            <li>To understand which schools and courses to bring future opportunities to</li>
          </ul>
          <h2>What we never do</h2>
          <ul>
            <li>We never sell your data.</li>
            <li>We never ask for your BVN, bank PIN, card details or OTP.</li>
            <li>Your certificates are private. Only you and our verification team can open them.</li>
          </ul>
          <h2>Your choices</h2>
          <p>
            You can update your details any time from your profile. To delete your account and data, message us at{" "}
            <a href="mailto:hello@scried.com">hello@scried.com</a>.
          </p>
          {/* BEFORE LAUNCH: have this page reviewed against the Nigeria Data Protection Act 2023. */}
        </article>
      </main>
    </>
  );
}
