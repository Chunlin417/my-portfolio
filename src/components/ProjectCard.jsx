export default function ProjectCard({ project, onOpen, variant = "default" }) {
  const isFeatured = variant === "featured" || project.featured;
  const isCompact = variant === "compact";

  return (
    <div
      className={`card ${isFeatured ? "card--featured" : ""} ${isCompact ? "card--compact" : ""
        } ${onOpen ? "card--clickable" : ""}`}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Open project: ${project.title}` : undefined}
      onClick={() => onOpen?.(project)}
      onKeyDown={(e) => {
        if (!onOpen) return;
        if (e.key === "Enter") onOpen(project);
        if (e.key === " ") {
          e.preventDefault();
          onOpen(project);
        }
      }}
    >
      <div className="card__head">
        <div>
          {isFeatured && <span className="badge">Featured</span>}
          <h3 className={`card__title ${isCompact ? "card__title--sm" : ""}`}>
            {project.title}
          </h3>
          <p className={`text ${isCompact ? "text--sm" : ""}`}>
            {project.description}
          </p>
        </div>
      </div>

      <div className="tags">
        {project.tech.map((t) => (
          <span key={t} className="tech-tag">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
