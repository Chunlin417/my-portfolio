import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CommandPalette from "@/components/ui/CommandPalette";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Chunlin He | Full-Stack Developer",
    template: "%s | Chunlin He",
  },
  description:
    "Full-stack developer experienced in building production-ready platforms end to end — Next.js and React frontends backed by Supabase, PostgreSQL, and RESTful APIs.",
  keywords: [
    "Chunlin He",
    "Full-Stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Supabase",
    "Software Developer",
  ],
  authors: [{ name: "Chunlin He" }],
  creator: "Chunlin He",
  openGraph: {
    title: "Chunlin He | Full-Stack Developer",
    description:
      "Full-stack developer building production-ready platforms end to end — Next.js and React frontends backed by Supabase, PostgreSQL, and RESTful APIs.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chunlin He | Full-Stack Developer",
    description:
      "Full-stack developer building production-ready platforms end to end — Next.js and React frontends backed by Supabase, PostgreSQL, and RESTful APIs.",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
};

// Applies the saved/preferred color theme to <html> before first paint so
// there is no flash of the wrong theme. Mirrors the logic that used to live
// in src/App.jsx's getInitialTheme(), just moved earlier in the load
// sequence since Next.js no longer has a single main.jsx entry point.
const themeInitScript = `
(function () {
  try {
    var key = "portfolio_theme";
    var saved = localStorage.getItem(key);
    var theme = saved === "light" || saved === "dark"
      ? saved
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Navbar />
        <main className="container">{children}</main>
        <Footer />
        <CommandPalette />
      </body>
    </html>
  );
}
