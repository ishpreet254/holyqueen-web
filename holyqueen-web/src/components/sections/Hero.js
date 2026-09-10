export default function Hero() {
  return (
    <section className="hero section">
      <canvas id="hero-canvas" aria-hidden="true"></canvas>
      <div className="hero-bg-orbit" aria-hidden="true"></div>
      <div className="hero-content">
        <div className="eyebrow reveal">
          Karnataka&apos;s trusted and progressive financial co-operative
        </div>
        <h1 className="reveal">
          Grow Your Wealth with Confidence &amp; Prestige
        </h1>
        <p className="hero-copy reveal">
          Holy Queen delivers trusted investment schemes, secure banking
          solutions, and premium financial growth opportunities with
          transparent member-first service.
        </p>
        <div className="hero-actions reveal">
          <a className="button primary magnetic" href="#schemes">
            Explore Schemes
          </a>
          <a className="button secondary magnetic" href="#calculator">
            Calculate Returns
          </a>
          <a className="button ghost magnetic" href="#location">
            Visit Branch
          </a>
        </div>
        <div className="hero-stats reveal">
          <div>
            <strong data-counter="12.5">0</strong>
            <span>% FD plans up to</span>
          </div>
          <div>
            <strong data-counter="5">0</strong>
            <span>premium schemes</span>
          </div>
          <div>
            <strong data-counter="100">0</strong>
            <span>% audit focus</span>
          </div>
        </div>
      </div>
      <div className="hero-medallion reveal">
        <img
          className="brand-logo brand-logo-hero"
          src="/logo/holy-queen-logo.png"
          alt="Holy Queen Credit Souhardha Co-operative Society logo"
          width="699"
          height="540"
          loading="eager"
          decoding="async"
        />
        <p>Assured Growth. Unmatched Peace.</p>
        <button className="audio-toggle" type="button" aria-pressed="false">
          Ambient Off
        </button>
      </div>
    </section>
  );
}
