import Link from "next/link";
import { site } from "@/content/site";

export default function CTABand({
  title = "Speak to the branch before you decide.",
  body = "Our team will walk you through the plan, the paperwork and the exact maturity figure for your amount.",
  calculator = true,
}) {
  return (
    <section className="cta-band reveal">
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <div className="cta-actions">
        <a className="button primary" href={`tel:${site.phone}`}>
          Call {site.phoneDisplay}
        </a>
        <a
          className="button secondary"
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
        {calculator && (
          <Link className="button ghost" href="/calculators">
            Calculate returns
          </Link>
        )}
      </div>
    </section>
  );
}
