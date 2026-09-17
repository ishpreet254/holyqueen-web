import Link from "next/link";

export default function Breadcrumbs({ trail = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {trail.map((crumb, index) => (
          <li key={crumb.label} aria-current={index === trail.length - 1 ? "page" : undefined}>
            {crumb.href && index !== trail.length - 1 ? (
              <Link href={crumb.href}>{crumb.label}</Link>
            ) : (
              <span>{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
