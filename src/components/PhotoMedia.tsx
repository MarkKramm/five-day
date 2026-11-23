import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { PhotoConfig } from "../types";

interface PhotoMediaProps {
  photo: PhotoConfig;
  tone: "warm" | "none";
  reveal?: number;
  lazy?: boolean;
  className?: string;
}

function finalFilter(tone: "warm" | "none"): string {
  return tone === "warm"
    ? "sepia(0.12) saturate(1.06) contrast(1.03) brightness(1.02)"
    : "none";
}

/**
 * The reveal interpolation makes the developing photo emerge smoothly while
 * the knob moves, rather than jumping only when a stroke completes.
 */
function revealFilter(tone: "warm" | "none", reveal: number): string {
  const t = Math.max(0, Math.min(1, reveal));
  if (t >= 1) return finalFilter(tone);
  const finalSepia = tone === "warm" ? 0.12 : 0;
  const finalSaturate = tone === "warm" ? 1.06 : 1;
  const finalContrast = tone === "warm" ? 1.03 : 1;
  const finalBrightness = tone === "warm" ? 1.02 : 1;
  const sepia = 0.35 + (finalSepia - 0.35) * t;
  const saturate = 0.32 + (finalSaturate - 0.32) * t;
  const contrast = 0.9 + (finalContrast - 0.9) * t;
  const brightness = 1.6 + (finalBrightness - 1.6) * t;
  const blur = 10 * (1 - t);
  return `sepia(${sepia.toFixed(3)}) saturate(${saturate.toFixed(3)}) contrast(${contrast.toFixed(3)}) brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`;
}

export function PhotoMedia({
  photo,
  tone,
  reveal = 1,
  lazy = false,
  className = "",
}: PhotoMediaProps) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [photo.src]);

  const t = Math.max(0, Math.min(1, reveal));
  const warmOverlay = tone === "warm" ? 0.1 : 0;
  const style: CSSProperties = {
    opacity: t <= 0 ? 0 : Math.min(1, t * 1.9),
    filter: revealFilter(tone, t),
    transition: "opacity 90ms linear, filter 110ms linear",
  };

  return (
    <div className={`photo-media ${className}`}>
      {broken ? (
        <div className="photo-placeholder" style={{ opacity: style.opacity }} role="img" aria-label="Photo placeholder">
          <span aria-hidden="true">📷</span>
        </div>
      ) : (
        <img
          key={photo.src}
          src={photo.src}
          alt={reveal >= 0.99 ? photo.caption : ""}
          draggable={false}
          loading={lazy ? "lazy" : "eager"}
          decoding="async"
          onError={() => setBroken(true)}
          style={{
            objectPosition: photo.focus,
            filter: style.filter,
            opacity: style.opacity,
          }}
        />
      )}
      {tone === "warm" && (
        <span
          className="photo-warmth"
          aria-hidden="true"
          style={{ opacity: warmOverlay * Math.max(0.35, t), mixBlendMode: "soft-light" }}
        />
      )}
      {t < 0.98 && (
        <span
          className="develop-wash"
          aria-hidden="true"
          style={{ opacity: Math.max(0, (1 - t) * 0.5) }}
        />
      )}
    </div>
  );
}
