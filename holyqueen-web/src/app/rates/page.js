import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import RateTable from "@/components/ui/RateTable";
import Disclaimer from "@/components/ui/Disclaimer";
import CTABand from "@/components/ui/CTABand";
import StickyActions from "@/components/ui/StickyActions";
import {
  fixedDeposit,
  recurringDeposit,
  pigmyDeposit,
  seniorCitizen,
  ratesEffectiveFrom,
} from "@/content/rates";
import { schemes } from "@/content/schemes";

export const metadata = {
  title: "Rates & offers",
  description:
    "The complete Holy Queen rate card — fixed deposits to 12.5% p.a., short-term deposits, recurring deposits at 10%, pigmy deposits, senior citizen rates and scheme returns.",
};

export default function RatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Rates & offers"
        title="Every rate in one place."
        lead="The full rate card, kept in one file so what you read here is what the branch quotes."
        trail={[{ label: "Rates" }]}
        actions={[
          { href: "/calculators", label: "Calculate returns" },
          { href: "/contact", label: "Confirm with the branch" },
        ]}
        stat={{ value: fixedDeposit.headline, label: "highest FD rate p.a." }}
      />

      <section className="section rate-page band">
        <SectionHeading eyebrow="Fixed deposits" title="Long-term plans." />
        <RateTable
          caption="Regular fixed deposit"
          columns={["Period", "Rate of interest"]}
          rows={fixedDeposit.regular.map((row) => [row.period, row.rate])}
        />

        <SectionHeading eyebrow="Fixed deposits" title="Short-term plans." />
        <RateTable
          caption="Short-term deposit"
          columns={["Period", "Rate of interest"]}
          rows={fixedDeposit.shortTerm.map((row) => [row.period, row.rate])}
        />

        <SectionHeading eyebrow="Senior citizens" title="Reserved categories." />
        <RateTable
          caption="Senior citizen and reserved category rate"
          columns={["Category", "Period", "Rate of interest"]}
          rows={[
            [
              seniorCitizen.categories.join(", "),
              "366 days",
              seniorCitizen.headline,
            ],
          ]}
          note={seniorCitizen.note}
        />

        <SectionHeading eyebrow="Recurring & pigmy" title="Regular savings." />
        <RateTable
          caption="Recurring and pigmy deposit"
          columns={["Plan", "Terms", "Rate of interest"]}
          rows={[
            [
              "Recurring Deposit",
              "Minimum ₹500 per month, minimum 12 months",
              `${recurringDeposit.headline} annually`,
            ],
            ...pigmyDeposit.rows.map((row) => [
              "Pigmy Deposit",
              row.period,
              row.rate,
            ]),
          ]}
        />

        <SectionHeading eyebrow="Special schemes" title="Scheme returns." />
        <RateTable
          caption="Signature scheme returns"
          columns={["Scheme", "Deposit", "Tenure", "You receive"]}
          rows={schemes.map((scheme) => [
            scheme.title,
            scheme.deposit,
            scheme.tenure,
            scheme.returns,
          ])}
        />

        {!ratesEffectiveFrom && (
          <p className="inline-todo">
            Effective-from date pending from the society — it will be printed at
            the top of this card once confirmed.
          </p>
        )}
        <Disclaimer />
      </section>

      <CTABand title="Confirm today's rate before you deposit." />
      <StickyActions />
    </>
  );
}
