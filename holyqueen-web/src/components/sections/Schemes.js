import Link from "next/link";
import { schemes } from "@/content/schemes";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Schemes() {
  return (
    <section className="schemes section" id="schemes">
      <SectionHeading
        centered
        eyebrow="Special plans"
        title="Signature schemes designed for real milestones."
      />
      <div className="scheme-grid">
        {schemes.map((scheme) => (
          <article
            key={scheme.slug}
            className={`scheme-card reveal${scheme.featured ? " featured" : ""}`}
          >
            <span className="scheme-mark"></span>
            <h3>{scheme.title}</h3>
            <p>
              {scheme.deposit} · {scheme.tenure}
            </p>
            <strong>{scheme.returns}</strong>
            <Link href={`/deposits/special#${scheme.slug}`}>See the plan</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
