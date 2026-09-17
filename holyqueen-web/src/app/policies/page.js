import PageHero from "@/components/ui/PageHero";
import Accordion from "@/components/ui/Accordion";
import CTABand from "@/components/ui/CTABand";
import { policies } from "@/content/policies";
import { site } from "@/content/site";

export const metadata = {
  title: "Policies",
  description:
    "KYC requirements, TDS and income tax, member protection, privacy and terms, and grievance redressal at Holy Queen.",
};

export default function PoliciesPage() {
  const ready = policies.filter((item) => item.body);
  const pending = policies.filter((item) => !item.body);

  return (
    <>
      <PageHero
        eyebrow="Policies & trust"
        title="Readable protections for every member."
        lead="What we ask of you, what we do with your information, and where to go if something goes wrong."
        trail={[{ label: "Policies" }]}
      />

      <section className="section">
        <Accordion items={ready} />
        {pending.length > 0 && (
          <p className="inline-todo">
            Pending from the society: {pending.map((item) => item.title).join(", ")}.
            This section publishes as soon as the officer and escalation path are
            confirmed.
          </p>
        )}
        <p className="disclaimer" role="note">
          {site.disclaimer}
        </p>
      </section>

      <CTABand calculator={false} />
    </>
  );
}
