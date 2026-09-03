import { useCallback, useEffect, useRef } from "react";
import { useApp } from "../store/AppContext";
import clickSound from "../assets/audio/clickSound.mp3";

/**
 * Click feedback that actually respects the sound toggle.
 * A single reused Audio element avoids allocating one per click.
 */
export default function useSound() {
  const { state } = useApp();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(clickSound);
    audio.volume = 0.35;
    audio.preload = "auto";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const play = useCallback(() => {
    if (!state.sounds) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    // Autoplay policies reject this until the first real user gesture.
    void audio.play().catch(() => {});
  }, [state.sounds]);

  return play;
}
