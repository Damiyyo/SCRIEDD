import Chrome from "@/components/Chrome";
import Splash from "@/components/Splash";
// Order matters: shared styles first, then the (scoped) page styles, as each page loaded them in the original.
import "@/styles/site.css";
import "@/styles/app.css";
import "@/styles/scope.css";
import "@/styles/home.css";
import "@/styles/about.css";
import "@/styles/partner.css";
import "@/styles/sessions.css";
import "@/styles/stories.css";
import "@/styles/splash.css";
export const metadata = {
  title: "Scried: Something is possible here",
  description: "Scried brings opportunities closer to Nigerian students, and brings Nigerian students to the world."
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Same fonts as the original site: Syne (display) and Figtree (body). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Figtree:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Splash />
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
