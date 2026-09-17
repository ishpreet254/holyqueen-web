import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import GatedNotice from "@/components/ui/GatedNotice";
import CTABand from "@/components/ui/CTABand";
import StickyActions from "@/components/ui/StickyActions";
import { accounts, kycDocuments } from "@/content/products";

export function generateStaticParams() {
  return accounts.map((account) => ({ slug: account.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const account = accounts.find((item) => item.slug === slug);
  if (!account) return {};
  return { title: account.title, description: account.summary };
}

export default async function AccountPage({ params }) {
  const { slug } = await params;
  const account = accounts.find((item) => item.slug === slug);
  if (!account) notFound();

  const terms = Object.entries(account.fields).filter(([, value]) => value);

  return (
    <>
      <PageHero
        eyebrow="Accounts"
        title={account.title}
        lead={account.summary}
        trail={[{ href: "/accounts", label: "Accounts" }, { label: account.title }]}
      />

      {terms.length > 0 ? (
        <section className="section">
          <SectionHeading eyebrow="Terms" title="What applies to this account." />
          <dl className="term-list reveal">
            {terms.map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : (
        <section className="section">
          <GatedNotice />
        </section>
      )}

      <section className="section">
        <SectionHeading
          eyebrow="Documents"
          title="What to bring when you open it."
        />
        <ul className="check-list reveal">
          {kycDocuments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <CTABand calculator={false} />
      <StickyActions calculator={false} />
    </>
  );
}
