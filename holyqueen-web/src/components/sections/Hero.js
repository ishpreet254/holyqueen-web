import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { fixedDeposit } from "@/content/rates";
import { schemes } from "@/content/schemes";

export default function Hero() {
  return (
    <section className="hero section">
      <canvas id="hero-canvas" aria-hidden="true"></canvas>
      <div className="hero-bg-orbit" aria-hidden="true"></div>
      <div className="hero-content">
        <div className="eyebrow">{site.positioning}</div>
        <h1>Grow your wealth with confidence and prestige</h1>
        <p className="hero-copy">
          Trusted deposit schemes, member credit and everyday branch services —
          with transparent terms and a team that explains every figure before
          you commit.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/deposits">
            Explore deposits
          </Link>
          <Link className="button secondary" href="/calculators">
            Calculate returns
          </Link>
          <Link className="button ghost" href="/branch">
            Visit branch
          </Link>
        </div>
        <div className="hero-stats">
          <div>
            <strong>{parseFloat(fixedDeposit.headline)}</strong>
            <span>% FD plans up to</span>
          </div>
          <div>
            <strong>{schemes.length}</strong>
            <span>signature schemes</span>
          </div>
          <div>
            <strong>100</strong>
            <span>% audited discipline</span>
          </div>
        </div>
      </div>
      <div className="hero-medallion">
        <Image
          className="brand-logo brand-logo-hero"
          src="/logo/holy-queen-logo.png"
          alt={`${site.legalName} crest`}
          width={568}
          height={439}
          sizes="(max-width: 680px) 78vw, 420px"
          priority
        />
        <p>{site.tagline}</p>
        <span className="hero-kannada" lang="kn">
          {site.nameKannada}
        </span>
      </div>
    </section>
  );
}
