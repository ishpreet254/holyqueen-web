import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import RateTable from "@/components/ui/RateTable";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Disclaimer from "@/components/ui/Disclaimer";
import CTABand from "@/components/ui/CTABand";
import { pigmyDeposit } from "@/content/rates";

export const metadata = {
  title: "Pigmy Deposit",
  description:
    "Holy Queen pigmy deposit — small regular savings at 3% for 1 to 2 years and 4% for 3 years and above.",
};

export default function PigmyPage() {
  return (
    <>
      <PageHero
        eyebrow="Deposits"
        title="Pigmy Deposit"
        lead={pigmyDeposit.intro}
        trail={[
          { href: "/deposits", label: "Deposits" },
          { label: "Pigmy Deposit" },
        ]}
        actions={[{ href: "/contact", label: "Request a callback" }]}
        stat={{ value: pigmyDeposit.headline, label: pigmyDeposit.headlineNote }}
      />

      <section className="section">
        <SectionHeading eyebrow="Rate of interest" title="By holding period." />
        <RateTable
          caption="Pigmy deposit rates"
          columns={["Period", "Rate of interest"]}
          rows={pigmyDeposit.rows.map((row) => [row.period, row.rate])}
        />
        <Disclaimer />
      </section>

      <section className="section">
        <SectionHeading eyebrow="Why this plan" title="Who it suits." />
        <FeatureGrid
          items={[
            {
              title: "Daily or weekly saving",
              body: "Deposit small amounts as often as suits your cash flow rather than once a month.",
            },
            {
              title: "Built for small traders",
              body: "Shop owners and daily-wage earners can save from takings instead of from savings.",
            },
            {
              title: "Flexible like an RD",
              body: "Similar in spirit to a recurring deposit, with more room to vary the amount.",
            },
            {
              title: "Builds the habit",
              body: "The easiest first step for members who have never held a deposit before.",
            },
          ]}
        />
      </section>

      <CTABand calculator={false} />
    </>
  );
}
