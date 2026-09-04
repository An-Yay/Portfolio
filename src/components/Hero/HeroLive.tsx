import { motion } from "framer-motion";
import useGitHubActivity, { relativeTime } from "../../hooks/useGitHubActivity";
import useNowPlaying from "../../hooks/useNowPlaying";
import { pick, riseChild, stagger } from "../../utils/motion";
import "./HeroLive.scss";

const githubProfile = "https://github.com/An-Yay";

/**
 * Compact live cards for the hero: a GitHub status tile and a Spotify tile,
 * stacked under the portrait. Deliberately lighter than the full Live section
 * — one line of signal each, not a full feed.
 */
export default function HeroLive({ reduced }: { reduced: boolean }) {
  const gh = useGitHubActivity();
  const music = useNowPlaying();

  const latest = gh.status === "ready" ? gh.commits[0] : undefined;
  const track = music.status === "ready" ? music.track : null;

  return (
    <motion.div
      className="hero-live"
      variants={pick(stagger(0.08, 0.1), reduced)}
    >
      {/* ---- GitHub ---- */}
      <motion.a
        className="hero-live__card"
        href={latest ? latest.url : githubProfile}
        target="_blank"
        rel="noreferrer noopener"
        variants={pick(riseChild, reduced)}
      >
        <span className="hero-live__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
            />
          </svg>
        </span>

        <span className="hero-live__body">
          <span className="hero-live__eyebrow">
            GitHub
            {gh.status === "ready" && (
              <span className="hero-live__live" aria-hidden="true">
                <span className="hero-live__live-dot" />
                Live
              </span>
            )}
          </span>
          <span className="hero-live__text">
            {gh.status === "loading" && "Loading activity…"}
            {latest && (
              <>
                Shipped <strong>{latest.message}</strong>
              </>
            )}
            {gh.status === "ready" && !latest && "Building in private repos"}
            {gh.status === "error" && "See my work on GitHub"}
          </span>
          {latest && (
            <span className="hero-live__meta">
              {latest.repo} · {relativeTime(latest.date)}
            </span>
          )}
          {gh.status === "ready" && gh.publicRepos !== null && !latest && (
            <span className="hero-live__meta">
              {gh.publicRepos} repos · {gh.followers} followers
            </span>
          )}
        </span>
      </motion.a>

      {/* ---- Spotify ---- */}
      <motion.a
        className="hero-live__card hero-live__card--spotify"
        href={track ? track.songUrl : "#"}
        target={track ? "_blank" : undefined}
        rel="noreferrer noopener"
        variants={pick(riseChild, reduced)}
        onClick={(e) => {
          if (!track) e.preventDefault();
        }}
        aria-disabled={!track}
      >
        <span className="hero-live__icon hero-live__icon--spotify" aria-hidden="true">
          {track?.albumImageUrl ? (
            <img src={track.albumImageUrl} alt="" />
          ) : (
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.59 14.42a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 1 1-.28-1.22c3.82-.87 7.09-.5 9.72 1.11.3.18.39.57.21.86Zm1.22-2.72a.78.78 0 0 1-1.07.26c-2.69-1.66-6.79-2.14-9.98-1.17a.78.78 0 1 1-.45-1.49c3.64-1.1 8.16-.57 11.24 1.33.37.22.49.7.26 1.07Zm.11-2.84C14.8 8.94 9.4 8.76 6.3 9.7a.94.94 0 1 1-.54-1.8c3.56-1.08 9.52-.87 13.26 1.35a.94.94 0 0 1-.96 1.61Z"
              />
            </svg>
          )}
        </span>

        <span className="hero-live__body">
          <span className="hero-live__eyebrow">
            Spotify
            {track?.isPlaying && (
              <span className="hero-live__eq" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            )}
          </span>
          <span className="hero-live__text">
            {track ? (
              <strong>{track.title}</strong>
            ) : music.status === "loading" ? (
              "Checking what's on…"
            ) : (
              "Not playing right now"
            )}
          </span>
          <span className="hero-live__meta">
            {track
              ? track.artist
              : music.status === "unconfigured"
              ? "Connect endpoint to go live"
              : "Spotify"}
          </span>
        </span>
      </motion.a>
    </motion.div>
  );
}
