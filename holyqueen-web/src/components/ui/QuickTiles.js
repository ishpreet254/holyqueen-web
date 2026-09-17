import Link from "next/link";

const TILES = [
  { href: "/deposits", label: "Deposits", note: "FD, RD, Pigmy" },
  { href: "/accounts", label: "Accounts", note: "Savings & current" },
  { href: "/loans", label: "Loans", note: "Member credit" },
  { href: "/rates", label: "Rates", note: "Full rate card" },
  { href: "/services", label: "Services", note: "PAN, insurance, transfers" },
  { href: "/calculators", label: "Calculators", note: "FD & RD returns" },
];

export default function QuickTiles() {
  return (
    <section className="quick-tiles section" aria-label="Quick access">
      <div className="tile-grid">
        {TILES.map((tile) => (
          <Link className="tile reveal" href={tile.href} key={tile.href}>
            <strong>{tile.label}</strong>
            <span>{tile.note}</span>
            <em aria-hidden="true">→</em>
          </Link>
        ))}
      </div>
    </section>
  );
}
