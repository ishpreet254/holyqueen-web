import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import GatedNotice from "@/components/ui/GatedNotice";
import RateTable from "@/components/ui/RateTable";
import CTABand from "@/components/ui/CTABand";
import StickyActions from "@/components/ui/StickyActions";
import { loans } from "@/content/products";

export const metadata = {
  title: "Loans",
  description:
    "Member credit from Holy Queen Credit Souhardha Co-operative Society, Mysuru — fast approvals with minimal paperwork.",
};

export default function LoansPage() {
  return (
    <>
      <PageHero
        eyebrow="Member credit"
        title="Loans"
        lead={loans.intro}
        trail={[{ label: "Loans" }]}
        actions={[{ href: "/contact", label: "Request a callback" }]}
      />

      {loans.published && loans.products.length > 0 ? (
        <section className="section">
          <RateTable
            caption="Loan products"
            columns={["Product", "Rate", "Tenure", "Security"]}
            rows={loans.products.map((product) => [
              product.title,
              product.rate,
              product.tenure,
              product.security,
            ])}
          />
        </section>
      ) : (
        <section className="section">
          <GatedNotice
            title="Loan terms are shared at the branch"
            body="Rates, tenures and security requirements differ by product and by member profile, so our team confirms them directly rather than publishing a figure that may not apply to you."
          />
        </section>
      )}

      <section className="section band">
        <SectionHeading
          eyebrow="How we lend"
          title="What members can expect."
        />
        <FeatureGrid
          items={[
            {
              title: "Fast approvals",
              body: "Decisions are taken at branch level, so members are not waiting on a distant office.",
            },
            {
              title: "Minimal paperwork",
              body: "We ask for what the file genuinely needs, and tell you the full list up front.",
            },
            {
              title: "Affordable interest",
              body: "Lower rates keep repayments comfortable over the life of the loan.",
            },
            {
              title: "Member-first assessment",
              body: "Your saving record with the society counts toward how we assess the application.",
            },
          ]}
        />
      </section>

      <CTABand
        title="Talk to us about what you need to borrow."
        calculator={false}
      />
      <StickyActions calculator={false} />
    </>
  );
}
