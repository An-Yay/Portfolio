import React from "react";
import { motion } from "framer-motion";
import { experience } from "../../data/experience";
import { pick, riseChild } from "../../utils/motion";
import scrollToSection from "../../utils/scrollToSection";
import useSound from "../../hooks/useSound";
import CompanyMark from "../ui/CompanyMark";
import "./WorkedWith.scss";

/**
 * Compact "worked with" logo strip under the hero fold. Dedupes companies
 * that appear more than once in the timeline (e.g. multiple Philips roles)
 * and preserves most-recent-first order.
 */
export default function WorkedWith({ reduced }: { reduced: boolean }) {
  const playClick = useSound();

  const companies = Array.from(new Set(experience.map((role) => role.company)));

  if (companies.length === 0) return null;

  return (
    <motion.div
      className="worked-with"
      variants={pick(riseChild, reduced)}
    >
      <span className="worked-with__label">Worked with</span>
      <button
        type="button"
        className="worked-with__logos"
        onClick={() => {
          playClick();
          scrollToSection("experience");
        }}
        aria-label="See full work experience"
      >
        {companies.map((company) => (
          <span className="worked-with__logo" key={company} title={company}>
            <CompanyMark company={company} />
          </span>
        ))}
      </button>
    </motion.div>
  );
}
