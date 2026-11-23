import { useEffect } from "react";
import { createPortal } from "react-dom";
import { prefersReducedMotion } from "../lib/effects";
import { sound } from "../lib/sound";

/**
 * Tiny amber ring + sparkles at every touch point. It listens at document
 * level, ignores nothing already marked with its own sound, and throttles the
 * whole effect to one per 80ms for low-end phones.
 */
export function TapFeedback() {
  useEffect(() => {
    let last = 0;
    const onPointerDown = (event: PointerEvent) => {
      const now = performance.now();
      if (now - last < 80) return;
      last = now;
      const target = event.target as Element | null;
      const hasOwnSound = Boolean(target?.closest('[data-own-sound="true"]'));
      if (!hasOwnSound) sound.play("tick");

      const layer = document.getElementById("tap-feedback-layer");
      if (!layer) return;
      const ring = document.createElement("span");
      ring.className = "tap-ring";
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
      layer.appendChild(ring);
      window.setTimeout(() => ring.remove(), 520);

      if (!prefersReducedMotion()) {
        const glyphs = ["✦", "✧", "✦"];
        glyphs.forEach((glyph, index) => {
          const spark = document.createElement("span");
          spark.className = "tap-spark";
          spark.textContent = glyph;
          spark.style.left = `${event.clientX}px`;
          spark.style.top = `${event.clientY}px`;
          spark.style.setProperty("--tx", `${(index - 1) * 17}px`);
          spark.style.setProperty("--ty", `${-18 - index * 7}px`);
          layer.appendChild(spark);
          window.setTimeout(() => spark.remove(), 520);
        });
      }
    };
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return createPortal(
    <div id="tap-feedback-layer" className="tap-feedback-layer" aria-hidden="true" />,
    document.body,
  );
}
