"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { NAV_LINKS } from "@/lib/constants";
import {
  getServerThemeSnapshot,
  getTheme,
  subscribeToTheme,
  toggleTheme,
} from "@/lib/theme";

const subscribeToNothing = () => () => {};
const getShortcutKey = () =>
  /mac|iphone|ipad/i.test(navigator.userAgent) ? "⌘K" : "Ctrl K";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  // The inline anti-flash script in app/layout.tsx applies the theme to <html>
  // before hydration, and the ⌘K palette can flip it too — so the button reads
  // the attribute as an external store instead of holding its own copy.
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getTheme,
    getServerThemeSnapshot
  );

  // Platform is only knowable on the client; the server snapshot keeps
  // hydration consistent and React swaps in the real value immediately after.
  const shortcutKey = useSyncExternalStore(
    subscribeToNothing,
    getShortcutKey,
    () => "⌘K"
  );

  function handleThemeToggle(event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    toggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
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
            className="kbd-hint"
            onClick={() => window.dispatchEvent(new CustomEvent("palette:open"))}
            aria-label="Open command palette"
            title="Command palette"
          >
            <span aria-hidden="true">{shortcutKey}</span>
          </button>

          <button
            className="theme-btn"
            onClick={handleThemeToggle}
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
