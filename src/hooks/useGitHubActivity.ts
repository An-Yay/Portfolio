import { useEffect, useState } from "react";

export interface CommitActivity {
  id: string;
  repo: string;
  repoUrl: string;
  message: string;
  sha: string;
  url: string;
  date: string;
}

export interface GitHubState {
  status: "loading" | "ready" | "error";
  commits: CommitActivity[];
  publicRepos: number | null;
  followers: number | null;
}

const USERNAME = "An-Yay";
const CACHE_KEY = "ananay.gh.cache.v1";
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

interface Cache {
  at: number;
  data: Omit<GitHubState, "status">;
}

function readCache(): Cache | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cache;
    if (Date.now() - parsed.at > CACHE_TTL) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Pulls recent public push activity and profile counts from the GitHub REST
 * API. No token needed for public data (60 req/hr, cached for 30 min here).
 * Fails soft: on any error the component shows a static fallback.
 */
export default function useGitHubActivity(): GitHubState {
  const [state, setState] = useState<GitHubState>({
    status: "loading",
    commits: [],
    publicRepos: null,
    followers: null,
  });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const cached = readCache();
    if (cached) {
      setState({ status: "ready", ...cached.data });
      return;
    }

    const load = async () => {
      try {
        const [userRes, eventsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`, {
            signal: controller.signal,
          }),
          fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=30`, {
            signal: controller.signal,
          }),
        ]);

        if (!userRes.ok || !eventsRes.ok) throw new Error("GitHub API error");

        const user = await userRes.json();
        const events = await eventsRes.json();

        const commits: CommitActivity[] = [];
        for (const event of events) {
          if (event.type !== "PushEvent" || !event.payload?.commits) continue;
          const repo = event.repo?.name ?? "";
          for (const c of event.payload.commits.slice().reverse()) {
            commits.push({
              id: `${event.id}-${c.sha}`,
              repo: repo.split("/")[1] ?? repo,
              repoUrl: `https://github.com/${repo}`,
              message: c.message.split("\n")[0],
              sha: c.sha.slice(0, 7),
              url: `https://github.com/${repo}/commit/${c.sha}`,
              date: event.created_at,
            });
            if (commits.length >= 6) break;
          }
          if (commits.length >= 6) break;
        }

        const data = {
          commits,
          publicRepos: user.public_repos ?? null,
          followers: user.followers ?? null,
        };

        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ at: Date.now(), data } as Cache)
          );
        } catch {
          /* storage full/blocked — non-fatal */
        }

        if (!cancelled) setState({ status: "ready", ...data });
      } catch {
        if (!cancelled)
          setState((s) => ({ ...s, status: "error" }));
      }
    };

    void load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return state;
}

/** "3h ago" style relative time. */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const secs = Math.max(1, Math.round((now.getTime() - then) / 1000));
  const mins = Math.round(secs / 60);
  const hours = Math.round(mins / 60);
  const days = Math.round(hours / 24);
  if (secs < 60) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
