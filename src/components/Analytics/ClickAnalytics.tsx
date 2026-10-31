import { useEffect } from "react";
import { track } from "@vercel/analytics/react";

const SAFE_TOKEN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TOKEN_LENGTH = 64;

const isSafeToken = (value: string) =>
  value.length <= MAX_TOKEN_LENGTH && SAFE_TOKEN.test(value);

/**
 * Tracks a named interaction without reading DOM text, URLs, or form values.
 * Keep control and surface values stable, lowercase, and hyphenated.
 */
export const trackInteraction = (control: string, surface: string) => {
  if (!isSafeToken(control) || !isSafeToken(surface)) return;

  track("Portfolio Click", { control, surface });
};

/**
 * Captures only controls explicitly opted in with data-analytics attributes.
 * This intentionally avoids broad auto-capture so personal form data and
 * destination URLs can never become event properties.
 */
export default function ClickAnalytics() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const target = event.target.closest<HTMLElement>("[data-analytics-id]");
      if (!target) return;

      const control = target.dataset.analyticsId;
      const surface = target.dataset.analyticsSurface;
      if (!control || !surface) return;

      trackInteraction(control, surface);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
