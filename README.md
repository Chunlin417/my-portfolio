# Chunlin He — Portfolio

Personal portfolio site. Built with Next.js (App Router), TypeScript, and Tailwind CSS.

This project was migrated from Vite + React (JS) to Next.js. The old implementation is preserved
temporarily in `legacy-vite/` (gitignored) — delete that folder once you've confirmed
`npm run build` succeeds and the site checks out visually.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build locally
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript, no emit

## Project structure

```
app/            routes (App Router), global layout, global.css
components/
  layout/       Navbar, Footer
  sections/     Hero, Projects, About, Contact
  ui/           ProjectCard
data/           project data (typed)
lib/            shared constants
types/          shared TypeScript types
public/         static assets (images, favicons)
```

The site is a single scrolling page (`/`) with anchor-based navigation (`#home`, `#projects`,
`#about`, `#contact`) — this matches the original Vite app's behavior exactly.
