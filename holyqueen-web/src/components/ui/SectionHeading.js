export default function SectionHeading({ eyebrow, title, lead, centered }) {
  return (
    <div className={`section-heading reveal${centered ? " centered" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </div>
  );
}
