/* EVERY rate on the site comes from this file. Change it once here and the
   menu badge, the product page and /rates all update together. */

export const ratesEffectiveFrom = ""; // CLIENT INPUT — e.g. "1 April 2026"
export const lastVerified = "2026-09-17";

export const fixedDeposit = {
  headline: "12.5%",
  headlineNote: "5 years and above",
  regular: [
    { period: "366 days", rate: "11.00%" },
    { period: "222 days", rate: "8.50%" },
    { period: "999 days", rate: "12.00%" },
    { period: "5 years and above", rate: "12.50%" },
  ],
  shortTerm: [
    { period: "15 – 90 days", rate: "7.25%" },
    { period: "91 – 180 days", rate: "7.75%" },
    { period: "181 – 270 days", rate: "8.25%" },
    { period: "271 – 365 days", rate: "8.75%" },
  ],
};

export const recurringDeposit = {
  headline: "10%",
  headlineNote: "paid annually",
  points: [
    "Minimum ₹500 per month",
    "Minimum tenure 12 months",
    "10% interest annually",
    "Maturity from ₹6,335*",
  ],
};

export const pigmyDeposit = {
  headline: "4%",
  headlineNote: "3 years and above",
  intro:
    "Small savings collected regularly — the simplest way to build a habit of saving.",
  rows: [
    { period: "1 to 2 years", rate: "3.00%" },
    { period: "3 to 4 years", rate: "4.00%" },
  ],
};

export const seniorCitizen = {
  headline: "12%",
  headlineNote: "366 days, quarterly interest available",
  categories: [
    "Senior citizens",
    "Widows",
    "Physically challenged members",
    "Police and retired police",
    "Ex-servicemen",
    "Families of martyrs of India",
  ],
  note: "Supporting documents must be submitted at the branch to avail these rates.",
};

/* Tenure ladder used by the FD calculator so it can only ever compute with a
   rate the society actually offers. */
export const fdLadder = [
  { label: "15 – 90 days", days: 52, rate: 7.25 },
  { label: "91 – 180 days", days: 135, rate: 7.75 },
  { label: "181 – 270 days", days: 225, rate: 8.25 },
  { label: "222 days", days: 222, rate: 8.5 },
  { label: "271 – 365 days", days: 318, rate: 8.75 },
  { label: "366 days", days: 366, rate: 11 },
  { label: "999 days", days: 999, rate: 12 },
  { label: "5 years and above", days: 1825, rate: 12.5 },
];

export const seniorUplift = {
  label: "Senior citizen / reserved category — 366 days",
  days: 366,
  rate: 12,
};
