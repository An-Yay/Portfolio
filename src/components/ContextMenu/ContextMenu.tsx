import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { profile, socials } from "../../data/profile";
import { useApp } from "../../store/AppContext";
import useReducedMotion from "../../hooks/useReducedMotion";
import useSound from "../../hooks/useSound";
import resumePdf from "../../assets/documents/Ananay_Resume.pdf";
import "./ContextMenu.scss";

interface Position {
  x: number;
  y: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  run: () => void;
}

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} fill="currentColor" />
  </svg>
);

const PALETTE =
  "M4 5h16v2H4V5Zm0 6h10v2H4v-2Zm0 6h16v2H4v-2Zm12-6 4 3-4 3v-6Z";
const MAIL =
  "M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2.2-.5 6.8 5.1L18.8 6H5.2Z";
const DOWNLOAD =
  "M12 3a1 1 0 0 1 1 1v8.6l2.3-2.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l2.3 2.3V4a1 1 0 0 1 1-1ZM5 19a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1Z";
const CODE =
  "M9.4 7.6 4.8 12l4.6 4.4-1.4 1.4L2 12l6-5.8 1.4 1.4Zm5.2 0L19.2 12l-4.6 4.4 1.4 1.4L22 12l-6-5.8-1.4 1.4Z";
const LINK =
  "M10.6 13.4a1 1 0 0 1 0-1.4l3-3a3 3 0 0 1 4.2 4.2l-1.3 1.3a1 1 0 0 1-1.4-1.4l1.3-1.3a1 1 0 0 0-1.4-1.4l-3 3a1 1 0 0 1-1.4 0Zm-1.8-2.8a1 1 0 0 1 1.4 1.4l-3 3a1 1 0 0 0 1.4 1.4l1.3-1.3a1 1 0 0 1 1.4 1.4l-1.3 1.3a3 3 0 0 1-4.2-4.2Z";

const MENU_W = 220;
const sourceUrl = "https://github.com/An-Yay/Portfolio";

const toastStyle = {
  border: "1px solid var(--border-subtle)",
  borderRadius: "14px",
  background: "var(--bg-elevated)",
  color: "var(--text-primary)",
  fontFamily: "var(--font-sans)",
  fontSize: "14px",
  boxShadow: "var(--shadow-lg)",
};

export default function ContextMenu() {
  const { openPalette } = useApp();
  const reduced = useReducedMotion();
  const playClick = useSound();

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const notify = (message: string, icon: string) =>
    toast(message, { icon, position: "bottom-center", style: toastStyle });

  const items: MenuItem[] = [
    {
      id: "palette",
      label: "Command palette",
      icon: <Icon d={PALETTE} />,
      run: openPalette,
    },
    {
      id: "email",
      label: "Copy email",
      icon: <Icon d={MAIL} />,
      run: () => {
        void navigator.clipboard.writeText(profile.email);
        notify("Email copied", "📧");
      },
    },
    {
      id: "resume",
      label: "Download resume",
      icon: <Icon d={DOWNLOAD} />,
      run: () => {
        const a = document.createElement("a");
        a.href = resumePdf;
        a.download = profile.resumeFileName;
        a.click();
      },
    },
    {
      id: "source",
      label: "View source",
      icon: <Icon d={CODE} />,
      run: () => window.open(sourceUrl, "_blank", "noopener,noreferrer"),
    },
  ];

  const links: MenuItem[] = socials
    .filter((s) => s.id === "github" || s.id === "linkedin")
    .map((social) => ({
      id: social.id,
      label: social.label,
      icon: <Icon d={LINK} />,
      run: () => window.open(social.href, "_blank", "noopener,noreferrer"),
    }));

  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      // Let native menu through on inputs so text editing still works.
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, [contenteditable='true']")) return;

      e.preventDefault();

      const menuH = 320;
      const x = Math.min(e.clientX, window.innerWidth - MENU_W - 8);
      const y = Math.min(e.clientY, window.innerHeight - menuH - 8);
      setPos({ x: Math.max(8, x), y: Math.max(8, y) });
      setOpen(true);
    };

    const onScroll = () => close();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("contextmenu", onContext);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("contextmenu", onContext);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  // Focus the first item when the menu opens for keyboard access.
  useEffect(() => {
    if (open) {
      const first = menuRef.current?.querySelector<HTMLElement>("button");
      first?.focus();
    }
  }, [open]);

  const run = (item: MenuItem) => {
    playClick();
    close();
    requestAnimationFrame(() => item.run());
  };

  const renderItem = (item: MenuItem) => (
    <button
      key={item.id}
      type="button"
      role="menuitem"
      className="context-menu__item"
      onClick={() => run(item)}
    >
      <span className="context-menu__icon">{item.icon}</span>
      {item.label}
    </button>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="context-menu__catch" onPointerDown={close} />
          <motion.div
            ref={menuRef}
            className="context-menu"
            role="menu"
            aria-label="Quick actions"
            style={{ left: pos.x, top: pos.y }}
            initial={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: -4 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={
              reduced
                ? { duration: 0.12 }
                : { duration: 0.16, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <p className="context-menu__label">Actions</p>
            {items.map(renderItem)}
            <div className="context-menu__divider" role="separator" />
            <p className="context-menu__label">Connect</p>
            {links.map(renderItem)}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
