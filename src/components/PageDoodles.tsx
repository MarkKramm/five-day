/**
 * Quiet hand-drawn margin doodles for album pages. They are decorative only:
 * no taps, no labels, and low enough contrast that the photos stay in charge.
 */
const SETS: { className: string; viewBox: string; d: string }[][] = [
  [
    {
      className: "page-doodle--a",
      viewBox: "0 0 44 44",
      d: "M22 20c-2.5-4-8-2-7.5 2.5.5 4.5 6 6 10 3.5M14 34c5-1 12-4 15-9",
    },
    {
      className: "page-doodle--b",
      viewBox: "0 0 30 30",
      d: "M15 4l2.8 7.2L25 14l-7.2 2.8L15 24l-2.8-7.2L5 14l7.2-2.8z",
    },
    {
      className: "page-doodle--c",
      viewBox: "0 0 40 24",
      d: "M3 12h26m0 0-7-6m7 6-7 6",
    },
  ],
  [
    {
      className: "page-doodle--a",
      viewBox: "0 0 40 40",
      d: "M20 21c0-6 9-5 9 1 0 5.5-6 7-9 7-7 0-11-4.5-11-10s4.5-10 10-10 10 4.5 10 10",
    },
    {
      className: "page-doodle--b",
      viewBox: "0 0 30 30",
      d: "M15 6c2 4 2 6 0 9-2-3-2-5 0-9zM15 15c4-2 6-2 9 0-3 2-5 2-9 0zM15 15c2 4 2 6 0 9-2-3-2-5 0-9zM15 15c-4-2-6-2-9 0 3 2 5 2 9 0z",
    },
    {
      className: "page-doodle--c",
      viewBox: "0 0 34 24",
      d: "M4 18c3-7 6-7 9 0s6 7 9 0M27 6v6M24 9h6",
    },
  ],
  [
    {
      className: "page-doodle--a",
      viewBox: "0 0 44 30",
      d: "M4 10h5l2-4h8l2 4h5v14H4zM18 17a4 4 0 1 0 8 0 4 4 0 0 0-8 0z",
    },
    {
      className: "page-doodle--b",
      viewBox: "0 0 34 34",
      d: "M17 28c-7-2-10-7-9-13 5 1 8 6 9 13zM17 28c7-2 10-7 9-13-5 1-8 6-9 13z",
    },
    {
      className: "page-doodle--c",
      viewBox: "0 0 44 24",
      d: "M3 16c6-6 10 6 16 0s10 6 16 0",
    },
  ],
];

export function PageDoodles({ seed = 0 }: { seed?: number }) {
  const set = SETS[Math.abs(seed) % SETS.length];
  return (
    <span className="page-doodles" aria-hidden="true">
      {set.map((doodle) => (
        <svg
          key={doodle.className}
          className={`page-doodle ${doodle.className}`}
          viewBox={doodle.viewBox}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={doodle.d} />
        </svg>
      ))}
    </span>
  );
}
