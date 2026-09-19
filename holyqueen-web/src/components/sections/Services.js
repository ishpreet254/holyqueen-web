import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/content/services";

export default function Services() {
  return (
    <section className="services section band" id="services">
      <SectionHeading
        eyebrow="Additional services"
        title="Everyday banking, documents and insurance at the counter."
      />
      <div className="service-grid">
        {services.slice(0, 6).map((service) => (
          <Link
            className="service-card reveal"
            href={`/services#${service.slug}`}
            key={service.slug}
          >
            {service.title}
          </Link>
        ))}
      </div>
      <p className="section-more">
        <Link href="/services">All branch services →</Link>
      </p>
    </section>
  );
}
