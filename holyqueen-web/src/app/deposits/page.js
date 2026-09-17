import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Disclaimer from "@/components/ui/Disclaimer";
import CTABand from "@/components/ui/CTABand";
import {
  fixedDeposit,
  recurringDeposit,
  pigmyDeposit,
  seniorCitizen,
} from "@/content/rates";
import { schemes } from "@/content/schemes";

export const metadata = {
  title: "Deposits",
  description:
    "Fixed deposits up to 12.5% p.a., recurring deposits at 10%, pigmy deposits, senior citizen rates and five signature savings schemes.",
};

const PRODUCTS = [
  {
    href: "/deposits/fixed",
    title: "Fixed Deposit",
    rate: fixedDeposit.headline,
    note: fixedDeposit.headlineNote,
    body: "One deposit, a fixed tenure, a rate locked on the day you open it.",
  },
  {
    href: "/deposits/recurring",
    title: "Recurring Deposit",
    rate: recurringDeposit.headline,
    note: recurringDeposit.headlineNote,
    body: "Save a fixed amount every month from as little as ₹500.",
  },
  {
    href: "/deposits/special",
    title: "Special Schemes",
    rate: `${schemes.length}`,
    note: "signature plans",
    body: "Milestone plans for a lakh, a child's future, a pension or doubling a lump sum.",
  },
  {
    href: "/deposits/senior-citizen",
    title: "Senior Citizen & Reserved",
    rate: seniorCitizen.headline,
    note: seniorCitizen.headlineNote,
    body: "Our highest 366-day rate for senior citizens and reserved categories.",
  },
  {
    href: "/deposits/pigmy",
    title: "Pigmy Deposit",
    rate: pigmyDeposit.headline,
    note: pigmyDeposit.headlineNote,
    body: "Small, regular savings for households and small traders.",
  },
];

export default function DepositsPage() {
  return (
    <>
      <PageHero
        eyebrow="Accounts & deposits"
        title="Fixed returns with peace of mind."
        lead="Five ways to save with the society — from a 15-day short-term deposit to a 90-month certificate that doubles your money."
        trail={[{ label: "Deposits" }]}
        actions={[
          { href: "/rates", label: "See all rates" },
          { href: "/calculators", label: "Calculate returns" },
        ]}
        stat={{ value: fixedDeposit.headline, label: "highest FD rate p.a." }}
      />

      <section className="section">
        <div className="product-grid">
          {PRODUCTS.map((product) => (
            <Link className="product-card reveal" href={product.href} key={product.href}>
              <p className="plan-label">{product.title}</p>
              <h2>
                {product.rate}
                <small>{product.note}</small>
              </h2>
              <p>{product.body}</p>
              <em aria-hidden="true">View plan →</em>
            </Link>
          ))}
        </div>
        <Disclaimer />
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Not sure which one"
          title="A quick way to narrow it down."
        />
        <div className="chooser-grid reveal">
          <article>
            <h3>I have a lump sum</h3>
            <p>
              A Fixed Deposit for a locked tenure, or the Queen Cash Certificate
              if you can leave it for 90 months.
            </p>
            <Link href="/deposits/fixed">Fixed Deposit →</Link>
          </article>
          <article>
            <h3>I can save monthly</h3>
            <p>
              A Recurring Deposit from ₹500 a month, or one of the signature
              schemes if you have a specific milestone in mind.
            </p>
            <Link href="/deposits/recurring">Recurring Deposit →</Link>
          </article>
          <article>
            <h3>I need monthly income</h3>
            <p>
              The Monthly Pension Scheme pays ₹1,000 a month on a ₹1,20,000
              deposit held for three years.
            </p>
            <Link href="/deposits/special#monthly-pension-scheme">
              Monthly Pension →
            </Link>
          </article>
        </div>
      </section>

      <CTABand />
    </>
  );
}
