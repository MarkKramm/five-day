interface PrinterProps {
  done: boolean;
  /** 0..1 print progress, shown on the little LCD. */
  progress?: number;
  holding?: boolean;
  compact?: boolean;
}

/**
 * A compact rectangular pocket photo printer seen from the front and slightly
 * above: you see its top face (button, LCD, brand) tapering toward the back,
 * and its front lip with the slot the photo slides out of.
 */
export function Printer({ done, progress = 0, holding = false, compact = false }: PrinterProps) {
  const pct = Math.round(progress * 100);
  const status = done ? "DONE" : holding ? "PRINTING" : progress > 0 ? "PAUSED" : "READY";
  const state = done ? "is-done" : holding ? "is-printing" : progress > 0 ? "is-paused" : "";
  return (
    <div className={`printer ${state} ${compact ? "printer--compact" : ""}`} aria-hidden="true">
      <div className="pp">
        {/* TOP FACE: seen from above, so it tapers toward the back */}
        <div className="pp__top">
        <span className="pp__sheen" />
        <div className="pp__face">
          <span className="pp__button">
            <span className="pp__button-ring" />
          </span>

          <div className="pp__lcd">
            <div className="pp__lcd-top">
              <span>PHOTO</span>
              <span className="pp__lcd-pct">{pct}%</span>
            </div>
            <div className="pp__lcd-status">
              {status}
              {holding && <span className="pp__dots">...</span>}
              {done && <span className="pp__check"> ✓</span>}
            </div>
            <div className="pp__lcd-bar">
              <span style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="pp__side">
            <span className="pp__led" />
            <span className="pp__brand handwritten">five a day</span>
            <span className="pp__model">POCKET PRINT</span>
          </div>
        </div>
        <span className="pp__grille" />
        </div>

        {/* FRONT FACE: the thin lip facing us, with the slot the photo leaves from */}
        <div className="pp__front">
          <span className="pp__slot" />
        </div>
      </div>
    </div>
  );
}
