import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";


const THEME_KEY = "portfolio_theme";

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}


export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [theme, setTheme] = useState(getInitialTheme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  useEffect(() => {
    const sectionIds = ["home", "projects", "about", "contact"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    const offset = 100; // navbar 高度（80–120 都可以）

    const updateActiveSection = () => {
      let bestSection = null;
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

    updateActiveSection(); // 页面加载立即算一次
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);


  return (
    <div>
      <Navbar activeSection={activeSection} theme={theme} onToggleTheme={toggleTheme} />


      <main className="container">
        <Home />
        <Projects />
        <About />
        <Contact />
      </main>

      <footer className="footer">© {new Date().getFullYear()} Chunlin He</footer>
    </div>
  );
}
