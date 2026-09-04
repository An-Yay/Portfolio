import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navItems, sectionIds } from "../../data/navigation";
import { profile } from "../../data/profile";
import { useApp } from "../../store/AppContext";
import useActiveSection from "../../hooks/useActiveSection";
import useReducedMotion from "../../hooks/useReducedMotion";
import useSound from "../../hooks/useSound";
import scrollToSection from "../../utils/scrollToSection";
import "./Navbar.scss";

export default function Navbar() {
  const { state, toggleMenu, closeMenu, openPalette } = useApp();
  const active = useActiveSection(sectionIds);
  const reduced = useReducedMotion();
  const playClick = useSound();

  const go = (id: string) => {
    playClick();
    closeMenu();
    scrollToSection(id);
  };

  // Lock scroll and allow Escape to dismiss while the mobile sheet is open.
  useEffect(() => {
    if (!state.menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [state.menuOpen, closeMenu]);

  return (
    <>
      {/*
        `.nav` only handles fixed positioning + centring (translateX(-50%)).
        Framer Motion writes its own inline `transform` on whatever element
        it animates, which would silently overwrite that centring transform.
        So the entrance animation lives on a plain child instead.
      */}
      <header className="nav">
        <motion.div
          className="nav__animate"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
        <nav className="nav__inner" aria-label="Primary">
          <button
            type="button"
            className="nav__brand"
            onClick={() => go("hero")}
            aria-label={`${profile.name} — back to top`}
          >
            <span className="nav__brand-mark" aria-hidden="true">
              AG
            </span>
          </button>

          <ul className="nav__list">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`nav__link${isActive ? " is-active" : ""}`}
                    onClick={() => go(item.id)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {isActive && (
                      <motion.span
                        className="nav__pill"
                        layoutId="nav-pill"
                        transition={
                          reduced
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 380, damping: 32 }
                        }
                        aria-hidden="true"
                      />
                    )}
                    <span className="nav__link-text">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="nav__actions">
            <button
              type="button"
              className="nav__command"
              onClick={() => {
                playClick();
                openPalette();
              }}
              aria-label="Open command palette"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="nav__search-icon">
                <path
                  d="M10.5 3a7.5 7.5 0 1 0 4.72 13.34l3.72 3.72a1 1 0 0 0 1.42-1.42l-3.72-3.72A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
                  fill="currentColor"
                />
              </svg>
              <span className="nav__command-label">Search</span>
              <kbd className="nav__kbd">⌘K</kbd>
            </button>

            <button
              type="button"
              className="nav__menu-toggle"
              onClick={() => {
                playClick();
                toggleMenu();
              }}
              aria-expanded={state.menuOpen}
              aria-controls="mobile-menu"
              aria-label={state.menuOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`nav__burger${state.menuOpen ? " is-open" : ""}`}
                aria-hidden="true"
              >
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>
        </motion.div>
      </header>

      <AnimatePresence>
        {state.menuOpen && (
          <>
            <motion.div
              className="nav__scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />
            <motion.div
              className="nav__sheet"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={reduced ? { opacity: 0 } : { y: "100%" }}
              animate={reduced ? { opacity: 1 } : { y: 0 }}
              exit={reduced ? { opacity: 0 } : { y: "100%" }}
              transition={
                reduced
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 320, damping: 34 }
              }
            >
              <div className="nav__sheet-grip" aria-hidden="true" />
              <ul className="nav__sheet-list">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`nav__sheet-link${
                        active === item.id ? " is-active" : ""
                      }`}
                      onClick={() => go(item.id)}
                      aria-current={active === item.id ? "true" : undefined}
                    >
                      {item.label}
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="nav__sheet-arrow"
                      >
                        <path
                          d="M9 6l6 6-6 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              <a
                className="nav__sheet-cta"
                href={`mailto:${profile.email}`}
                onClick={closeMenu}
              >
                Get in touch
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
