import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import RateTable from "@/components/ui/RateTable";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Disclaimer from "@/components/ui/Disclaimer";
import CTABand from "@/components/ui/CTABand";
import { fixedDeposit, seniorCitizen } from "@/content/rates";
import { kycDocuments } from "@/content/products";

export const metadata = {
  title: "Fixed Deposit",
  description:
    "Holy Queen fixed deposit rates — up to 12.5% p.a. for 5 years and above, 12% for 999 days, 11% for 366 days, and short-term plans from 15 days.",
};

export default function FixedDepositPage() {
  return (
    <>
      <PageHero
        eyebrow="Deposits"
        title="Fixed Deposit"
        lead="A secure, rewarding way to hold money you don't need right now — the rate is fixed on the day you open it and stays fixed until maturity."
        trail={[{ href: "/deposits", label: "Deposits" }, { label: "Fixed Deposit" }]}
        actions={[
          { href: "/calculators", label: "Calculate maturity" },
          { href: "/contact", label: "Request a callback" },
        ]}
        stat={{ value: fixedDeposit.headline, label: fixedDeposit.headlineNote }}
      />

      <section className="section">
        <SectionHeading eyebrow="Rate of interest" title="Long-term deposits." />
        <RateTable
          caption="Regular fixed deposit rates"
          columns={["Period", "Rate of interest"]}
          rows={fixedDeposit.regular.map((row) => [row.period, row.rate])}
        />

        <SectionHeading eyebrow="Short term" title="15 to 365 days." />
        <RateTable
          caption="Short-term deposit rates"
          columns={["Period", "Rate of interest"]}
          rows={fixedDeposit.shortTerm.map((row) => [row.period, row.rate])}
        />
        <Disclaimer />
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Why this plan"
          title="What a fixed deposit gives you."
        />
        <FeatureGrid
          items={[
            {
              title: "Guaranteed returns",
              body: "The rate is locked at the time of deposit, whatever happens to rates afterwards.",
            },
            {
              title: "Flexible tenure",
              body: "From 15 days to five years and above — match the deposit to when you need the money.",
            },
            {
              title: "Higher than a savings account",
              body: "Money that would otherwise sit idle earns a fixed, predictable return.",
            },
            {
              title: "Reserved category uplift",
              body: `Senior citizens and reserved categories earn ${seniorCitizen.headline} on ${seniorCitizen.headlineNote}.`,
            },
          ]}
        />
        <p className="section-more">
          <Link href="/deposits/senior-citizen">Senior citizen rates →</Link>
        </p>
      </section>

      <section className="section">
        <SectionHeading eyebrow="Documents" title="What to bring." />
        <ul className="check-list reveal">
          {kycDocuments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <CTABand />
    </>
  );
}
