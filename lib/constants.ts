export interface NavLink {
  id: "home" | "projects" | "about" | "contact";
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const TOP_TECH_TAGS = ["React", "TypeScript", "JavaScript", "Vue", "PHP"];

export const THEME_STORAGE_KEY = "portfolio_theme";
