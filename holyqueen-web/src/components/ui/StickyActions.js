import Link from "next/link";
import { site } from "@/content/site";

/* Mobile-only action bar for product pages: the two things a visitor on a
   phone actually wants from a rate page are the phone and the calculator. */
export default function StickyActions({ calculator = true }) {
  return (
    <div className="sticky-actions" role="group" aria-label="Quick actions">
      <a href={`tel:${site.phone}`}>Call branch</a>
      <a
        href={`https://wa.me/${site.whatsapp}`}
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>
      {calculator && <Link href="/calculators">Calculate</Link>}
    </div>
  );
}
