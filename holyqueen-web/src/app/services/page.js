import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import CTABand from "@/components/ui/CTABand";
import { services } from "@/content/services";

export const metadata = {
  title: "Additional services",
  description:
    "RTGS/NEFT, cheque clearance, money transfer, LIC premium collection, bond paper and e-stamping, general insurance, PAN card, health cards and the Yashasvini scheme.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="At the counter"
        title="Additional services"
        lead="Beyond deposits and credit, the branch handles the everyday paperwork and payments members would otherwise queue elsewhere for."
        trail={[{ label: "Services" }]}
        actions={[{ href: "/contact", label: "Ask about a service" }]}
      />

      <section className="section band">
        <SectionHeading
          eyebrow="Everything available"
          title="Nine services, one counter."
        />
        <div className="service-detail-grid">
          {services.map((service) => (
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

      <CTABand
        title="Not sure whether we handle it? Ask."
        calculator={false}
      />
    </>
  );
}
