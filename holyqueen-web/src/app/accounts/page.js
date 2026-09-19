import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import RateTable from "@/components/ui/RateTable";
import CTABand from "@/components/ui/CTABand";
import { accounts, kycDocuments } from "@/content/products";

export const metadata = {
  title: "Accounts",
  description:
    "Savings and current accounts for members of Holy Queen Credit Souhardha Co-operative Society, Mysuru.",
};

export default function AccountsPage() {
  return (
    <>
      <PageHero
        eyebrow="Accounts"
        title="Start with an account, grow with a deposit."
        lead="A member account is the doorway to every scheme the society offers — passbook records, SMS alerts and a branch team that knows you by name."
        trail={[{ label: "Accounts" }]}
        actions={[
          { href: "/accounts/savings", label: "Savings Account" },
          { href: "/accounts/current", label: "Current Account" },
        ]}
      />

      <section className="section band">
        <SectionHeading
          eyebrow="Compare"
          title="Which account suits you?"
        />
        <RateTable
          caption="Savings and current accounts at a glance"
          columns={["Feature", "Savings Account", "Current Account"]}
          rows={[
            ["Who it suits", "Individuals and families", "Traders and businesses"],
            ["Earns interest", "Yes", "No"],
            ["Passbook", "Yes", "Yes"],
            ["SMS alerts", "Yes", "Yes"],
            ["Transaction volume", "Everyday", "High frequency"],
            ["Rate / charges", "Confirmed at branch", "Confirmed at branch"],
          ]}
          note="Interest rates, minimum balance and charges are being finalised by the society and will be published here once confirmed."
        />
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Opening an account"
          title="What to bring to the branch."
        />
        <ul className="check-list reveal">
          {kycDocuments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="section-more">
          {accounts.map((account) => (
            <Link key={account.slug} href={`/accounts/${account.slug}`}>
              {account.title} →
            </Link>
          ))}
        </p>
      </section>

      <CTABand
        title="Open an account at the Saraswathipuram branch."
        calculator={false}
      />
    </>
  );
}
