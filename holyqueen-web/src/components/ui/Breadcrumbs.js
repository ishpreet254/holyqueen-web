import Link from "next/link";

const BASE = "https://holyqueen.example";

export default function Breadcrumbs({ trail = [] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      ...trail.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.label,
        ...(crumb.href ? { item: `${BASE}${crumb.href}` } : {}),
      })),
    ],
  };

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {trail.map((crumb, index) => (
          <li
            key={crumb.label}
            aria-current={index === trail.length - 1 ? "page" : undefined}
          >
            {crumb.href && index !== trail.length - 1 ? (
              <Link href={crumb.href}>{crumb.label}</Link>
            ) : (
              <span>{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </nav>
  );
}
