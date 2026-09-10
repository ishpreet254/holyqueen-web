export default function IntroOverlay() {
  return (
    <div className="intro vault-intro" aria-label="Holy Queen intro">
      <canvas id="intro-canvas" aria-hidden="true"></canvas>
      <div className="vault-fog" aria-hidden="true"></div>
      <div className="vault-vignette" aria-hidden="true"></div>
      <div className="vault-radials" aria-hidden="true"></div>
      <div className="vault-energy" aria-hidden="true"></div>
      <div className="vault-door" aria-hidden="true"></div>
      <div className="vault-logo-reveal">
        <img
          className="brand-logo brand-logo-large"
          src="/logo/holy-queen-logo.png"
          alt="Holy Queen logo"
          width="699"
          height="540"
          decoding="async"
        />
        <div className="intro-divider"></div>
        <p className="intro-kicker">HOLY QUEEN</p>
        <h1>CREDIT SOUHARDHA CO-OPERATIVE SOCIETY</h1>
        <strong>Secure Wealth. Royal Trust. Timeless Growth.</strong>
      </div>
      <button className="vault-sound" type="button" aria-pressed="false">
        Sound Off
      </button>
      <div className="vault-transition" aria-hidden="true"></div>
    </div>
  );
}
