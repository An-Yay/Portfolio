import { useState } from "react";
import "./TechIcon.scss";

/**
 * Technology icon backed by Simple Icons via jsDelivr.
 *
 * Using the CDN avoids committing ~40 logo files and keeps the bundle lean.
 * If a slug doesn't exist upstream, we fall back to a monogram tile so the
 * grid never shows a broken image.
 *
 * To self-host later: `npm i simple-icons` and swap the `src` for a local
 * import. The component API stays the same.
 */

const CDN = "https://cdn.jsdelivr.net/npm/simple-icons@13/icons";

export interface TechIconProps {
  slug: string;
  label: string;
  className?: string;
}

export default function TechIcon({ slug, label, className }: TechIconProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`tech-icon tech-icon--fallback${
          className ? ` ${className}` : ""
        }`}
        aria-hidden="true"
      >
        {label.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      className={`tech-icon${className ? ` ${className}` : ""}`}
      src={`${CDN}/${slug}.svg`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      width={20}
      height={20}
      onError={() => setFailed(true)}
    />
  );
}
