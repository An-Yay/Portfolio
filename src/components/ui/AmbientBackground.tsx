import "./AmbientBackground.scss";

/**
 * Fixed, non-interactive backdrop behind the whole page.
 *
 * Three slowly drifting colour blobs over a faint grid. Pure CSS animation
 * so it costs nothing on the main thread, and it fully stops under
 * `prefers-reduced-motion`. Sits below all content (z-index handled in CSS).
 */
export default function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__grid" />
      <div className="ambient__blob ambient__blob--1" />
      <div className="ambient__blob ambient__blob--2" />
      <div className="ambient__blob ambient__blob--3" />
    </div>
  );
}
