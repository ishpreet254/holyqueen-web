import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Disclaimer from "@/components/ui/Disclaimer";
import CTABand from "@/components/ui/CTABand";
import StickyActions from "@/components/ui/StickyActions";
import { seniorCitizen } from "@/content/rates";

export const metadata = {
  title: "Senior Citizen & Reserved Categories",
  description:
    "12% for 366 days with quarterly interest available, for senior citizens, widows, physically challenged members, police, ex-servicemen and families of martyrs.",
};

export default function SeniorCitizenPage() {
  return (
    <>
      <PageHero
        eyebrow="Deposits"
        title="Senior citizens & reserved categories"
        lead="Our highest 366-day rate, with the option of quarterly interest for members who want the income rather than the compounding."
        trail={[
          { href: "/deposits", label: "Deposits" },
          { label: "Senior Citizen & Reserved" },
        ]}
        actions={[
          { href: "/calculators", label: "Calculate returns" },
          { href: "/contact", label: "Request a callback" },
        ]}
        stat={{ value: seniorCitizen.headline, label: seniorCitizen.headlineNote }}
      />

      <section className="section">
        <SectionHeading eyebrow="Eligibility" title="Who this rate applies to." />
        <ul className="check-list reveal">
          {seniorCitizen.categories.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="disclaimer" role="note">
          {seniorCitizen.note}
        </p>
        <Disclaimer />
      </section>

      <CTABand />
      <StickyActions />
    </>
  );
}
