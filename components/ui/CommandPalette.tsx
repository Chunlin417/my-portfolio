"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { CONTACT_LINKS, EMAIL, NAV_LINKS } from "@/lib/constants";
import { getTheme, toggleTheme } from "@/lib/theme";

interface Command {
  id: string;
  label: string;
  group: string;
  /** Right-aligned meta text (dates, shortcut, url). */
  hint?: string;
  /** Extra text matched against the query but never displayed. */
  keywords?: string;
  /**
   * Returning a string keeps the palette open and shows that message —
   * used for actions like "copy email" where silent success reads as a bug.
   */
  run: () => string | void;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    setFeedback(null);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const navigation: Command[] = NAV_LINKS.map((link) => ({
      id: `nav-${link.id}`,
      label: link.label,
      group: "Go to",
      keywords: `jump scroll section ${link.id}`,
      run: () => scrollToSection(link.id),
    }));

    const experience: Command[] = projects.map((project) => ({
      id: `project-${project.id}`,
      label: project.title,
      group: "Experience",
      hint: project.period,
      keywords: [project.role, ...project.tech].filter(Boolean).join(" "),
      run: () => {
        scrollToSection("projects");
        window.dispatchEvent(
          new CustomEvent("experience:open", { detail: { id: project.id } })
        );
      },
    }));

    const actions: Command[] = [
      {
        id: "action-theme",
        label: "Toggle theme",
        group: "Actions",
        hint: "light / dark",
        keywords: "dark light mode appearance color",
        run: () => {
          // No origin point: a wipe radiating from the palette overlay reads as
          // a glitch, so this one intentionally uses the instant swap.
          toggleTheme();
          return `Switched to ${getTheme()} mode`;
        },
      },
      {
        id: "action-copy-email",
        label: "Copy email address",
        group: "Actions",
        hint: EMAIL,
        keywords: "mail contact clipboard",
        run: () => {
          navigator.clipboard?.writeText(EMAIL);
          return "Email copied to clipboard";
        },
      },
      ...CONTACT_LINKS.filter((link) => link.external).map((link) => ({
        id: `link-${link.id}`,
        label: `Open ${link.title}`,
        group: "Actions",
        hint: link.meta,
        keywords: "profile social external",
        run: () => {
          window.open(link.href, "_blank", "noopener,noreferrer");
        },
      })),
    ];

    return [...navigation, ...experience, ...actions];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;

    return commands.filter((command) =>
      `${command.label} ${command.group} ${command.hint ?? ""} ${command.keywords ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [commands, query]);

  // Global shortcut. Registered once, independent of open state.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const onOpenRequest = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("palette:open", onOpenRequest);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("palette:open", onOpenRequest);
    };
  }, []);

  // Uses its own scroll-lock class so closing the palette can't unlock the
  // page while the project modal it just opened is still up.
  useEffect(() => {
    if (!open) return;

    document.body.classList.add("palette-open");
    inputRef.current?.focus();

    return () => document.body.classList.remove("palette-open");
  }, [open]);

  // Keep the highlighted row visible while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const runCommand = useCallback(
    (command: Command | undefined) => {
      if (!command) return;

      const message = command.run();
      if (typeof message === "string") {
        setFeedback(message);
        window.setTimeout(close, 900);
        return;
      }

      close();
    },
    [close]
  );

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (results.length ? (prev + 1) % results.length : 0));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        results.length ? (prev - 1 + results.length) % results.length : 0
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      runCommand(results[activeIndex]);
    }
  }

  if (!open) return null;

  let renderedGroup: string | null = null;

  return (
    <div
      className="palette-overlay"
      onMouseDown={close}
      role="presentation"
    >
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="palette__input"
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            // Reset here rather than in an effect on `query`: the highlight
            // belongs to this interaction, not to a later render pass.
            setActiveIndex(0);
          }}
          onKeyDown={onInputKeyDown}
          placeholder="Jump to a section, role, or action..."
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-autocomplete="list"
          aria-activedescendant={
            results[activeIndex] ? `palette-option-${results[activeIndex].id}` : undefined
          }
        />

        <div className="palette__list" id="palette-list" role="listbox" ref={listRef}>
          {results.length === 0 && (
            <div className="palette__empty">No matches for &ldquo;{query}&rdquo;</div>
          )}

          {results.map((command, index) => {
            const showGroup = command.group !== renderedGroup;
            renderedGroup = command.group;

            return (
              <div key={command.id}>
                {showGroup && (
                  <div className="palette__group" aria-hidden="true">
                    {command.group}
                  </div>
                )}

                <div
                  id={`palette-option-${command.id}`}
                  className={`palette__option ${index === activeIndex ? "is-active" : ""}`}
                  data-index={index}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => runCommand(command)}
                >
                  <span className="palette__label">{command.label}</span>
                  {command.hint && <span className="palette__hint">{command.hint}</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="palette__footer">
          {feedback ? (
            <span className="palette__feedback" role="status">
              {feedback}
            </span>
          ) : (
            <>
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> select
              </span>
              <span>
                <kbd>esc</kbd> close
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
