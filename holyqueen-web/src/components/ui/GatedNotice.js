import { site } from "@/content/site";

/* Shown wherever the society has not yet supplied terms. It deliberately
   offers a conversation instead of a number — no placeholder rates. */
export default function GatedNotice({
  title = "Details are confirmed at the branch",
  body,
}) {
  return (
    <section className="gated-notice reveal">
      <h2>{title}</h2>
      <p>
        {body ||
          "The current terms for this product are shared directly by our branch team, so you always get the figure that applies on the day you open it."}
      </p>
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
          Ask on WhatsApp
        </a>
      </div>
    </section>
  );
}
