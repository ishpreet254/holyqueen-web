import PageHero from "@/components/ui/PageHero";
import CTABand from "@/components/ui/CTABand";
import {
  leadership,
  publishDirectNumbers,
  publishPhotos,
} from "@/content/leadership";
import { site } from "@/content/site";

export const metadata = {
  title: "Leadership",
  description:
    "The president, vice president, general manager and board of directors of Holy Queen Credit Souhardha Co-operative Society, Mysuru.",
};

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="The people accountable for your deposits."
        lead="A co-operative is only as sound as the people running it, so here they are — named, with their roles."
        trail={[{ label: "Leadership" }]}
      />

      <section className="section">
        <div className="people-grid">
          {leadership.map((person) => (
            <article className="person-card reveal" key={person.name + person.role}>
              {publishPhotos ? null : (
                <span className="person-crest" aria-hidden="true">
                  {person.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              )}
              <h2>{person.name}</h2>
              <p className="person-role">{person.role}</p>
              <p className="person-branch">Branch: {site.branch.label}</p>
              {publishDirectNumbers && person.phone && (
                <a href={`tel:${person.phone}`}>{person.phone}</a>
              )}
            </article>
          ))}
        </div>
        <p className="disclaimer" role="note">
          Reach any office bearer through the branch line {site.phoneDisplay} or{" "}
          {site.email}. Individual mobile numbers are not published here.
        </p>
      </section>

      <CTABand calculator={false} />
    </>
  );
}
