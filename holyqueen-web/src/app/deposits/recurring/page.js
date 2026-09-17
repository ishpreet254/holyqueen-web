import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Disclaimer from "@/components/ui/Disclaimer";
import CTABand from "@/components/ui/CTABand";
import StickyActions from "@/components/ui/StickyActions";
import { recurringDeposit } from "@/content/rates";

export const metadata = {
  title: "Recurring Deposit",
  description:
    "Holy Queen recurring deposit — 10% interest annually, minimum ₹500 per month, minimum tenure 12 months.",
};

export default function RecurringDepositPage() {
  return (
    <>
      <PageHero
        eyebrow="Deposits"
        title="Recurring Deposit"
        lead="Save a fixed amount every month and let it compound. The simplest way to turn a habit into a lump sum."
        trail={[
          { href: "/deposits", label: "Deposits" },
          { label: "Recurring Deposit" },
        ]}
        actions={[
          { href: "/calculators", label: "Calculate maturity" },
          { href: "/contact", label: "Request a callback" },
        ]}
        stat={{
          value: recurringDeposit.headline,
          label: recurringDeposit.headlineNote,
        }}
      />

      <section className="section">
        <SectionHeading eyebrow="Terms" title="How the plan works." />
        <ul className="check-list reveal">
          {recurringDeposit.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <Disclaimer />
      </section>

      <section className="section">
        <SectionHeading eyebrow="Why this plan" title="Who it suits." />
        <FeatureGrid
          items={[
            {
              title: "Start small",
              body: "₹500 a month is enough to open one, so a salary or a shop's daily takings can both fund it.",
            },
            {
              title: "Discipline without effort",
              body: "A fixed monthly instalment does the saving for you instead of relying on what's left over.",
            },
            {
              title: "Annual interest",
              body: "Interest is credited annually at 10%, so the balance keeps building on itself.",
            },
            {
              title: "Milestone upgrades",
              body: "Once the habit is set, the signature schemes turn it into a one-lakh or five-year goal.",
            },
          ]}
        />
      </section>

      <CTABand />
      <StickyActions />
    </>
  );
}
