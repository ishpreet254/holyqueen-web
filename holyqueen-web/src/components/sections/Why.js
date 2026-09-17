import SectionHeading from "@/components/ui/SectionHeading";
import { trustChips } from "@/content/site";

export default function Why() {
  return (
    <section className="why section" id="why">
      <SectionHeading
        eyebrow="Why choose us"
        title="Secure growth, fast approvals and transparent policies."
      />
      <div className="trust-list reveal">
        {trustChips.map((chip) => (
          <span key={chip}>{chip}</span>
        ))}
      </div>
    </section>
  );
}
