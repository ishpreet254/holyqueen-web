import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/sections/ContactForm";
import MapEmbed from "@/components/ui/MapEmbed";
import Disclaimer from "@/components/ui/Disclaimer";
import { site } from "@/content/site";

export const metadata = {
  title: "Contact",
  description:
    "Call, WhatsApp or email Holy Queen Credit Souhardha Co-operative Society, Saraswathipuram, Mysuru.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact & enquiry"
        title="Begin with a conversation."
        lead="Send a callback request and the branch team will come back to you with the exact figures for your amount and tenure."
        trail={[{ label: "Contact" }]}
      />

      <section className="section">
        <div className="contact-grid">
          <ContactForm />
          <aside className="contact-panel reveal">
            <div>
              <span>Phone</span>
              <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
            </div>
            <div>
              <span>Email</span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <div>
              <span>WhatsApp</span>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                Message the branch
              </a>
            </div>
            <div>
              <span>Branch</span>
              <p>
                {site.branch.line1}
                <br />
                {site.branch.line2}
              </p>
            </div>
          </aside>
        </div>
        <MapEmbed />
        <Disclaimer />
      </section>
    </>
  );
}
