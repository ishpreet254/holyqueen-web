import Link from "next/link";
import PageHero from "@/components/ui/PageHero";

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="That page isn't here."
        lead="The page may have moved. Start from the deposit plans or the rate card."
        actions={[
          { href: "/deposits", label: "Deposit plans" },
          { href: "/rates", label: "Rate card" },
        ]}
      />
      <section className="section">
        <p className="section-more">
          <Link href="/">Back to home →</Link>
        </p>
      </section>
    </>
  );
}
