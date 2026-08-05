import { THEME_STORAGE_KEY } from "./constants";

export type Theme = "light" | "dark";

/**
 * The <html data-theme> attribute is the single source of truth — it is set by
 * the inline anti-flash script in app/layout.tsx before first paint, so reading
 * it back is always cheaper and more correct than re-deriving from storage.
 */
export function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

/**
 * Subscribes to <html data-theme> itself rather than to a React state setter,
 * so every consumer stays in sync no matter who flipped the theme — the navbar
 * button, the ⌘K palette, or a future caller.
 */
export function subscribeToTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  return () => observer.disconnect();
}

/** Server render has no DOM to read; light matches the pre-hydration default. */
export function getServerThemeSnapshot(): Theme {
  return "light";
}

export function applyTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies) — the theme
    // still applies for this session, it just won't be remembered.
  }
}

// startViewTransition is not in every TS DOM lib version yet, and it is a
// progressive enhancement either way, so it stays optional here.
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

/**
 * Flips the theme. When the browser supports the View Transitions API (and the
 * visitor hasn't asked for reduced motion), the new theme is revealed with a
 * circular wipe expanding from `origin` — usually the toggle button itself.
 * Everywhere else this degrades to an instant swap.
 */
export function toggleTheme(origin?: { x: number; y: number }): Theme {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";

  const doc = document as ViewTransitionDocument;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!doc.startViewTransition || prefersReducedMotion || !origin) {
    applyTheme(next);
    return next;
  }

  const { x, y } = origin;
  // Radius needed to cover the furthest corner from the click origin.
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = doc.startViewTransition(() => applyTheme(next));

  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    })
    .catch(() => {
      // A skipped/interrupted transition still applied the theme — nothing to do.
    });

  return next;
}
