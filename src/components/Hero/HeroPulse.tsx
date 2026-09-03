import React from "react";
import { motion } from "framer-motion";
import useGitHubActivity, { relativeTime } from "../../hooks/useGitHubActivity";
import useNowPlaying from "../../hooks/useNowPlaying";
import { pick, riseChild } from "../../utils/motion";
import scrollToSection from "../../utils/scrollToSection";
import useSound from "../../hooks/useSound";

/**
 * A one-line "human touch" under the hero actions — whichever is more
 * current between Spotify and the latest GitHub commit. Renders nothing
 * if neither has real data, rather than showing an empty state on the
 * first thing a visitor sees.
 */
export default function HeroPulse({ reduced }: { reduced: boolean }) {
  const music = useNowPlaying();
  const gh = useGitHubActivity();
  const playClick = useSound();

  const hasTrack = music.status === "ready" && music.track;
  const hasCommit = gh.status === "ready" && gh.commits.length > 0;

  if (!hasTrack && !hasCommit) return null;

  return (
    <motion.button
      type="button"
      className="hero__pulse"
      variants={pick(riseChild, reduced)}
      onClick={() => {
        playClick();
        scrollToSection("live");
      }}
      aria-label="See what I'm up to right now"
    >
      {hasTrack ? (
        <>
          <span className="hero__pulse-icon hero__pulse-icon--spotify" aria-hidden="true">
            <span className="hero__pulse-eq">
              <span />
              <span />
              <span />
            </span>
          </span>
          <span className="hero__pulse-text">
            {music.track!.isPlaying ? "Listening to " : "Last played "}
            <strong>{music.track!.title}</strong>
            {music.track!.artist ? ` — ${music.track!.artist}` : ""}
          </span>
        </>
      ) : (
        <>
          <span className="hero__pulse-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
              />
            </svg>
          </span>
          <span className="hero__pulse-text">
            Just shipped <strong>{gh.commits[0].message}</strong>
            <span className="hero__pulse-time">
              {" "}
              · {relativeTime(gh.commits[0].date)}
            </span>
          </span>
        </>
      )}
    </motion.button>
  );
}
