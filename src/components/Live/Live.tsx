import React from "react";
import { motion } from "framer-motion";
import useGitHubActivity, {
  relativeTime,
} from "../../hooks/useGitHubActivity";
import useNowPlaying from "../../hooks/useNowPlaying";
import useReducedMotion from "../../hooks/useReducedMotion";
import { inView, pick, rise, stagger } from "../../utils/motion";
import SectionHeader from "../ui/SectionHeader";
import "./Live.scss";

const githubProfile = "https://github.com/An-Yay";

export default function Live() {
  const reduced = useReducedMotion();
  const gh = useGitHubActivity();
  const music = useNowPlaying();

  return (
    <section className="live" aria-labelledby="live-heading">
      <span className="section-anchor" id="live" aria-hidden="true" />

      <div className="container">
        <SectionHeader
          eyebrow="Live"
          title="What I'm up to right now."
          description="Pulled straight from GitHub and Spotify — this section is as current as the page you're looking at."
          headingId="live-heading"
        />

        <motion.div
          className="live__grid"
          variants={pick(stagger(0.1), reduced)}
          {...inView}
        >
          {/* ---- GitHub ---- */}
          <motion.article
            className="live__card live__card--github"
            variants={pick(rise(0, 24), reduced)}
          >
            <header className="live__card-head">
              <span className="live__card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
                  />
                </svg>
              </span>
              <div>
                <h3 className="live__card-title">GitHub</h3>
                <p className="live__card-sub">Recent commits</p>
              </div>
              {gh.status === "ready" && (
                <span className="live__pill" aria-hidden="true">
                  <span className="live__pill-dot" />
                  Live
                </span>
              )}
            </header>

            {gh.status === "loading" && (
              <ul className="live__feed" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="live__commit live__commit--skeleton">
                    <span className="live__skeleton live__skeleton--line" />
                    <span className="live__skeleton live__skeleton--meta" />
                  </li>
                ))}
              </ul>
            )}

            {gh.status === "ready" && gh.commits.length > 0 && (
              <ul className="live__feed">
                {gh.commits.map((commit) => (
                  <li key={commit.id} className="live__commit">
                    <a
                      className="live__commit-link"
                      href={commit.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span className="live__commit-msg">{commit.message}</span>
                      <span className="live__commit-meta">
                        <span className="live__commit-repo">{commit.repo}</span>
                        <span className="live__commit-sha">{commit.sha}</span>
                        <span className="live__commit-time">
                          {relativeTime(commit.date)}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {(gh.status === "error" ||
              (gh.status === "ready" && gh.commits.length === 0)) && (
              <p className="live__empty">
                Commit history is on{" "}
                <a href={githubProfile} target="_blank" rel="noreferrer noopener">
                  GitHub
                </a>
                .
              </p>
            )}

            <footer className="live__card-foot">
              {gh.publicRepos !== null && (
                <span className="live__stat">
                  <strong>{gh.publicRepos}</strong> repos
                </span>
              )}
              {gh.followers !== null && (
                <span className="live__stat">
                  <strong>{gh.followers}</strong> followers
                </span>
              )}
              <a
                className="live__more"
                href={githubProfile}
                target="_blank"
                rel="noreferrer noopener"
              >
                View profile
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M7 17L17 7M17 7H9M17 7v8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </footer>
          </motion.article>

          {/* ---- Spotify ---- */}
          <motion.article
            className="live__card live__card--spotify"
            variants={pick(rise(0.08, 24), reduced)}
          >
            <header className="live__card-head">
              <span className="live__card-icon live__card-icon--spotify" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.59 14.42a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 1 1-.28-1.22c3.82-.87 7.09-.5 9.72 1.11.3.18.39.57.21.86Zm1.22-2.72a.78.78 0 0 1-1.07.26c-2.69-1.66-6.79-2.14-9.98-1.17a.78.78 0 1 1-.45-1.49c3.64-1.1 8.16-.57 11.24 1.33.37.22.49.7.26 1.07Zm.11-2.84C14.8 8.94 9.4 8.76 6.3 9.7a.94.94 0 1 1-.54-1.8c3.56-1.08 9.52-.87 13.26 1.35a.94.94 0 0 1-.96 1.61Z"
                  />
                </svg>
              </span>
              <div>
                <h3 className="live__card-title">Spotify</h3>
                <p className="live__card-sub">
                  {music.status === "ready" && music.track?.isPlaying
                    ? "Now playing"
                    : "Last played"}
                </p>
              </div>
              {music.status === "ready" && music.track?.isPlaying && (
                <span className="live__equalizer" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
              )}
            </header>

            {music.status === "ready" && music.track ? (
              <a
                className="live__track"
                href={music.track.songUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="live__track-art">
                  {music.track.albumImageUrl ? (
                    <img
                      src={music.track.albumImageUrl}
                      alt={`${music.track.album ?? music.track.title} cover`}
                      loading="lazy"
                    />
                  ) : (
                    <span className="live__track-art-fallback" aria-hidden="true" />
                  )}
                </span>
                <span className="live__track-info">
                  <span className="live__track-title">{music.track.title}</span>
                  <span className="live__track-artist">{music.track.artist}</span>
                </span>
              </a>
            ) : (
              <div className="live__music-placeholder">
                <span className="live__equalizer live__equalizer--muted" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
                <p className="live__empty">
                  {music.status === "unconfigured"
                    ? "Spotify widget goes live once the now-playing endpoint is connected."
                    : music.status === "loading"
                    ? "Checking what's on…"
                    : "Nothing playing right now."}
                </p>
              </div>
            )}
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
