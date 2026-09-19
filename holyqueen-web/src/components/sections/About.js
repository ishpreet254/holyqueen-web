import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { strengths } from "@/content/site";

export default function About() {
  return (
    <section className="about section band" id="about">
      <SectionHeading
        eyebrow="About Holy Queen"
        title="Built on trust, transparency and member growth."
      />
      <div className="about-grid">
        {strengths.slice(0, 3).map((item, index) => (
          <article className="glass-panel reveal" key={item.title}>
            <span className="panel-icon">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <p className="section-more">
        <Link href="/about">Read our story →</Link>
      </p>
    </section>
  );
}
