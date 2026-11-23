/** Shared CSS-only desk props and warm dust. No literal lamp object. */
const DUST = [
  { size: "far", index: 1 },
  { size: "mid", index: 2 },
  { size: "near", index: 3 },
  { size: "far", index: 4 },
  { size: "mid", index: 5 },
  { size: "near", index: 6 },
  { size: "far", index: 7 },
  { size: "mid", index: 8 },
  { size: "near", index: 9 },
  { size: "far", index: 10 },
  { size: "mid", index: 11 },
  { size: "near", index: 12 },
] as const;

export function Background() {
  return (
    <div className="desk-bg" aria-hidden="true">
      <div className="desk-bg__wood" />
      <div className="desk-bg__beam" />
      <div className="desk-bg__glow" />
      <div className="desk-bg__spots">
        <span className="desk-bg__spot desk-bg__spot--one" />
        <span className="desk-bg__spot desk-bg__spot--two" />
        <span className="desk-bg__spot desk-bg__spot--three" />
      </div>
      <div className="desk-bg__grain" />
      <div className="desk-props">
        <span className="desk-prop desk-prop--polaroid-one" />
        <span className="desk-prop desk-prop--polaroid-two" />
        <span className="desk-prop desk-prop--tape" />
        <span className="desk-prop desk-prop--tape-two" />
        <span className="desk-prop desk-prop--canister" />
        <span className="desk-prop desk-prop--pencil" />
        <span className="desk-prop desk-prop--coffee" />
      </div>
      <div className="desk-dust">
        {DUST.map((speck) => (
          <span
            key={speck.index}
            className={`desk-dust__speck desk-dust__speck--${speck.index} desk-dust__speck--${speck.size}`}
          />
        ))}
      </div>
      <div className="desk-bg__vignette" />
    </div>
  );
}
