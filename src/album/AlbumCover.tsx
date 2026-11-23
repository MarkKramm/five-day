interface AlbumCoverProps {
  title: string;
  subtitle: string;
  canOpen: boolean;
  onOpen: () => void;
}

export function AlbumCover({ title, subtitle, canOpen, onOpen }: AlbumCoverProps) {
  return (
    <div className="album-page album-cover-page">
      <button
        type="button"
        className="album-cover"
        onClick={onOpen}
        disabled={!canOpen}
        aria-label={canOpen ? "Open the album to the first day" : "Album cover"}
      >
        <span className="album-cover__grain" aria-hidden="true" />
        <span className="album-cover__shine" aria-hidden="true" />
        <span className="album-cover__spine" aria-hidden="true" />
        <span className="album-cover__stitch" aria-hidden="true" />
        <span className="album-cover__corner album-cover__corner--tl" aria-hidden="true" />
        <span className="album-cover__corner album-cover__corner--br" aria-hidden="true" />
        <span className="album-cover__corner album-cover__corner--tr" aria-hidden="true" />
        <span className="album-cover__corner album-cover__corner--bl" aria-hidden="true" />
        <span className="album-cover__ribbon" aria-hidden="true" />
        <span className="album-cover__ornament" aria-hidden="true">
          ✦
        </span>
        <span className="album-cover__title handwritten" data-text={title}>
          {title}
        </span>
        <span className="album-cover__rule" aria-hidden="true" />
        <span className="album-cover__subtitle handwritten">{subtitle}</span>
        <span className="album-cover__dates handwritten">7 days of moments in a book</span>
        <span className="album-cover__made handwritten">made by Mark</span>
        <span className="album-cover__footer handwritten">tap to open</span>
        <span className="album-cover__little-spark" aria-hidden="true">
          ✦
        </span>
      </button>
    </div>
  );
}
