import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { CloseIcon } from "../components/Icons";
import { Polaroid } from "../components/Polaroid";
import type { DayConfig, DayProgress } from "../types";
import { useTexts } from "../lib/texts";

interface AlbumViewerProps {
  day: DayConfig;
  progress: DayProgress;
  tone: "warm" | "none";
  initialRank: number;
  onClose: () => void;
}

export function AlbumViewer({ day, progress, tone, initialRank, onClose }: AlbumViewerProps) {
  const texts = useTexts();
  const photos = useMemo(
    () =>
      day.photos
        .filter((photo) => progress.kept.includes(photo.rank))
        .sort((a, b) => b.rank - a.rank),
    [day.photos, progress.kept],
  );
  const initialIndex = Math.max(
    0,
    photos.findIndex((photo) => photo.rank === initialRank),
  );
  const [index, setIndex] = useState(initialIndex);
  const [rotation, setRotation] = useState(0);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const photo = photos[Math.min(index, photos.length - 1)];

  if (!photo) return null;

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Optional.
    }
  };

  const pointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    pointer.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      // Swipe right turns the card right (+180°), swipe left turns it left.
      setRotation((current) => current + (dx > 0 ? 180 : -180));
    } else if (Math.abs(dy) > 50 && Math.abs(dy) > Math.abs(dx)) {
      const direction = dy < 0 ? 1 : -1;
      setIndex((current) => Math.max(0, Math.min(photos.length - 1, current + direction)));
      setRotation(0);
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      setRotation((current) => current + 180);
    }
  };

  return (
    <div className="album-viewer" role="dialog" aria-modal="true" aria-label="Enlarged photo">
      <div className="album-viewer__scrim" aria-hidden="true" />
      <button type="button" className="album-viewer__close" aria-label="Close photo" onClick={onClose}>
        <CloseIcon />
      </button>
      <div
        className="viewer-card-wrap"
        onPointerDown={pointerDown}
        onPointerUp={pointerUp}
        onPointerCancel={() => (pointer.current = null)}
        onContextMenu={(event) => event.preventDefault()}
      >
        <Polaroid
          photo={photo}
          tone={tone}
          dayId={day.id}
          dateLabel={day.dateLabel}
          rotation={rotation}
          showRays={photo.rank === 1}
          showSticker
        />
      </div>
      <p className="viewer-hint">{texts.viewerHint}</p>
    </div>
  );
}
