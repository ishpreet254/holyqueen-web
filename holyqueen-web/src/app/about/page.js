import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import FeatureGrid from "@/components/ui/FeatureGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import CTABand from "@/components/ui/CTABand";
import { site, strengths, assurances } from "@/content/site";

export const metadata = {
  title: "About the society",
  description:
    "Holy Queen Credit Souhardha Co-operative Society — a member-first credit co-operative in Saraswathipuram, Mysuru.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Holy Queen"
        title="A member-first credit co-operative in Mysuru."
        lead={`${site.positioning}. ${site.promise}.`}
        trail={[{ label: "About" }]}
        actions={[
          { href: "/leadership", label: "Meet the board" },
          { href: "/branch", label: "Visit the branch" },
        ]}
      />

      <section className="section prose-block reveal">
        <p>
          Holy Queen Credit Souhardha Co-operative Society Ltd. serves members
          from its branch on Kanth Raja Urs Road in Saraswathipuram, Mysuru. The
          society was inaugurated on {site.inauguratedOn}, founded by a team with
          years of working experience inside the co-operative credit sector.
        </p>
        <p>
          The model is deliberately simple: members deposit with the society, the
          society lends to members, and the margin stays inside the community
          rather than leaving it. Every scheme is explained face to face before a
          single rupee moves, and every figure on this website can be verified at
          the counter.
        </p>
        {!site.registrationNumber && (
          <p className="inline-todo">
            Registration number, date of registration and current membership
            figure are pending from the society and will appear here.
          </p>
        )}
      </section>

      <section className="section">
        <SectionHeading eyebrow="Our strength" title="What members get from us." />
        <FeatureGrid items={strengths} numbered />
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Compliance posture"
          title="Discipline behind the returns."
        />
        <div className="trust-list reveal">
          {assurances.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p className="section-more">
          <Link href="/policies">Read our policies →</Link>
        </p>
      </section>

      <CTABand />
    </>
  );
}
