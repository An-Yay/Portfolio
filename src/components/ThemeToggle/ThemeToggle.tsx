import React, { useRef } from "react";
import { useApp } from "../../store/AppContext";
import useReducedMotion from "../../hooks/useReducedMotion";
import useSound from "../../hooks/useSound";
import "./ThemeToggle.scss";

/**
 * Theme toggle that uses the View Transitions API to wipe the new theme
 * out from the button. Falls back to a plain toggle where unsupported.
 */
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useApp();
  const reduced = useReducedMotion();
  const playClick = useSound();
  const ref = useRef<HTMLButtonElement>(null);

  const onClick = () => {
    playClick();

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (reduced || typeof doc.startViewTransition !== "function") {
      toggleTheme();
      return;
    }

    const rect = ref.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(() => {
      toggleTheme();
    });

    void transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 480,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      ref={ref}
      type="button"
      className="theme-toggle"
      onClick={onClick}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      data-tooltip={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="theme-toggle__sun">
          <circle cx="12" cy="12" r="4.25" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="M12 2.75v1.9M12 19.35v1.9M2.75 12h1.9M19.35 12h1.9" />
            <path d="M5.45 5.45l1.35 1.35M17.2 17.2l1.35 1.35M18.55 5.45L17.2 6.8M6.8 17.2l-1.35 1.35" />
          </g>
        </svg>
        <svg viewBox="0 0 24 24" className="theme-toggle__moon">
          <path
            d="M20.3 14.7A8.5 8.5 0 0 1 9.3 3.7a8.5 8.5 0 1 0 11 11Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  );
}
