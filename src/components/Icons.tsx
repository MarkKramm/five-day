export function AlbumIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* cover + stitched spine */}
      <rect x="4.4" y="2.8" width="17.2" height="18.8" rx="2.9" />
      <path d="M8.5 3.1v18.2" opacity=".42" strokeWidth="1.1" />
      <circle cx="6.5" cy="7.6" r=".55" fill="currentColor" stroke="none" opacity=".5" />
      <circle cx="6.5" cy="11.6" r=".55" fill="currentColor" stroke="none" opacity=".5" />
      <circle cx="6.5" cy="15.6" r=".55" fill="currentColor" stroke="none" opacity=".5" />

      {/* a print tucked into the cover */}
      <g transform="rotate(-6 13 13.4)">
        <rect
          className="album-icon__photo-paper"
          x="9.6"
          y="6.2"
          width="9.6"
          height="11.6"
          rx="1"
          stroke="none"
        />
        <rect
          className="album-icon__photo-image"
          x="10.7"
          y="7.1"
          width="7.4"
          height="6.9"
          rx=".4"
          stroke="none"
        />
        <circle className="album-icon__sun" cx="16.1" cy="9" r=".8" stroke="none" />
        <path
          d="M11.2 12.1l1.6-1.9 1.3 1.5 1-1.1 1.6 2"
          stroke="rgba(59, 47, 42, 0.45)"
          strokeWidth=".5"
        />
        <path d="M10.7 16h5.4" stroke="rgba(59, 47, 42, 0.22)" strokeWidth=".6" />
      </g>

      {/* rose bookmark ribbon */}
      <path
        className="album-icon__ribbon"
        d="M6.7 19.9h2.5v5.5l-1.25-1.2L6.7 25.4z"
        stroke="none"
      />
      <path d="M7.95 20.1v4.6" stroke="rgba(60, 30, 30, 0.28)" strokeWidth=".6" />
    </svg>
  );
}

export function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

export function CameraGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8.5h3l1.4-2h7.2l1.4 2h3V19H4Z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </svg>
  );
}

export function BookGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 6.3C9.9 4.9 7.3 4.3 3.8 4.4v13.2c3.4-.1 6 .4 8.2 1.9 2.2-1.5 4.8-2 8.2-1.9V4.4c-3.5-.1-6.1.5-8.2 1.9Z" />
      <path d="M12 6.3v13.2" />
    </svg>
  );
}

export function BookmarkPhotoGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="m7.5 15 3-3 2.2 2.2 1.8-1.8 2 2" />
      <circle cx="10" cy="9" r="1.2" />
    </svg>
  );
}

/** Left-right arrows joined into one glyph: "slide side to side". */
export function SwayGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10h20" />
      <path d="M9 4.5 3.5 10 9 15.5" />
      <path d="M19 4.5 24.5 10 19 15.5" />
    </svg>
  );
}

/** A tiny polaroid with a heart: "keep this one in the album". */
export function KeepPolaroidGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" />
      <path d="M4.5 15.5h15" />
      <path d="M12 12.4c-2.1-1.4-3-2.4-3-3.6 0-1 .8-1.7 1.6-1.7.6 0 1.1.3 1.4.8.3-.5.8-.8 1.4-.8.8 0 1.6.7 1.6 1.7 0 1.2-.9 2.2-3 3.6Z" />
    </svg>
  );
}

export function LockGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="10" rx="2.4" />
      <path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" />
      <circle cx="12" cy="15.4" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
