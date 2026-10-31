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
 * endpoint. Polling pauses in background tabs and in-flight requests are
 * cancelled so this optional widget does not waste bandwidth.
 */
const ENDPOINT = import.meta.env.VITE_NOWPLAYING_URL ?? "";
const POLL_MS = 30_000;

export default function useNowPlaying(): NowPlayingState {
  const [state, setState] = useState<NowPlayingState>({
    status: ENDPOINT ? "loading" : "unconfigured",
    track: null,
  });

  useEffect(() => {
    if (!ENDPOINT) return;

    let cancelled = false;
    let timer: number | undefined;
    let controller: AbortController | undefined;

    const stop = () => {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
      controller?.abort();
      controller = undefined;
    };

    const load = async () => {
      if (controller) return;
      const requestController = new AbortController();
      controller = requestController;

      try {
        const res = await fetch(ENDPOINT, { signal: requestController.signal });
        if (!res.ok) throw new Error("now-playing endpoint error");
        const data = (await res.json()) as Partial<Track>;
        if (cancelled) return;

        if (!data.title) {
          setState({ status: "idle", track: null });
          return;
        }

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
      } catch (error) {
        if (
          !cancelled &&
          !(error instanceof DOMException && error.name === "AbortError")
        ) {
          setState({ status: "error", track: null });
        }
      } finally {
        if (controller === requestController) controller = undefined;
      }
    };

    const start = () => {
      stop();
      if (document.visibilityState !== "visible") return;
      void load();
      timer = window.setInterval(() => void load(), POLL_MS);
    };

    const onVisibilityChange = () => start();
    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return state;
}
