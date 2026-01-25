
export default function Navbar({ activeSection, theme, onToggleTheme }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];


  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="brand">Chunlin He</div>

        <div className="nav__right">
          <nav className="nav__links">
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
        </div>
      </div>
    </header>
  );
}
