# Scried: website and student app (React + Next.js)

Converted from the original static HTML/CSS/JavaScript site. Same pages, same components, same fonts (Syne + Figtree), same styles.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Try it

The first visit loads sample data automatically. Go to `/demo` (linked in the footer when demo data is on) to sign in with one click:

| Role | Email | Password |
|---|---|---|
| Student (Ada) | ada@scried.test | scried-demo-2026 |
| Staff | admin@scried.test | scried-admin-2026 |

## Routes (old file → new route)

| Original | Next.js route |
|---|---|
| `index.html` | `/` |
| `opportunities.html` | `/opportunities` (`?type=`, `?q=`) |
| `opportunity.html?id=x` | `/opportunities/[id]` |
| `apply.html?id=x` | `/opportunities/[id]/apply` |
| `registered.html?id=x` | `/opportunities/[id]/registered` |
| `sessions.html`, `partner.html`, `about.html`, `privacy.html` | `/sessions`, `/partner`, `/about`, `/privacy` |
| `stories.html`, `story.html?id=x` | `/stories` (`?c=`), `/stories/[id]` |
| `join.html`, `signin.html`, `forgot.html` | `/join`, `/signin`, `/forgot` |
| `dashboard.html`, `certificates.html`, `profile.html`, `record.html` | `/dashboard`, `/certificates`, `/profile`, `/record` |
| `complete.html?app=x` | `/complete/[appId]` |
| `demo.html` | `/demo` |
| `staff/index.html` | `/staff` |
| `staff/report.html?id=x` | `/staff/report/[id]` |
| `staff/schools.html`, `staff/verify.html`, `staff/setup.html` | `/staff/schools`, `/staff/verify`, `/staff/setup` |
| `staff/student.html?id=x` | `/staff/student/[id]` |
| `staff/opportunity-edit.html(?id=x)` | `/staff/opportunity-edit` and `/staff/opportunity-edit/[id]` |

## Project layout

```
src/
  app/                 routes (thin server pages: metadata + the page component)
  components/
    Chrome.tsx         nav, staff bar, flash messages, footer (was renderChrome in ui.js)
    Forms.tsx          Field, Check, ProfileFields, error handling (was UI.field / check / profileFields / showErrors)
    Cards.tsx          OppRow, Testimonial, StoryCard, Bars
    pages/             one component per page
  lib/
    store.ts           all data logic (was js/store.js), typed
    hooks.ts           useStore, useRequireUser, useRequireStaff, …
    ui.ts              helpers (dates, flash, form data, …)
    types.ts
  data/
    content.ts         contact details, schools, opportunities, sessions, testimonials (was js/data.js)
    posts.ts           blog posts and alumni spotlights (was js/posts.js)
  styles/              the original CSS files, unchanged apart from page scoping (below)
public/images/         put session photos here and reference them as "images/name.jpg"
```

## Editing content

Same as before: contact email / WhatsApp, schools, opportunities, sessions and testimonials are in `src/data/content.ts`; blog posts in `src/data/posts.ts`. Items marked `sample: true` only show while demo data is on.

## Notes on the conversion

- **Fonts:** Syne and Figtree are loaded from Google Fonts in `src/app/layout.tsx`, exactly as before, so the CSS (`font-family: "Syne"`, `"Figtree"`) is untouched.
- **CSS:** `site.css` and `app.css` are copied verbatim. `home`, `about`, `partner`, `sessions` and `stories` CSS were each loaded by a single page in the original and share some class names (`.story-img`, `.close`, `.path`), so each is prefixed with `:where(.pg-<page>)` and the page is wrapped in `<div class="pg-<page>">`. `:where()` adds no specificity, so the cascade is identical to the original.
- **Data storage is unchanged:** accounts, registrations and certificates are still saved in the visitor's own browser (localStorage + IndexedDB). See "Important: where data is saved" in the original README: to collect real data, replace the `[BACKEND]` functions in `src/lib/store.ts` with Firebase / Supabase calls. The pages don't need to change.
- The store now also listens for changes from other tabs, because the app no longer reloads on every page.
- **Before launch:** set `AUTO_DEMO = false` in `src/lib/store.ts`, remove demo data from `/demo`, create your staff account at `/staff/setup`, replace sample testimonials / alumni post, set your real email and WhatsApp in `src/data/content.ts`, and have `/privacy` reviewed against the Nigeria Data Protection Act 2023.
- Images use plain `<img>` (as in the original) rather than `next/image`, since they are Unsplash URLs with CSS-controlled cropping.

## How the numbers work

- **Streak:** consecutive days with at least one activity (exploring an opportunity, applying, completing, or reading a story). It counts today or yesterday, so the streak only breaks after a full missed day.
- **School score:** registrations + 2 × completions + 3 × verified certificates. **Percentile** is the share of other schools with a lower score.
