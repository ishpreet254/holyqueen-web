import Link from "next/link";
import { site } from "@/content/site";
import ThemeToggle from "./ThemeToggle";

const columns = [
  {
    heading: "Quick links",
    links: [
      { href: "/about", label: "About the society" },
      { href: "/leadership", label: "Leadership" },
      { href: "/branch", label: "Branch" },
      { href: "/policies", label: "Policies" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Accounts & deposits",
    links: [
      { href: "/accounts/savings", label: "Savings Account" },
      { href: "/accounts/current", label: "Current Account" },
      { href: "/deposits/fixed", label: "Fixed Deposit" },
      { href: "/deposits/recurring", label: "Recurring Deposit" },
      { href: "/deposits/special", label: "Special Schemes" },
      { href: "/deposits/pigmy", label: "Pigmy Deposit" },
    ],
  },
  {
    heading: "Loans & services",
    links: [
      { href: "/loans", label: "Loans" },
      { href: "/services", label: "Additional services" },
      { href: "/digital", label: "Digital services" },
      { href: "/rates", label: "Rates & offers" },
      { href: "/calculators", label: "Calculators" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {columns.map((column) => (
          <div key={column.heading}>
            <h3>{column.heading}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer-contact">
          <h3>Contact</h3>
          <p>
            <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
          </p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p>
            {site.branch.line1}
            <br />
            {site.branch.line2}
          </p>
          <p className="footer-tagline">{site.tagline}</p>
        </div>
      </div>

      <div className="footer-base">
        <div className="brand">
          <span className="mini-crest">{site.crest}</span>
          <span>
            <strong>HOLY QUEEN</strong>
            <small>{site.legalName}</small>
          </span>
        </div>
        <p className="footer-note">{site.disclaimer}</p>
        <div className="footer-base-end">
          <p>© {new Date().getFullYear()} {site.legalName}</p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
