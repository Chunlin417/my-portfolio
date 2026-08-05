import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chunlin He | Frontend Software Developer",
    template: "%s | Chunlin He",
  },
  description:
    "Frontend-focused software developer experienced in building production-ready web interfaces, enterprise UI systems, and maintainable frontend architecture.",
  keywords: ["Chunlin He", "Frontend Developer", "React", "TypeScript", "Software Developer"],
  authors: [{ name: "Chunlin He" }],
  creator: "Chunlin He",
  openGraph: {
    title: "Chunlin He | Frontend Software Developer",
    description:
      "Frontend-focused software developer building production-ready web interfaces and enterprise UI systems.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chunlin He | Frontend Software Developer",
    description:
      "Frontend-focused software developer building production-ready web interfaces and enterprise UI systems.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Navbar />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
