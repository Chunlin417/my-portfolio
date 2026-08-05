"use client";

import { useEffect, useMemo, useState } from "react";
import { projects } from "@/data/projects";
import { TOP_TECH_TAGS } from "@/lib/constants";
import ProjectCard from "@/components/ui/ProjectCard";
import type { Project } from "@/types/project";

export default function Projects() {
  const [query, setQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const openProject = (project: Project) => setSelectedProject(project);
  const closeProject = () => setSelectedProject(null);

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
    setSelectedTech((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTech([]);
    setQuery("");
  };

  // Escape closes the modal + locks background scroll while it's open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProject();
    };

    if (selectedProject) {
      document.body.classList.add("modal-open");
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedProject]);

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

  // 2 shown by default, up to 4 more revealed via "More Projects"
  const displayProjects = isFiltering ? filteredProjects : nonFeatured.slice(0, 2);
  const moreProjects = isFiltering ? [] : nonFeatured.slice(2, 6);

  useEffect(() => {
    if (isFiltering) setShowMore(false);
  }, [isFiltering]);

  useEffect(() => {
    if (showMore) {
      requestAnimationFrame(() => {
        const el = document.querySelector(".more-grid");
        if (!el) return;

        const y = el.getBoundingClientRect().top + window.pageYOffset - 200;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    }
  }, [showMore]);

  return (
    <section id="projects" className="section">
      <h2 className="h2">Projects</h2>

      <div className="projects-toolbar">
        <input
          type="text"
          className="project-search"
          placeholder="Search projects by name or tech..."
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
          <div
            className={`card card--more card--clickable ${showMore ? "is-open" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => setShowMore((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowMore((v) => !v);
              }
            }}
            aria-label={showMore ? "Hide more projects" : "Show more projects"}
          >
            <div className="more-card__inner">
              <div className="more-card__title">More Projects</div>
              <div className="more-card__desc">
                {showMore ? "Hide extra projects" : `View ${moreProjects.length} more projects`}
              </div>
              <div className={`more-card__icon ${showMore ? "is-open" : ""}`}>▾</div>
            </div>
          </div>
        )}
      </div>

      {/* Expanded: up to 4 more projects, compact variant */}
      {!isFiltering && showMore && moreProjects.length > 0 && (
        <div className="grid more-grid">
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
