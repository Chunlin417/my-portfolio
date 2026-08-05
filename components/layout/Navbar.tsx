"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, THEME_STORAGE_KEY } from "@/lib/constants";

type Theme = "light" | "dark";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [theme, setTheme] = useState<Theme>("light");
  const [menuOpen, setMenuOpen] = useState(false);

  // The inline anti-flash script in app/layout.tsx already applied the
  // correct theme to <html> before hydration. Read it back into state here
  // (instead of re-deriving from localStorage) so the toggle button's icon
  // matches without ever writing to the DOM on mount.
  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    setTheme(attr === "dark" ? "dark" : "light");
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }

  // Close the mobile menu after a nav link is clicked
  const handleNavClick = () => setMenuOpen(false);

  // Auto-close the mobile menu if the window is resized back to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Scroll-spy: highlight whichever section is closest to the nav offset
  useEffect(() => {
    const sectionIds = ["home", "projects", "about", "contact"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const offset = 100;

    const updateActiveSection = () => {
      let bestSection: HTMLElement | null = null;
      let bestDistance = Infinity;

      for (const section of sections) {
        const top = section.getBoundingClientRect().top - offset;
        const distance = Math.abs(top);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestSection = section;
        }
      }

      if (bestSection) {
        setActiveSection(bestSection.id);
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);

  return (
    <header className="nav">
      <div className="nav__inner">
        <a className="brand" href="#home" onClick={handleNavClick}>
          Chunlin He
        </a>

        <div className="nav__right">
          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`nav__link ${activeSection === l.id ? "is-active" : ""}`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Mobile menu button */}
          <button
            className="menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`nav__mobile ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            onClick={handleNavClick}
            className={`nav__mobileLink ${activeSection === l.id ? "is-active" : ""}`}
          >
            {l.label}
          </a>
        ))}
      </div>
    </header>
  );
}
