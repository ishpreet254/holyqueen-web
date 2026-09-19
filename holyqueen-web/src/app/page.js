import Link from "next/link";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Schemes from "@/components/sections/Schemes";
import Deposits from "@/components/sections/Deposits";
import Why from "@/components/sections/Why";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import ContactForm from "@/components/sections/ContactForm";
import QuickTiles from "@/components/ui/QuickTiles";
import MapEmbed from "@/components/ui/MapEmbed";
import SectionHeading from "@/components/ui/SectionHeading";
import Disclaimer from "@/components/ui/Disclaimer";
import HomeAtmosphere from "@/components/global/HomeAtmosphere";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <HomeAtmosphere />
      <div className="cursor-glow" aria-hidden="true"></div>

      <Hero />
      <QuickTiles />
      <About />
      <Schemes />
      <Deposits />

      <section className="calc-teaser section reveal">
        <div>
          <span className="eyebrow">Interest calculator</span>
          <h2>See the maturity figure before you visit.</h2>
          <p>
            Pick a real tenure from our rate ladder and the calculator uses the
            rate that actually applies — no guesswork.
          </p>
        </div>
        <Link className="button primary" href="/calculators">
          Open calculators
        </Link>
      </section>

      <Why />
      <Services />
      <Testimonials />

      <section className="branch-band section band" id="branch">
        <SectionHeading
          eyebrow="Branch & enquiry"
          title="Begin with a conversation, then invest with clarity."
        />
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
