/** Shared CSS-only desk props and warm dust. No literal lamp object. */
export function Background() {
  return (
    <div className="desk-bg" aria-hidden="true">
      <div className="desk-bg__wood" />
      <div className="desk-bg__beam" />
      <div className="desk-bg__glow" />
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
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} className={`desk-dust__speck desk-dust__speck--${index + 1}`} />
        ))}
      </div>
      <div className="desk-bg__vignette" />
    </div>
  );
}
