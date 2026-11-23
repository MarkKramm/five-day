import { EFFECTS } from "../constants";
import type { EffectConfig } from "../types";

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function particleCount(effect: EffectConfig, override?: number): number {
  let count = override ?? effect.count;
  try {
    if ((navigator.hardwareConcurrency || 8) <= EFFECTS.lowEndCoreCount) count = Math.ceil(count / 2);
  } catch {
    // Keep the count.
  }
  return Math.max(0, Math.min(EFFECTS.particleCap, Math.floor(count)));
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * One tiny DOM particle system for every effect.
 * Only transform and opacity are animated; nodes remove themselves.
 */
export function playEffect(
  container: HTMLElement | null,
  effect: EffectConfig,
  overrideCount?: number,
): void {
  if (!container || prefersReducedMotion() || document.hidden) return;
  const count = particleCount(effect, overrideCount);
  if (count <= 0) return;
  const width = container.clientWidth || 260;
  const height = container.clientHeight || 320;
  const emojis = effect.emojis.length ? effect.emojis : ["✨"];

  for (let index = 0; index < count; index += 1) {
    const dot = document.createElement("span");
    dot.className = "effect-particle";
    dot.textContent = emojis[Math.floor(Math.random() * emojis.length)] ?? "✨";
    dot.style.fontSize = `${randomBetween(14, 28)}px`;
    dot.style.left = `${randomBetween(6, 94)}%`;
    dot.style.top = `${randomBetween(14, 86)}%`;

    const driftX = randomBetween(-26, 26);
    const driftY = randomBetween(-26, 26);
    let frames: Keyframe[];

    if (effect.motion === "rise") {
      frames = [
        { transform: "translate3d(0, 0, 0) scale(.7)", opacity: 0 },
        { opacity: 0.9, offset: 0.18 },
        {
          transform: `translate3d(${randomBetween(-28, 28)}px, ${-height * randomBetween(0.65, 1.1)}px, 0) rotate(${randomBetween(-30, 30)}deg) scale(1)`,
          opacity: 0,
        },
      ];
    } else if (effect.motion === "fall") {
      dot.style.top = `${randomBetween(-22, -2)}px`;
      frames = [
        { transform: "translate3d(0, 0, 0) rotate(0deg)", opacity: 0 },
        { opacity: 0.9, offset: 0.15 },
        {
          transform: `translate3d(${randomBetween(-34, 34)}px, ${height * randomBetween(0.9, 1.25)}px, 0) rotate(${randomBetween(-70, 70)}deg)`,
          opacity: 0,
        },
      ];
    } else if (effect.motion === "burst") {
      const angle = Math.random() * Math.PI * 2;
      const distance = randomBetween(width * 0.25, width * 0.72);
      frames = [
        { transform: "translate3d(0, 0, 0) scale(.4)", opacity: 0 },
        { opacity: 1, offset: 0.12 },
        {
          transform: `translate3d(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance - 10}px, 0) rotate(${randomBetween(-80, 80)}deg) scale(1)`,
          opacity: 0,
        },
      ];
    } else {
      frames = [
        { transform: "translate3d(0, 0, 0) scale(.55)", opacity: 0 },
        {
          transform: `translate3d(${driftX}px, ${driftY}px, 0) scale(.9)`,
          opacity: 0.85,
          offset: 0.3,
        },
        {
          transform: `translate3d(${-driftX * 1.4}px, ${-driftY * 1.3}px, 0) scale(1)`,
          opacity: 0.6,
          offset: 0.65,
        },
        {
          transform: `translate3d(${driftX * 1.7}px, ${-driftY}px, 0) scale(.8)`,
          opacity: 0,
        },
      ];
    }

    container.appendChild(dot);
    try {
      const animation = dot.animate(frames, {
        duration: randomBetween(1500, 3000),
        delay: randomBetween(0, 320),
        easing: effect.motion === "drift" ? "ease-in-out" : "cubic-bezier(.22,.61,.36,1)",
        fill: "both",
      });
      animation.onfinish = () => dot.remove();
      animation.oncancel = () => dot.remove();
    } catch {
      dot.remove();
    }
  }
}
