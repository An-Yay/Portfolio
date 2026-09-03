import { useEffect, useState } from "react";

export interface Track {
  isPlaying: boolean;
  title: string;
  artist: string;
  album?: string;
  albumImageUrl?: string;
  songUrl: string;
}

export interface NowPlayingState {
  status: "loading" | "ready" | "idle" | "unconfigured" | "error";
  track: Track | null;
}

/**
 * Reads the currently-playing (or last-played) Spotify track from a backend
 * endpoint. Spotify requires a server-held refresh token, so this expects an
 * endpoint at REACT_APP_NOWPLAYING_URL that returns a `Track` shape.
 *
 * Without that env var it reports "unconfigured" and the widget hides itself.
 * See scripts/spotify-now-playing.example.js for a ready-to-deploy handler.
 */
const ENDPOINT = process.env.REACT_APP_NOWPLAYING_URL ?? "";
const POLL_MS = 30_000;

export default function useNowPlaying(): NowPlayingState {
  const [state, setState] = useState<NowPlayingState>({
    status: ENDPOINT ? "loading" : "unconfigured",
    track: null,
  });

  useEffect(() => {
    if (!ENDPOINT) return;
    let cancelled = false;
    let timer: number;

    const load = async () => {
      try {
        const res = await fetch(ENDPOINT);
        if (!res.ok) throw new Error("now-playing endpoint error");
        const data = (await res.json()) as Partial<Track>;

        if (cancelled) return;

        if (!data || !data.title) {
          setState({ status: "idle", track: null });
        } else {
          setState({
            status: "ready",
            track: {
              isPlaying: Boolean(data.isPlaying),
              title: data.title,
              artist: data.artist ?? "",
              album: data.album,
              albumImageUrl: data.albumImageUrl,
              songUrl: data.songUrl ?? "#",
            },
          });
        }
      } catch {
        if (!cancelled) setState({ status: "error", track: null });
      }
    };

    void load();
    timer = window.setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return state;
}
