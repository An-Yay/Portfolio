import { motion } from "framer-motion";
import useReducedMotion from "../../hooks/useReducedMotion";
import { inView, pick, rise, riseChild, stagger } from "../../utils/motion";
import "./SectionHeader.scss";

export interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  headingId?: string;
  align?: "start" | "center";
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  headingId,
  align = "start",
}: SectionHeaderProps) {
  const reduced = useReducedMotion();

  return (
    <motion.header
      className={`section-header section-header--${align}`}
      variants={pick(stagger(0.09), reduced)}
      {...inView}
    >
      <motion.p
        className="section-header__eyebrow"
        variants={pick(riseChild, reduced)}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="section-header__title"
        id={headingId}
        variants={pick(rise(0, 24), reduced)}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          className="section-header__description"
          variants={pick(riseChild, reduced)}
        >
          {description}
        </motion.p>
      )}
    </motion.header>
  );
}
