export function AlbumIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 6.2C11.7 4.7 8.6 4 4.3 4.2v13.4c4.1-.1 7.2.5 9.7 2.2 2.5-1.7 5.6-2.3 9.7-2.2V4.2C19.4 4 16.3 4.7 14 6.2Z" />
      <path d="M14 6.2v13.6" />
      <path d="M7.2 8.3c1.7 0 3.2.3 4.4.9M7.2 11.5c1.7 0 3.2.3 4.4.9M16.4 9.2c1.2-.6 2.7-.9 4.4-.9M16.4 12.4c1.2-.6 2.7-.9 4.4-.9" />
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
