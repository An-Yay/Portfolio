import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  experience,
  formatDuration,
  formatPeriod,
  typeLabel,
} from "../../data/experience";
import useReducedMotion from "../../hooks/useReducedMotion";
import { inView, pick, rise, riseChild, stagger } from "../../utils/motion";
import SectionHeader from "../ui/SectionHeader";
import CompanyMark from "../ui/CompanyMark";
import "./Experience.scss";

export default function Experience() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Progress of the timeline rail, driven by how far the list has scrolled past.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 65%", "end 55%"],
  });
  const railScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section className="experience" aria-labelledby="experience-heading">
      <span className="section-anchor" id="experience" aria-hidden="true" />

      <div className="container">
        <SectionHeader
          eyebrow="Experience"
          title="Three years of shipping things that pay for themselves."
          description="From a CDN written from scratch to an agentic platform driving eight figures. Here's the path."
          headingId="experience-heading"
        />

        <div className="experience__timeline" ref={trackRef}>
          <div className="experience__rail" aria-hidden="true">
            <motion.div
              className="experience__rail-fill"
              style={reduced ? { scaleY: 1 } : { scaleY: railScale }}
            />
          </div>

          <ol className="experience__track">

          {experience.map((role) => {
            const isCurrent = role.end === null;
            return (
              <motion.li
                key={role.id}
                className={`experience__item${
                  isCurrent ? " experience__item--current" : ""
                }`}
                variants={pick(rise(0, 28), reduced)}
                {...inView}
              >
                <span
                  className={`experience__node${
                    isCurrent ? " experience__node--pulse" : ""
                  }`}
                  aria-hidden="true"
                />

                <article className="experience__card">
                  <header className="experience__head">
                    <CompanyMark
                      company={role.company}
                      className="experience__logo"
                    />

                    <div className="experience__titles">
                      <h3 className="experience__role">
                        {role.role}
                        <span className="experience__at"> · </span>
                        {role.href ? (
                          <a
                            className="experience__company"
                            data-analytics-id={`experience-${role.id}`}
                            data-analytics-surface="experience"
                            href={role.href}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {role.company}
                          </a>
                        ) : (
                          <span className="experience__company">
                            {role.company}
                          </span>
                        )}
                      </h3>

                      {role.team && (
                        <p className="experience__team">{role.team}</p>
                      )}

                      <p className="experience__meta">
                        <time dateTime={role.start}>
                          {formatPeriod(role.start)}
                        </time>
                        <span aria-hidden="true"> – </span>
                        {role.end ? (
                          <time dateTime={role.end}>
                            {formatPeriod(role.end)}
                          </time>
                        ) : (
                          <span>Present</span>
                        )}
                        <span className="experience__dot" aria-hidden="true" />
                        <span>{formatDuration(role.start, role.end)}</span>
                        <span className="experience__dot" aria-hidden="true" />
                        <span>{role.location}</span>
                      </p>
                    </div>

                    <div className="experience__badges">
                      {isCurrent && (
                        <span className="experience__badge experience__badge--live">
                          <span
                            className="experience__live-dot"
                            aria-hidden="true"
                          />
                          Current
                        </span>
                      )}
                      <span className="experience__badge">
                        {typeLabel[role.type]}
                      </span>
                    </div>
                  </header>

                  <p className="experience__summary">{role.summary}</p>

                  {role.metrics && (
                    <motion.ul
                      className="experience__metrics"
                      variants={pick(stagger(0.07), reduced)}
                      {...inView}
                    >
                      {role.metrics.map((metric) => (
                        <motion.li
                          key={metric.label}
                          className="experience__metric"
                          variants={pick(riseChild, reduced)}
                        >
                          <span className="experience__metric-value">
                            {metric.value}
                          </span>
                          <span className="experience__metric-label">
                            {metric.label}
                          </span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}

                  <ul className="experience__highlights">
                    {role.highlights.map((highlight, i) => (
                      <li key={i} className="experience__highlight">
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <ul
                    className="experience__stack"
                    aria-label={`Technologies used at ${role.company}`}
                  >
                    {role.stack.map((tech) => (
                      <li key={tech} className="experience__chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </article>
              </motion.li>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
}
