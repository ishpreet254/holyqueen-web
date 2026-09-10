const PLANS = [
  {
    label: "Regular FD",
    rate: "12.5%",
    tenure: "5 years and above",
    points: ["11% for 366 days", "8.5% for 222 days", "12% for 999 days"],
  },
  {
    label: "Short Term",
    rate: "8.75%",
    tenure: "271-365 days",
    points: [
      "7.25% for 15-90 days",
      "7.75% for 91-180 days",
      "8.25% for 181-270 days",
    ],
  },
  {
    label: "Recurring Deposit",
    rate: "10%",
    tenure: "Minimum Rs.500 monthly",
    points: ["Minimum 12 months", "Annual interest", "Maturity from Rs.6,335*"],
  },
  {
    label: "Senior Citizen",
    rate: "12%",
    tenure: "366 days with quarterly interest",
    points: [
      "Widows and physically challenged",
      "Police and retired police",
      "Ex-servicemen and martyrs' families",
    ],
  },
];

export default function Deposits() {
  return (
    <section className="deposits section" id="deposits">
      <div className="section-heading reveal">
        <span className="eyebrow">Deposit Plans</span>
        <h2>Attractive fixed returns with peace of mind.</h2>
      </div>
      <div className="deposit-grid">
        {PLANS.map((plan) => (
          <article className="plan-card reveal" key={plan.label}>
            <p className="plan-label">{plan.label}</p>
            <h3>{plan.rate}</h3>
            <p>{plan.tenure}</p>
            <ul>
              {plan.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
