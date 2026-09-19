import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import CTABand from "@/components/ui/CTABand";
import { services } from "@/content/services";

export const metadata = {
  title: "Digital services",
  description:
    "RTGS and NEFT transfers, money transfer through Western Union, MoneyGram and Ria, and SMS alerts on every transaction.",
};

const digital = services.filter((service) => service.group === "digital");

export default function DigitalPage() {
  return (
    <>
      <PageHero
        eyebrow="Digital services"
        title="Money that moves, records you can check."
        lead="Transfers handled at the counter, and an SMS on your phone for every transaction on your account."
        trail={[{ label: "Digital" }]}
        actions={[{ href: "/contact", label: "Ask the branch" }]}
      />

      <section className="section">
        <SectionHeading eyebrow="Transfers" title="Sending and receiving funds." />
        <div className="service-detail-grid">
          {digital.map((service) => (
            <article className="service-detail reveal" id={service.slug} key={service.slug}>
              <h2>{service.title}</h2>
              <p>{service.body}</p>
              {service.bring && (
                <p className="service-bring">
                  <strong>Bring:</strong> {service.bring}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section band" id="sms-alerts">
        <SectionHeading eyebrow="Transparency" title="SMS alerts and records." />
        <FeatureGrid
          items={[
            {
              title: "Alerts on every transaction",
              body: "Deposits, withdrawals and interest credits are confirmed by SMS to your registered number.",
            },
            {
              title: "Passbook you can verify",
              body: "Every entry in your passbook matches the society's books, checked by annual audit.",
            },
            {
              title: "Keep your number current",
              body: "Tell the branch whenever your mobile number changes so alerts keep reaching you.",
            },
          ]}
        />
      </section>

      <CTABand calculator={false} />
    </>
  );
}
