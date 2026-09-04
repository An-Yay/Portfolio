import { motion } from "framer-motion";
import { skillGroups, levelLabel } from "../../data/skills";
import useReducedMotion from "../../hooks/useReducedMotion";
import { inView, pick, riseChild, stagger } from "../../utils/motion";
import SectionHeader from "../ui/SectionHeader";
import TechIcon from "../ui/TechIcon";
import "./Skills.scss";

export default function Skills() {
  const reduced = useReducedMotion();

  return (
    <section className="skills" aria-labelledby="skills-heading">
      <span className="section-anchor" id="skills" aria-hidden="true" />

      <div className="container">
        <SectionHeader
          eyebrow="Toolkit"
          title="What I reach for."
          description="Grouped by how often I actually use them, not by how impressive the list looks."
          headingId="skills-heading"
        />

        <motion.div
          className="skills__grid"
          variants={pick(stagger(0.08), reduced)}
          {...inView}
        >
          {skillGroups.map((group) => (
            <motion.article
              key={group.id}
              className="skills__group"
              variants={pick(riseChild, reduced)}
            >
              <header className="skills__group-head">
                <h3 className="skills__group-title">{group.label}</h3>
                <p className="skills__group-caption">{group.caption}</p>
              </header>

              <ul className="skills__list">
                {group.skills.map((skill) => (
                  <li
                    key={`${group.id}-${skill.name}`}
                    className={`skills__skill skills__skill--${skill.level}`}
                  >
                    <TechIcon
                      slug={skill.icon}
                      label={skill.name}
                      className="skills__icon"
                    />
                    <span className="skills__name">{skill.name}</span>
                    <span className="sr-only">
                      {" "}
                      — {levelLabel[skill.level]} proficiency
                    </span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>

        <p className="skills__legend">
          <span className="skills__legend-item skills__legend-item--core">
            Core
          </span>
          <span className="skills__legend-item skills__legend-item--strong">
            Strong
          </span>
          <span className="skills__legend-item skills__legend-item--working">
            Working knowledge
          </span>
        </p>
      </div>
    </section>
  );
}
