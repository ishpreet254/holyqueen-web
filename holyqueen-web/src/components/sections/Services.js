const SERVICES = [
  "RTGS / NEFT",
  "Money Transfer",
  "Insurance Services",
  "PAN Card Services",
  "Bond & E-Stamping",
  "Health Cards",
];

export default function Services() {
  return (
    <section className="services section" id="services">
      <div className="section-heading reveal">
        <span className="eyebrow">Additional Services</span>
        <h2>
          Branch services for daily banking, documents, and insurance
          support.
        </h2>
      </div>
      <div className="service-grid">
        {SERVICES.map((service) => (
          <article className="service-card reveal" key={service}>
            {service}
          </article>
        ))}
      </div>
    </section>
  );
}
