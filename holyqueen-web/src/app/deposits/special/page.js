import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import RateTable from "@/components/ui/RateTable";
import Disclaimer from "@/components/ui/Disclaimer";
import CTABand from "@/components/ui/CTABand";
import { schemes } from "@/content/schemes";

export const metadata = {
  title: "Special Schemes",
  description:
    "Laksha Sulthan, Asha Kirana Nidhi, Chinara Kanasina Nidhi, Queen Cash Certificate and the Monthly Pension Scheme.",
};

export default function SpecialSchemesPage() {
  return (
    <>
      <PageHero
        eyebrow="Deposits"
        title="Special schemes"
        lead="Five plans built around the milestones members actually save for — a first lakh, a child's education, a monthly income, a doubled lump sum."
        trail={[
          { href: "/deposits", label: "Deposits" },
          { label: "Special Schemes" },
        ]}
        actions={[
          { href: "/calculators", label: "Compare schemes" },
          { href: "/contact", label: "Request a callback" },
        ]}
      />

      <section className="section">
        <RateTable
          caption="All schemes at a glance"
          columns={["Scheme", "Deposit", "Tenure", "You receive"]}
          rows={schemes.map((scheme) => [
            scheme.title,
            scheme.deposit,
            scheme.tenure,
            scheme.returns,
          ])}
          note="*Amounts can be invested in multiples. T&C apply."
        />
      </section>

      <section className="section">
        <SectionHeading eyebrow="In detail" title="Each plan, plainly stated." />
        <div className="scheme-detail-list">
          {schemes.map((scheme) => (
            <article className="scheme-detail reveal" id={scheme.slug} key={scheme.slug}>
              <h3>{scheme.title}</h3>
              <dl>
                <div>
                  <dt>Deposit</dt>
                  <dd>{scheme.deposit}</dd>
                </div>
                <div>
                  <dt>Tenure</dt>
                  <dd>{scheme.tenure}</dd>
                </div>
                <div>
                  <dt>You receive</dt>
                  <dd className="accented">{scheme.returns}</dd>
                </div>
              </dl>
              <p>{scheme.suits}</p>
            </article>
          ))}
        </div>
        <Disclaimer />
      </section>

      <CTABand />
    </>
  );
}
