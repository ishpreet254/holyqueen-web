import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  fixedDeposit,
  recurringDeposit,
  pigmyDeposit,
  seniorCitizen,
} from "@/content/rates";

const PLANS = [
  {
    href: "/deposits/fixed",
    label: "Fixed Deposit",
    rate: fixedDeposit.headline,
    tenure: fixedDeposit.headlineNote,
    points: fixedDeposit.regular.slice(0, 3).map((r) => `${r.rate} for ${r.period}`),
  },
  {
    href: "/deposits/recurring",
    label: "Recurring Deposit",
    rate: recurringDeposit.headline,
    tenure: recurringDeposit.headlineNote,
    points: recurringDeposit.points.slice(0, 3),
  },
  {
    href: "/deposits/senior-citizen",
    label: "Senior Citizen & Reserved",
    rate: seniorCitizen.headline,
    tenure: seniorCitizen.headlineNote,
    points: seniorCitizen.categories.slice(0, 3),
  },
  {
    href: "/deposits/pigmy",
    label: "Pigmy Deposit",
    rate: pigmyDeposit.headline,
    tenure: pigmyDeposit.headlineNote,
    points: pigmyDeposit.rows.map((r) => `${r.rate} for ${r.period}`),
  },
];

export default function Deposits() {
  return (
    <section className="deposits section band" id="deposits">
      <SectionHeading
        eyebrow="Deposit plans"
        title="Attractive fixed returns with peace of mind."
      />
      <div className="deposit-grid">
        {PLANS.map((plan) => (
          <Link className="plan-card reveal" href={plan.href} key={plan.label}>
            <p className="plan-label">{plan.label}</p>
            <h3>{plan.rate}</h3>
            <p>{plan.tenure}</p>
            <ul>
              {plan.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <em aria-hidden="true">View plan →</em>
          </Link>
        ))}
      </div>
      <p className="section-more">
        <Link href="/rates">See the full rate card →</Link>
      </p>
    </section>
  );
}
