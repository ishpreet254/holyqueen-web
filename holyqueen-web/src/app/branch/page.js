import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import MapEmbed from "@/components/ui/MapEmbed";
import CTABand from "@/components/ui/CTABand";
import { site } from "@/content/site";
import { kycDocuments } from "@/content/products";

export const metadata = {
  title: "Branch",
  description:
    "Holy Queen Credit Souhardha Co-operative Society — No-2916, Kanth Raja Urs Road, Saraswathipuram, Mysuru-570009.",
};

export default function BranchPage() {
  return (
    <>
      <PageHero
        eyebrow="Visit us"
        title="Saraswathipuram, Mysuru"
        lead={`${site.branch.line1}, ${site.branch.line2}.`}
        trail={[{ label: "Branch" }]}
        actions={[
          { href: `tel:${site.phone}`, label: `Call ${site.phoneDisplay}` },
          { href: "/contact", label: "Request a callback" },
        ]}
      />

      <section className="section">
        <MapEmbed />
      </section>

      <section className="section">
        <SectionHeading eyebrow="Branch timing" title="When to find us." />
        <dl className="term-list reveal">
          <div>
            <dt>Working hours</dt>
            <dd>{site.branch.hours}</dd>
          </div>
          <div>
            <dt>Lunch break</dt>
            <dd>{site.branch.lunchBreak}</dd>
          </div>
        </dl>
      </section>

      <section className="section">
        <SectionHeading eyebrow="Before you come" title="What to bring." />
        <ul className="check-list reveal">
          {kycDocuments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <CTABand calculator={false} />
    </>
  );
}
