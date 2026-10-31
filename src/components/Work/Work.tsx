import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type Project } from "../../data/projects";
import { socials } from "../../data/profile";
import useReducedMotion from "../../hooks/useReducedMotion";
import useSound from "../../hooks/useSound";
import { inView, pick, riseChild, stagger } from "../../utils/motion";
import SectionHeader from "../ui/SectionHeader";
import "./Work.scss";

const githubUrl =
  socials.find((s) => s.id === "github")?.href ?? "https://github.com/An-Yay";

export default function Work() {
  const reduced = useReducedMotion();
  const playClick = useSound();
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <section className="work" aria-labelledby="work-heading">
      <span className="section-anchor" id="work" aria-hidden="true" />

      <div className="container">
        <SectionHeader
          eyebrow="Selected work"
          title="Things I built to answer a question."
          description="Side projects, hackathon wins, and a startup. Each one started with a problem worth poking at."
          headingId="work-heading"
        />

        <motion.ul
          className="work__grid"
          variants={pick(stagger(0.09), reduced)}
          {...inView}
        >
          {projects.map((project, i) => (
            <motion.li
              key={project.id}
              className={`work__item${
                project.featured ? " work__item--featured" : ""
              }`}
              variants={pick(riseChild, reduced)}
            >
              <button
                type="button"
                className="work__card"
                data-analytics-id={`project-${project.id}`}
                data-analytics-surface="work"
                onClick={() => {
                  playClick();
                  setOpen(project);
                }}
                aria-label={`Read the case study for ${project.title}`}
              >
                <span className="work__cover" aria-hidden="true">
                  <span className="work__cover-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>

                <span className="work__body">
                  <span className="work__head">
                    <h3 className="work__title">{project.title}</h3>
                    <span className="work__year">{project.year}</span>
                  </span>

                  {project.award && (
                    <span className="work__award">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M12 2l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 8.4l6.1-.8L12 2Z"
                          fill="currentColor"
                        />
                      </svg>
                      {project.award}
                    </span>
                  )}

                  <span className="work__blurb">{project.blurb}</span>

                  <span className="work__stack">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span key={tech} className="work__chip">
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 4 && (
                      <span className="work__chip work__chip--more">
                        +{project.stack.length - 4}
                      </span>
                    )}
                  </span>

                  <span className="work__more">
                    Read case study
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </motion.ul>

        <a
          className="work__all"
          data-analytics-id="github-projects"
          data-analytics-surface="work"
          href={githubUrl}
          target="_blank"
          rel="noreferrer noopener"
          onMouseDown={playClick}
        >
          Everything else on GitHub
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7 17L17 7M17 7H9M17 7v8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <CaseStudy project={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function CaseStudy({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (!project) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="case" role="presentation">
          <motion.div
            className="case__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="case__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
            transition={
              reduced
                ? { duration: 0.15 }
                : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <header className="case__head">
              <div>
                <p className="case__year">{project.year}</p>
                <h2 className="case__title" id="case-title">
                  {project.title}
                </h2>
              </div>
              <button
                type="button"
                className="case__close"
                onClick={onClose}
                aria-label="Close case study"
                data-analytics-id="case-study-close"
                data-analytics-surface="case-study"
                autoFocus
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>

            <div className="case__body">
              <section className="case__block">
                <h3 className="case__label">The problem</h3>
                <p className="case__text">{project.problem}</p>
              </section>

              <section className="case__block">
                <h3 className="case__label">The approach</h3>
                <p className="case__text">{project.approach}</p>
              </section>

              <section className="case__block">
                <h3 className="case__label">The outcome</h3>
                <p className="case__text">{project.outcome}</p>
              </section>

              <section className="case__block">
                <h3 className="case__label">Built with</h3>
                <ul className="case__stack">
                  {project.stack.map((tech) => (
                    <li key={tech} className="case__chip">
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>

              {project.links.length > 0 && (
                <footer className="case__links">
                  {project.links.map((link) => (
                    <a
                      key={link.href + link.label}
                      className="case__link"
                      data-analytics-id={`project-link-${project.id}-${link.kind}`}
                      data-analytics-surface="case-study"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {link.label}
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M7 17L17 7M17 7H9M17 7v8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  ))}
                </footer>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
