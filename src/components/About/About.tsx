import { motion } from "framer-motion";
import { awards, education, profile, stats } from "../../data/profile";
import useReducedMotion from "../../hooks/useReducedMotion";
import { inView, pick, rise, riseChild, stagger } from "../../utils/motion";
import SectionHeader from "../ui/SectionHeader";
import "./About.scss";

export default function About() {
  const reduced = useReducedMotion();

  return (
    <section className="about" aria-labelledby="about-heading">
      <span className="section-anchor" id="about" aria-hidden="true" />

      <div className="container">
        <SectionHeader
          eyebrow="About"
          title="Production AI, not demos."
          description={profile.bio}
          headingId="about-heading"
        />

        <motion.ul
          className="about__stats"
          variants={pick(stagger(0.08), reduced)}
          {...inView}
        >
          {stats.map((stat) => (
            <motion.li
              key={stat.id}
              className={`about__stat about__stat--${stat.accent}`}
              variants={pick(riseChild, reduced)}
            >
              <span className="about__stat-value">{stat.value}</span>
              <span className="about__stat-label">{stat.label}</span>
            </motion.li>
          ))}
        </motion.ul>

        <div className="about__grid">
          <motion.article
            className="about__panel"
            variants={pick(rise(0, 24), reduced)}
            {...inView}
          >
            <h3 className="about__panel-title">Education</h3>
            <ul className="about__list">
              {education.map((item) => (
                <li key={item.id} className="about__entry">
                  <div className="about__entry-head">
                    <h4 className="about__entry-title">{item.institution}</h4>
                    <span className="about__entry-score">{item.score}</span>
                  </div>
                  <p className="about__entry-detail">{item.qualification}</p>
                  <p className="about__entry-meta">
                    <time dateTime={item.start}>{item.start}</time>
                    <span aria-hidden="true"> – </span>
                    <time dateTime={item.end}>{item.end}</time>
                  </p>
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article
            className="about__panel"
            variants={pick(rise(0.08, 24), reduced)}
            {...inView}
          >
            <h3 className="about__panel-title">Awards &amp; Recognition</h3>
            <ul className="about__list">
              {awards.map((award) => (
                <li key={award.id} className="about__entry">
                  <div className="about__entry-head">
                    <h4 className="about__entry-title">{award.title}</h4>
                    {award.year && (
                      <span className="about__entry-score">{award.year}</span>
                    )}
                  </div>
                  <p className="about__entry-detail">{award.detail}</p>
                </li>
              ))}
            </ul>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
