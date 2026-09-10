const REASONS = [
  "Secure Investments",
  "Transparent Policies",
  "RBI-KYC Discipline",
  "Fast Approvals",
  "Digital Banking",
  "Trusted Customer Support",
  "Affordable Interest",
  "Better Returns",
];

export default function Why() {
  return (
    <section className="why section" id="why">
      <div className="section-heading reveal">
        <span className="eyebrow">Why Choose Us?</span>
        <h2>
          Secure growth with fast approvals, transparent policies, and
          premium returns.
        </h2>
      </div>
      <div className="trust-list reveal">
        {REASONS.map((reason) => (
          <span key={reason}>{reason}</span>
        ))}
      </div>
    </section>
  );
}
