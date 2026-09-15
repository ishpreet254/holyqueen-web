import Image from "next/image";

export default function IntroOverlay() {
  return (
    <div className="intro vault-intro" aria-label="Holy Queen intro">
      <canvas id="intro-canvas" aria-hidden="true"></canvas>
      <div className="vault-logo-reveal">
        <Image
          className="brand-logo brand-logo-large"
          src="/logo/holy-queen-logo.png"
          alt="Holy Queen logo"
          width={568}
          height={439}
          priority
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
