import { navItems } from "../../data/navigation";
import { profile, socials } from "../../data/profile";
import useSound from "../../hooks/useSound";
import scrollToSection from "../../utils/scrollToSection";
import "./Footer.scss";

export default function Footer() {
  const playClick = useSound();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <p className="footer__name">{profile.name}</p>
          <p className="footer__role">{profile.role}</p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="footer__link"
                  data-analytics-id={`nav-${item.id}`}
                  data-analytics-surface="footer"
                  onClick={() => {
                    playClick();
                    scrollToSection(item.id);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="footer__socials">
          {socials.map((social) => (
            <li key={social.id}>
              <a
                className="footer__link"
                data-analytics-id={`social-${social.id}`}
                data-analytics-surface="footer"
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                onMouseDown={playClick}
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container footer__base">
        <p>
          © {year} {profile.name}. Built with React, TypeScript, and Framer
          Motion.
        </p>
        <p className="footer__hint">
          Press <kbd>⌘</kbd>
          <kbd>K</kbd> to jump anywhere
        </p>
      </div>
    </footer>
  );
}
