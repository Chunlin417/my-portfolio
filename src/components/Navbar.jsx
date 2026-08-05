
import { useEffect, useState } from "react";

export default function Navbar({ activeSection, theme, onToggleTheme }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);

  // 点链接后自动收起菜单
  const handleNavClick = () => setMenuOpen(false);

  // 监听窗口变大时，自动关闭移动菜单（避免切回桌面还开着）
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="nav">
      <div className="nav__inner">
        <a className="brand" href="#home" onClick={handleNavClick}>
          Chunlin He
        </a>

        <div className="nav__right">
          <nav className="nav__links" aria-label="Primary">
            {links.map((l) => (
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
            onClick={onToggleTheme}
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
        {links.map((l) => (
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
