"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { TOP_TECH_TAGS } from "@/lib/constants";
import ProjectCard from "@/components/ui/ProjectCard";
import type { Project } from "@/types/project";

interface UrlState {
  tech: string[];
  project: number | null;
}

function readUrlState(): UrlState {
  const params = new URLSearchParams(window.location.search);
  const tech = params.get("tech");
  const project = Number(params.get("project"));

  return {
    tech: tech ? tech.split(",").filter(Boolean) : [],
    project: Number.isInteger(project) && project > 0 ? project : null,
  };
}

export default function Projects() {
  const [query, setQuery] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);

  /*
   * Tech filters and the open entry live in the URL so a filtered view or a
   * specific role can be linked to directly (?tech=Next.js&project=1).
   *
   * This deliberately uses the History API rather than next/navigation's
   * useSearchParams: that hook opts the whole page out of static rendering
   * unless it sits behind a Suspense boundary, which would keep the experience
   * content out of the server-rendered HTML — a bad trade on a page whose job
   * is to be read by recruiters and crawlers.
   */
  const [urlState, setUrlState] = useState<UrlState>({ tech: [], project: null });
  const selectedTech = urlState.tech;

  /*
   * Mirrors urlState so writeUrlState can read the latest value without taking
   * it as a dependency. The history write must NOT live inside a setState
   * updater — React runs those during render, and mutating history there makes
   * Next's Router update mid-render ("Cannot update a component while rendering
   * a different component").
   */
  const urlStateRef = useRef(urlState);

  useEffect(() => {
    const sync = () => {
      const next = readUrlState();
      urlStateRef.current = next;
      setUrlState(next);
    };

    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const writeUrlState = useCallback((next: Partial<UrlState>) => {
    const prev = urlStateRef.current;
    const merged: UrlState = {
      tech: next.tech ?? prev.tech,
      project: next.project !== undefined ? next.project : prev.project,
    };

    const params = new URLSearchParams(window.location.search);

    if (merged.tech.length) params.set("tech", merged.tech.join(","));
    else params.delete("tech");

    if (merged.project) params.set("project", String(merged.project));
    else params.delete("project");

    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    );

    urlStateRef.current = merged;
    setUrlState(merged);
  }, []);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === urlState.project) ?? null,
    [urlState.project]
  );

  const openProject = useCallback(
    (project: Project) => writeUrlState({ project: project.id }),
    [writeUrlState]
  );

  const closeProject = useCallback(
    () => writeUrlState({ project: null }),
    [writeUrlState]
  );

  // The ⌘K palette asks for an entry by id rather than reaching into this
  // component's state.
  useEffect(() => {
    const onOpenRequest = (event: Event) => {
      const id = (event as CustomEvent<{ id: number }>).detail?.id;
      if (id) writeUrlState({ project: id });
    };

    window.addEventListener("experience:open", onOpenRequest);
    return () => window.removeEventListener("experience:open", onOpenRequest);
  }, [writeUrlState]);

  const allTags = useMemo(() => {
    const set = new Set(projects.flatMap((p) => p.tech || []));
    return Array.from(set);
  }, []);

  const topTags = useMemo(() => {
    const set = new Set(allTags);
    return TOP_TECH_TAGS.filter((t) => set.has(t));
  }, [allTags]);

  const moreTags = useMemo(() => {
    const topSet = new Set(topTags);
    return allTags
      .filter((t) => !topSet.has(t))
      .sort((a, b) => a.localeCompare(b));
  }, [allTags, topTags]);

  const toggleTech = (tag: string) => {
    writeUrlState({
      tech: selectedTech.includes(tag)
        ? selectedTech.filter((t) => t !== tag)
        : [...selectedTech, tag],
    });
  };

  const clearFilters = () => {
    writeUrlState({ tech: [] });
    setQuery("");
  };

  const modalRef = useRef<HTMLDivElement>(null);

  /*
   * Dialog behaviour: lock background scroll, close on Escape, move focus into
   * the dialog, keep Tab inside it, and hand focus back to whatever opened it.
   * Without the trap, tabbing out of the modal lands on the page behind it,
   * which keyboard and screen-reader users have no way to recover from.
   */
  useEffect(() => {
    if (!selectedProject) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProject();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !modalRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);

    modalRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [selectedProject, closeProject]);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesQuery =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tech.some((t) => t.toLowerCase().includes(q));

      const matchesTech =
        selectedTech.length === 0 ||
        selectedTech.every((tag) => project.tech.includes(tag));

      return matchesQuery && matchesTech;
    });
  }, [query, selectedTech]);

  const isFiltering = query.trim() !== "" || selectedTech.length > 0;

  const featuredProject = filteredProjects.find((p) => p.featured);
  const nonFeatured = featuredProject
    ? filteredProjects.filter((p) => p.id !== featuredProject.id)
    : filteredProjects;

  // 2 shown by default, the rest revealed via "Earlier Experience"
  const displayProjects = isFiltering ? filteredProjects : nonFeatured.slice(0, 2);
  const moreProjects = isFiltering ? [] : nonFeatured.slice(2, 6);

  // Derived rather than reset through an effect: while a filter is active the
  // disclosure is irrelevant, and clearing the filter should restore whatever
  // the visitor had expanded.
  const isEarlierExpanded = showMore && !isFiltering;

  useEffect(() => {
    if (!isEarlierExpanded) return;

    const frame = requestAnimationFrame(() => {
      const el = document.querySelector(".more-grid");
      if (!el) return;

      const y = el.getBoundingClientRect().top + window.scrollY - 200;
      window.scrollTo({ top: y, behavior: "smooth" });
    });

    return () => cancelAnimationFrame(frame);
  }, [isEarlierExpanded]);

  return (
    <section id="projects" className="section">
      <span className="section-kicker">01 — Experience</span>
      <h2 className="h2">Experience</h2>

      <div className="projects-toolbar">
        <input
          type="text"
          className="project-search"
          placeholder="Search experience by company or tech..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="filtersRow">
          {/* Top chips: kept to one or two rows */}
          <div className="tagChips tagChips--top">
            {topTags.map((tag) => (
              <button
                key={tag}
                className={`chip ${selectedTech.includes(tag) ? "is-active" : ""}`}
                onClick={() => toggleTech(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}

            {moreTags.length > 0 && (
              <button
                className={`chip chipMore ${showAllFilters ? "is-active" : ""}`}
                onClick={() => setShowAllFilters((v) => !v)}
                type="button"
              >
                {showAllFilters ? "Hide" : `More (${moreTags.length})`}
              </button>
            )}

            {(query.trim() || selectedTech.length > 0) && (
              <button className="chip chipClear" onClick={clearFilters} type="button">
                Clear
              </button>
            )}
          </div>

          {/* Dropdown panel */}
          {showAllFilters && (
            <div className="filterDropdown">
              <div className="filterDropdown__header">
                <span className="filterDropdown__title">More filters</span>
                <button
                  className="filterDropdown__close"
                  onClick={() => setShowAllFilters(false)}
                  type="button"
                >
                  ✕
                </button>
              </div>

              <div className="tagChips tagChips--all">
                {moreTags.map((tag) => (
                  <button
                    key={tag}
                    className={`chip ${selectedTech.includes(tag) ? "is-active" : ""}`}
                    onClick={() => toggleTech(tag)}
                    type="button"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary display: featured project, max one */}
      {!isFiltering && featuredProject && (
        <div className="grid">
          <ProjectCard project={featuredProject} variant="featured" onOpen={openProject} />
        </div>
      )}

      {/* Second row: two project cards + "More" card */}
      <div className="grid">
        {displayProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            variant="default"
            onOpen={openProject}
          />
        ))}

        {!isFiltering && moreProjects.length > 0 && (
          <button
            type="button"
            className={`card card--more card--clickable ${isEarlierExpanded ? "is-open" : ""}`}
            onClick={() => setShowMore((v) => !v)}
            aria-expanded={isEarlierExpanded}
            aria-controls="earlier-experience"
          >
            <div className="more-card__inner">
              <div className="more-card__title">Earlier Experience</div>
              <div className="more-card__desc">
                {isEarlierExpanded
                  ? "Hide earlier experience"
                  : `View ${moreProjects.length} more — co-founding and remote nonprofit work`}
              </div>
              <div className={`more-card__icon ${isEarlierExpanded ? "is-open" : ""}`}>▾</div>
            </div>
          </button>
        )}
      </div>

      {/*
        Always rendered when unfiltered, collapsed with `hidden` rather than
        unmounted, so these roles ship in the prerendered HTML for crawlers
        while staying out of the accessibility tree until expanded.
      */}
      {!isFiltering && moreProjects.length > 0 && (
        <div className="grid more-grid" id="earlier-experience" hidden={!isEarlierExpanded}>
          {moreProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              variant="compact"
              onOpen={openProject}
            />
          ))}
        </div>
      )}

      {/* Project detail modal */}
      {selectedProject && (
        <div className="modal-overlay" onMouseDown={closeProject}>
          <div
            ref={modalRef}
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProject.title} details`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={closeProject}
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>

            <div className="modal-body">
              <div className="modal-head">
                <div>
                  <h3 className="modal-title">
                    {selectedProject.link ? (
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-title-link"
                      >
                        {selectedProject.title}
                      </a>
                    ) : (
                      selectedProject.title
                    )}
                    {selectedProject.subtitle ? <> — {selectedProject.subtitle}</> : null}
                  </h3>

                  <p className="modal-desc">{selectedProject.description}</p>
                </div>
              </div>

              <div className="modal-meta">
                {selectedProject.period && (
                  <div className="meta-item">
                    <div className="meta-label">Period</div>
                    <div className="meta-value">{selectedProject.period}</div>
                  </div>
                )}
                {selectedProject.role && (
                  <div className="meta-item">
                    <div className="meta-label">Role</div>
                    <div className="meta-value">{selectedProject.role}</div>
                  </div>
                )}
                {selectedProject.stack && selectedProject.stack.length > 0 && (
                  <div className="meta-item">
                    <div className="meta-label">Stack</div>
                    <div className="meta-value">{selectedProject.stack.join(" · ")}</div>
                  </div>
                )}
              </div>

              {selectedProject.highlights && selectedProject.highlights.length > 0 && (
                <div className="modal-section">
                  <h4 className="modal-subtitle">Highlights</h4>
                  <ul className="modal-list">
                    {selectedProject.highlights.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProject.challenges && selectedProject.challenges.length > 0 && (
                <div className="modal-section">
                  <h4 className="modal-subtitle">Challenges</h4>
                  <ul className="modal-list">
                    {selectedProject.challenges.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProject.next && selectedProject.next.length > 0 && (
                <div className="modal-section">
                  <h4 className="modal-subtitle">Next Improvements</h4>
                  <ul className="modal-list">
                    {selectedProject.next.map((n, idx) => (
                      <li key={idx}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="tags">
                {selectedProject.tech.map((t) => (
                  <span key={t} className="tech-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
