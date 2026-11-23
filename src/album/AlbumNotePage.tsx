import type { ExtraPage } from "../types";

export function AlbumNotePage({ page }: { page: ExtraPage }) {
  return (
    <div className="album-page album-extra-page album-note-page">
      <span className="album-extra__spark" aria-hidden="true">✦</span>
      {page.title && <h3 className="album-extra__title handwritten">{page.title}</h3>}
      <span className="album-extra__rule" aria-hidden="true" />
      <div className="album-note-body">
        {page.body.length === 0 ? (
          <p className="album-extra__empty handwriting">note goes here</p>
        ) : (
          page.body.map((paragraph, index) => (
            <p className="album-note-paragraph handwritten" key={index}>{paragraph}</p>
          ))
        )}
      </div>
    </div>
  );
}
