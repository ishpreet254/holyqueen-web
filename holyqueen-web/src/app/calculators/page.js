import PageHero from "@/components/ui/PageHero";
import Calculators from "@/components/sections/Calculators";
import Disclaimer from "@/components/ui/Disclaimer";
import CTABand from "@/components/ui/CTABand";
import { fixedDeposit } from "@/content/rates";

export const metadata = {
  title: "Calculators",
  description:
    "Work out fixed deposit maturity, recurring deposit returns and which Holy Queen scheme fits your monthly budget.",
};

export default function CalculatorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Interest calculators"
        title="See the figure before you commit."
        lead="Three tools, all using the society's own rate ladder — a fixed deposit calculator, a recurring deposit calculator, and a comparison of the signature schemes."
        trail={[{ label: "Calculators" }]}
        stat={{ value: fixedDeposit.headline, label: "highest FD rate p.a." }}
      />

      <section className="section">
        <Calculators />
        <Disclaimer>
          Calculator output is indicative and rounded. The branch confirms the
          exact maturity value, payout dates and applicable tax treatment.
        </Disclaimer>
      </section>

      <CTABand calculator={false} />
    </>
  );
}
