import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";

export default function PageHero({
  eyebrow,
  title,
  lead,
  actions = [],
  trail = [],
  stat,
}) {
  return (
    <header className="page-hero">
      {trail.length > 0 && <Breadcrumbs trail={trail} />}
      <div className="page-hero-inner">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {lead && <p className="page-lead">{lead}</p>}
          {actions.length > 0 && (
            <div className="page-actions">
              {actions.map((action, index) =>
                action.href.startsWith("/") ? (
                  <Link
                    key={action.href}
                    className={`button ${index === 0 ? "primary" : "secondary"}`}
                    href={action.href}
                  >
                    {action.label}
                  </Link>
                ) : (
                  <a
                    key={action.href}
                    className={`button ${index === 0 ? "primary" : "secondary"}`}
                    href={action.href}
                  >
                    {action.label}
                  </a>
                )
              )}
            </div>
          )}
        </div>
        {stat && (
          <div className="page-hero-stat">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        )}
      </div>
    </header>
  );
}
