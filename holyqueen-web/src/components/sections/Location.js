export default function Location() {
  return (
    <section className="location section" id="location">
      <div className="section-heading reveal">
        <span className="eyebrow">Branch Location</span>
        <h2>Holy Queen Credit Souhardha Co-operative Society, Mysuru.</h2>
      </div>
      <div className="map-shell reveal">
        <iframe
          title="Holy Queen Mysuru map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=No-2916,%20Kanth%20Raja%20Urs%20Road,%20Saraswathipuram,%20Mysuru-570009&output=embed"
        ></iframe>
        <div className="map-card">
          <strong>No-2916, Kanth Raja Urs Road</strong>
          <span>Saraswathipuram, Mysuru-570009</span>
          <a
            className="button secondary"
            href="https://www.google.com/maps/search/?api=1&query=No-2916%20Kanth%20Raja%20Urs%20Road%20Saraswathipuram%20Mysuru%20570009"
          >
            Get Directions
          </a>
        </div>
      </div>
    </section>
  );
}
