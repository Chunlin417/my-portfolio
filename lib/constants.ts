export interface NavLink {
  id: "home" | "projects" | "about" | "contact";
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const TOP_TECH_TAGS = ["Next.js", "React", "TypeScript", "Supabase"];

export const THEME_STORAGE_KEY = "portfolio_theme";

export const EMAIL = "hechunlin417@gmail.com";

export interface ContactLink {
  id: string;
  title: string;
  meta: string;
  href: string;
  external?: boolean;
}

/** Shared by the Contact section and the ⌘K command palette. */
export const CONTACT_LINKS: ContactLink[] = [
  {
    id: "email",
    title: "Email",
    meta: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    id: "github",
    title: "GitHub",
    meta: "github.com/Chunlin417",
    href: "https://github.com/Chunlin417",
    external: true,
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    meta: "linkedin.com/in/chunlin-he",
    href: "https://www.linkedin.com/in/chunlin-he-961637380/",
    external: true,
  },
];
