import React from "react";
import { companyLogos, brandColor, monogram, slugify } from "../../utils/logos";
import "./CompanyMark.scss";

/**
 * Company logo with a graceful fallback.
 *
 * Drop an SVG or PNG into `src/assets/logos/` named after the company
 * (e.g. `philips.svg`) and it is picked up automatically. Until then a
 * tinted monogram renders in its place, so layout never depends on the
 * asset being present.
 */
export interface CompanyMarkProps {
  company: string;
  className?: string;
}

export default function CompanyMark({ company, className }: CompanyMarkProps) {
  const slug = slugify(company);
  const src = companyLogos[slug];

  if (src) {
    return (
      <img
        className={`company-mark${className ? ` ${className}` : ""}`}
        src={src}
        alt={`${company} logo`}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <span
      className={`company-mark company-mark--fallback${
        className ? ` ${className}` : ""
      }`}
      style={
        { "--mark-color": brandColor(slug) } as React.CSSProperties
      }
      role="img"
      aria-label={`${company} logo`}
    >
      {monogram(company)}
    </span>
  );
}
