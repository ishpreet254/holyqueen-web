const SCHEMES = [
  {
    title: "Laksha Sulthan Scheme",
    detail: "Deposit Rs.2,500 per month for 36 months.",
    result: "Receive Rs.1,05,580 + Rs.1,000 bonus",
    cta: "Start Investing",
    href: "#contact",
  },
  {
    title: "Asha Kirana Nidhi Scheme",
    detail: "Deposit Rs.1,250 per month for 36 months.",
    result: "Receive Rs.50,998 + Rs.500 bonus",
    cta: "Request Details",
    href: "#contact",
  },
  {
    title: "Chinara Kanasina Nidhi Scheme",
    detail: "Deposit Rs.500 per month for 60 months.",
    result: "Receive Rs.40,014 at 11% p.a.",
    cta: "Plan Future",
    href: "#contact",
  },
  {
    title: "Queen Cash Certificate",
    detail: "Doubles your money in 90 months.",
    result: "Rs.1,00,000 becomes Rs.2,00,151*",
    cta: "Calculate",
    href: "#calculator",
  },
  {
    title: "Monthly Pension Scheme",
    detail: "Deposit Rs.1,20,000 for 3 years.",
    result: "Receive Rs.1,000 per month at 10%",
    cta: "Book Visit",
    href: "#contact",
    featured: true,
  },
];

export default function Schemes() {
  return (
    <section className="schemes section" id="schemes">
      <div className="section-heading centered reveal">
        <span className="eyebrow">Special Plans</span>
        <h2>Signature schemes designed for secure milestones.</h2>
      </div>
      <div className="scheme-grid">
        {SCHEMES.map((scheme) => (
          <article
            key={scheme.title}
            className={`scheme-card tilt reveal${
              scheme.featured ? " featured" : ""
            }`}
          >
            <span className="scheme-mark"></span>
            <h3>{scheme.title}</h3>
            <p>{scheme.detail}</p>
            <strong>{scheme.result}</strong>
            <a href={scheme.href}>{scheme.cta}</a>
          </article>
        ))}
      </div>
    </section>
  );
}
