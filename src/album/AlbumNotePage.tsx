import type { CSSProperties } from "react";
import type { ExtraPage } from "../types";
import { PageDoodles } from "../components/PageDoodles";

interface AlbumNotePageProps {
  page: ExtraPage;
  /** The page under the reader's eye: the ink writes itself on. */
  active?: boolean;
}

export function AlbumNotePage({ page, active = false }: AlbumNotePageProps) {
  let wordIndex = 0;

  return (
    <div className={`album-page album-extra-page album-note-page ${active ? "is-writing" : ""}`}>
      <PageDoodles seed={2} />
      <span className="note-paperclip" aria-hidden="true">
        <span className="note-paperclip__inner" />
      </span>
      <span className="album-extra__spark" aria-hidden="true">✦</span>
      {page.title && <h3 className="album-extra__title handwritten">{page.title}</h3>}
      <span className="album-extra__rule" aria-hidden="true" />
      <div className="album-note-body">
        {page.body.length === 0 ? (
          <p className="album-extra__empty handwriting">note goes here</p>
        ) : (
          page.body.map((paragraph, index) => {
            const words = paragraph.split(" ");
            return (
              <p className="album-note-paragraph handwritten" key={index}>
                {words.map((word, wordKey) => {
                  const order = wordIndex;
                  wordIndex += 1;
                  return (
                    <span
                      className="note-word"
                      key={`${wordKey}-${word}`}
                      style={{ "--w": Math.min(order, 36) } as CSSProperties}
                    >
                      {word}
                      {wordKey < words.length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
}
