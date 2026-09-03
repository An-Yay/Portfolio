import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { navItems } from "../../data/navigation";
import { profile, socials } from "../../data/profile";
import { useApp } from "../../store/AppContext";
import useReducedMotion from "../../hooks/useReducedMotion";
import useSound from "../../hooks/useSound";
import scrollToSection from "../../utils/scrollToSection";
import resumePdf from "../../assets/documents/Ananay_Resume.pdf";
import "./CommandPalette.scss";

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Actions" | "Links";
  keywords: string;
  icon: React.ReactNode;
  run: () => void;
}

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} fill="currentColor" />
  </svg>
);

const ARROW =
  "M12 4a1 1 0 0 1 1 1v10.59l4.3-4.3a1 1 0 0 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 1.4-1.42l4.3 4.3V5a1 1 0 0 1 1-1Z";
const SUN =
  "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-14a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1Zm0 16a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1ZM4 11h1a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2Zm15 0h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2Z";
const MAIL =
  "M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2.2-.5 6.8 5.1L18.8 6H5.2Z";
const DOWNLOAD =
  "M12 3a1 1 0 0 1 1 1v8.6l2.3-2.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l2.3 2.3V4a1 1 0 0 1 1-1ZM5 19a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1Z";
const LINK =
  "M10.6 13.4a1 1 0 0 1 0-1.4l3-3a3 3 0 0 1 4.2 4.2l-1.3 1.3a1 1 0 0 1-1.4-1.4l1.3-1.3a1 1 0 0 0-1.4-1.4l-3 3a1 1 0 0 1-1.4 0Zm-1.8-2.8a1 1 0 0 1 1.4 1.4l-3 3a1 1 0 0 0 1.4 1.4l1.3-1.3a1 1 0 0 1 1.4 1.4l-1.3 1.3a3 3 0 0 1-4.2-4.2Z";
const SOUND =
  "M13 5.5v13a1 1 0 0 1-1.6.8L7.3 16H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.3l4.1-3.3a1 1 0 0 1 1.6.8Zm4.5 2.1a1 1 0 0 1 1.4.1A6.5 6.5 0 0 1 19 16.3a1 1 0 0 1-1.5-1.3 4.5 4.5 0 0 0 0-6 1 1 0 0 1 .1-1.4Z";

export default function CommandPalette() {
  const { state, closePalette, togglePalette, toggleTheme, toggleSounds, isDark } =
    useApp();
  const reduced = useReducedMotion();
  const playClick = useSound();

  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const notify = useCallback(
    (message: string, icon: string) => {
      toast(message, {
        icon,
        position: "bottom-center",
        style: {
          border: "1px solid var(--border-subtle)",
          borderRadius: "14px",
          background: "var(--bg-elevated)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          boxShadow: "var(--shadow-lg)",
        },
      });
    },
    []
  );

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = navItems.map((item) => ({
      id: `go-${item.id}`,
      label: `Go to ${item.label}`,
      group: "Navigate",
      keywords: `${item.label} section jump scroll`,
      icon: <Icon d={ARROW} />,
      run: () => scrollToSection(item.id),
    }));

    const actions: Command[] = [
      {
        id: "theme",
        label: isDark ? "Switch to light mode" : "Switch to dark mode",
        hint: "Theme",
        group: "Actions",
        keywords: "theme dark light appearance colour color mode",
        icon: <Icon d={SUN} />,
        run: toggleTheme,
      },
      {
        id: "sounds",
        label: state.sounds ? "Mute click sounds" : "Unmute click sounds",
        hint: "Audio",
        group: "Actions",
        keywords: "sound audio mute volume click",
        icon: <Icon d={SOUND} />,
        run: toggleSounds,
      },
      {
        id: "email",
        label: "Copy email address",
        hint: profile.email,
        group: "Actions",
        keywords: "email mail copy contact reach",
        icon: <Icon d={MAIL} />,
        run: () => {
          void navigator.clipboard.writeText(profile.email);
          notify("Email copied", "📧");
        },
      },
      {
        id: "resume",
        label: "Download resume",
        hint: "PDF",
        group: "Actions",
        keywords: "resume cv download pdf hire",
        icon: <Icon d={DOWNLOAD} />,
        run: () => {
          const a = document.createElement("a");
          a.href = resumePdf;
          a.download = profile.resumeFileName;
          a.click();
        },
      },
    ];

    const links: Command[] = socials.map((social) => ({
      id: `link-${social.id}`,
      label: `Open ${social.label}`,
      hint: social.handle,
      group: "Links",
      keywords: `${social.label} ${social.handle} profile social open`,
      icon: <Icon d={LINK} />,
      run: () => window.open(social.href, "_blank", "noopener,noreferrer"),
    }));

    return [...nav, ...actions, ...links];
  }, [isDark, state.sounds, toggleTheme, toggleSounds, notify]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.keywords}`.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const grouped = useMemo(() => {
    const order: Command["group"][] = ["Navigate", "Actions", "Links"];
    return order
      .map((group) => ({
        group,
        items: results.filter((c) => c.group === group),
      }))
      .filter((g) => g.items.length > 0);
  }, [results]);

  // Global ⌘K / Ctrl+K shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        togglePalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePalette]);

  // Reset and focus on open; restore focus to the trigger on close.
  useEffect(() => {
    if (state.paletteOpen) {
      restoreFocusRef.current = document.activeElement as HTMLElement;
      setQuery("");
      setIndex(0);
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        cancelAnimationFrame(raf);
        document.body.style.overflow = previous;
        restoreFocusRef.current?.focus?.();
      };
    }
  }, [state.paletteOpen]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  // Keep the highlighted row in view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[data-selected="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const execute = useCallback(
    (command: Command) => {
      playClick();
      closePalette();
      // Let the exit animation start before the action moves the page.
      requestAnimationFrame(() => command.run());
    },
    [closePalette, playClick]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const command = results[index];
      if (command) execute(command);
    }
  };

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {state.paletteOpen && (
        <div className="palette" role="presentation">
          <motion.div
            className="palette__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closePalette}
          />

          <motion.div
            className="palette__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -6 }}
            transition={
              reduced
                ? { duration: 0.15 }
                : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
            }
            onKeyDown={onKeyDown}
          >
            <div className="palette__search">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="palette__search-icon">
                <path
                  d="M10.5 3a7.5 7.5 0 1 0 4.72 13.34l3.72 3.72a1 1 0 0 0 1.42-1.42l-3.72-3.72A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
                  fill="currentColor"
                />
              </svg>
              <input
                ref={inputRef}
                className="palette__input"
                type="text"
                placeholder="Search sections, actions, links…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search commands"
                aria-controls="palette-results"
                aria-activedescendant={
                  results[index] ? `palette-option-${results[index].id}` : undefined
                }
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="palette__esc">esc</kbd>
            </div>

            <div
              className="palette__results"
              id="palette-results"
              role="listbox"
              aria-label="Commands"
              ref={listRef}
            >
              {grouped.length === 0 && (
                <p className="palette__empty">
                  No matches for “{query}”
                </p>
              )}

              {grouped.map((group) => (
                <div className="palette__group" key={group.group}>
                  <p className="palette__group-label">{group.group}</p>
                  {group.items.map((command) => {
                    flatIndex += 1;
                    const selected = flatIndex === index;
                    const optionIndex = flatIndex;
                    return (
                      <button
                        key={command.id}
                        id={`palette-option-${command.id}`}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        data-selected={selected}
                        className={`palette__option${selected ? " is-selected" : ""}`}
                        onMouseMove={() => setIndex(optionIndex)}
                        onClick={() => execute(command)}
                      >
                        <span className="palette__option-icon">{command.icon}</span>
                        <span className="palette__option-label">{command.label}</span>
                        {command.hint && (
                          <span className="palette__option-hint">{command.hint}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <footer className="palette__footer">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> select
              </span>
              <span>
                <kbd>⌘</kbd>
                <kbd>K</kbd> toggle
              </span>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
