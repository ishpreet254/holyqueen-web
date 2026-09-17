import { fixedDeposit, recurringDeposit } from "./rates";

export const utilityLinks = [
  { href: "/about", label: "About Us" },
  { href: "/leadership", label: "Leadership" },
  { href: "/branch", label: "Branch" },
  { href: "/policies", label: "Policies" },
  { href: "/contact", label: "Contact" },
];

export const nav = [
  {
    label: "Accounts & Deposits",
    href: "/deposits",
    columns: [
      {
        heading: "Accounts",
        links: [
          { href: "/accounts/savings", label: "Savings Account" },
          { href: "/accounts/current", label: "Current Account" },
        ],
      },
      {
        heading: "Deposits",
        links: [
          {
            href: "/deposits/fixed",
            label: "Fixed Deposit",
            badge: `up to ${fixedDeposit.headline} p.a.`,
          },
          {
            href: "/deposits/recurring",
            label: "Recurring Deposit",
            badge: `${recurringDeposit.headline} p.a.`,
          },
          { href: "/deposits/special", label: "Special Schemes" },
          { href: "/deposits/senior-citizen", label: "Senior Citizen & Reserved" },
          { href: "/deposits/pigmy", label: "Pigmy Deposit" },
        ],
      },
    ],
    footerLink: { href: "/rates", label: "Compare all rates" },
  },
  {
    label: "Loans",
    href: "/loans",
  },
  {
    label: "Services",
    href: "/services",
    columns: [
      {
        heading: "Additional services",
        links: [
          { href: "/services#pan-card", label: "PAN Card" },
          { href: "/services#bond-e-stamping", label: "Bond & E-Stamping" },
          { href: "/services#cheque-clearance", label: "Cheque Clearance" },
        ],
      },
      {
        heading: "Insurance",
        links: [
          { href: "/services#general-insurance", label: "General Insurance" },
          { href: "/services#lic-premium", label: "LIC Premium Payments" },
          { href: "/services#health-cards", label: "Health Cards" },
        ],
      },
    ],
    footerLink: { href: "/services", label: "All branch services" },
  },
  {
    label: "Digital",
    href: "/digital",
    columns: [
      {
        heading: "Digital services",
        links: [
          { href: "/digital#rtgs-neft", label: "RTGS / NEFT" },
          { href: "/digital#money-transfer", label: "Money Transfer" },
          { href: "/digital#sms-alerts", label: "SMS Alerts" },
        ],
      },
    ],
  },
  { label: "Rates", href: "/rates" },
  { label: "Calculators", href: "/calculators" },
];
