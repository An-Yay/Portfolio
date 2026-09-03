import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { profile, socials } from "../../data/profile";
import { experience } from "../../data/experience";
import useReducedMotion from "../../hooks/useReducedMotion";
import useSound from "../../hooks/useSound";
import scrollToSection from "../../utils/scrollToSection";
import { pick, rise, riseChild, scaleIn, stagger } from "../../utils/motion";
import Spotlight from "../ui/Spotlight";
import "./Hero.scss";

const avatarSrc = require(`../../assets/images/${profile.avatar}.png`);

const MAX_TILT = 12; // degrees

export default function Hero() {
  const reduced = useReducedMotion();
  const playClick = useSound();
  const ref = useRef<HTMLElement>(null);

  const current = experience.find((role) => role.end === null);

  // Gentle parallax as the hero leaves the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Interactive 3D tilt for the portrait — follows the pointer, springs back.
  const tiltX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const transform = useMotionTemplate`perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35), transparent 55%)`;

  const onPortraitMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    tiltX.set((0.5 - py) * MAX_TILT * 2);
    tiltY.set((px - 0.5) * MAX_TILT * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const onPortraitLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <section className="hero" ref={ref} aria-labelledby="hero-heading">
      <span className="section-anchor" id="hero" aria-hidden="true" />
      <Spotlight />

      <motion.div
        className="hero__inner container"
        style={reduced ? undefined : { y, opacity }}
        variants={pick(stagger(0.1, 0.1), reduced)}
        initial="hidden"
        animate="visible"
      >
        <div className="hero__text">
        {current && (
          <motion.a
            className="hero__status"
            variants={pick(riseChild, reduced)}
            href="#experience"
            onClick={(e) => {
              e.preventDefault();
              playClick();
              scrollToSection("experience");
            }}
          >
            <span className="hero__status-dot" aria-hidden="true" />
            <span className="hero__status-text">
              {current.role} at {current.company}
            </span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        )}

        <motion.h1
          className="hero__title"
          id="hero-heading"
          variants={pick(rise(0, 28), reduced)}
        >
          Turning <em>agentic AI</em> into revenue.
        </motion.h1>

        <motion.p className="hero__lede" variants={pick(riseChild, reduced)}>
          {profile.tagline}
        </motion.p>

        <motion.div className="hero__actions" variants={pick(riseChild, reduced)}>
          <button
            type="button"
            className="hero__cta hero__cta--primary"
            onClick={() => {
              playClick();
              scrollToSection("experience");
            }}
          >
            See my work
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
          </button>

          <a
            className="hero__cta hero__cta--ghost"
            href={`mailto:${profile.email}`}
            onMouseDown={playClick}
          >
            Get in touch
          </a>
        </motion.div>

        <motion.ul className="hero__socials" variants={pick(riseChild, reduced)}>
          {socials.map((social) => (
            <li key={social.id}>
              <a
                className="hero__social"
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                onMouseDown={playClick}
              >
                {social.label}
              </a>
            </li>
          ))}
        </motion.ul>
        </div>

        <motion.div
          className="hero__portrait"
          variants={pick(scaleIn(0.15), reduced)}
          onMouseMove={onPortraitMove}
          onMouseLeave={onPortraitLeave}
        >
          <span className="hero__portrait-glow" aria-hidden="true" />
          <motion.div
            className="hero__portrait-frame"
            style={reduced ? undefined : { transform }}
          >
            <img
              className="hero__avatar"
              src={avatarSrc}
              alt={`${profile.name}, ${profile.role}`}
              width={1000}
              height={1000}
              decoding="async"
            />
            <span className="hero__portrait-ring" aria-hidden="true" />
            {!reduced && (
              <motion.span
                className="hero__portrait-glare"
                style={{ background: glare }}
                aria-hidden="true"
              />
            )}
            <span className="hero__portrait-badge" aria-hidden="true">
              <span className="hero__portrait-badge-dot" />
              Available
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__scroll"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={reduced ? undefined : { opacity }}
      >
        <span className="hero__scroll-line" />
        <span className="hero__scroll-label">Scroll</span>
      </motion.div>
    </section>
  );
}
