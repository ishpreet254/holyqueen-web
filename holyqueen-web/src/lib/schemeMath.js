/* ============================================================
   SCHEME MATH — shared, single source of truth for turning the
   plain-English scheme copy in src/content/schemes.js into
   comparable numbers.

   Used by both the in-page "Compare schemes" calculator
   (src/components/sections/Calculators.js) and the PDF report
   engine (src/lib/pdfReport.js), so a member sees the exact same
   "best value" verdict on screen and in the downloaded report.
   ============================================================ */

const num = (text) => Number(String(text).replace(/[^\d]/g, "")) || 0;

export function parseMonths(tenureText) {
  const monthMatch = tenureText.match(/(\d+)\s*month/i);
  if (monthMatch) return Number(monthMatch[1]);
  const yearMatch = tenureText.match(/(\d+)\s*year/i);
  if (yearMatch) return Number(yearMatch[1]) * 12;
  return null;
}

/**
 * Normalises one scheme from content/schemes.js into comparable numbers:
 *  - type: "monthly" (a recurring instalment) or "lumpsum" (one deposit)
 *  - monthlyDeposit / lumpDeposit: whichever applies, in rupees
 *  - invested: total rupees the member puts in over the full tenure
 *  - totalValue: total rupees the member gets back (principal + return)
 *  - effectiveAnnualPct: simple annualised yield, so a 36-month and a
 *    90-month scheme can be ranked on the same footing
 */
export function parseSchemeMetrics(scheme) {
  const monthlyMatch = scheme.deposit.match(/₹([\d,]+)\s*per month/i);
  const onceMatch = scheme.deposit.match(/₹([\d,]+)\s*once/i);
  const multiplesMatch = scheme.deposit.match(/₹([\d,]+)\s*\(in multiples\)/i);

  const monthlyDeposit = monthlyMatch ? num(monthlyMatch[1]) : null;
  const lumpDeposit = onceMatch ? num(onceMatch[1]) : multiplesMatch ? num(multiplesMatch[1]) : null;
  const type = monthlyDeposit != null ? "monthly" : "lumpsum";
  const months = parseMonths(scheme.tenure);

  const becomesMatch = scheme.returns.match(/becomes\s*₹([\d,]+)/i);
  const payoutMatch = scheme.returns.match(/₹([\d,]+)\s*every month/i);

  let invested = null;
  let totalValue = null;

  if (becomesMatch) {
    // "₹1,00,000 becomes ₹2,00,151*" — the figure after "becomes" IS the
    // total maturity value; the figure before it is just the deposit.
    invested = lumpDeposit;
    totalValue = num(becomesMatch[1]);
  } else if (payoutMatch && months) {
    // "₹1,000 every month at 10%" — a pension-style scheme: the deposit
    // is returned at term end, plus the monthly payout along the way.
    const payout = num(payoutMatch[1]);
    invested = lumpDeposit;
    totalValue = lumpDeposit != null ? lumpDeposit + payout * months : null;
  } else {
    // "₹1,05,580 + ₹1,000 bonus" or "₹40,014 at 11% p.a." — every ₹
    // figure in the returns text is part of what the member receives.
    const figures = scheme.returns.match(/₹[\d,]+/g) || [];
    totalValue = figures.reduce((sum, figure) => sum + num(figure), 0);
    invested = monthlyDeposit != null && months != null ? monthlyDeposit * months : lumpDeposit;
  }

  let effectiveAnnualPct = null;
  if (invested && months) {
    const years = months / 12;
    if (invested > 0 && years > 0) {
      effectiveAnnualPct = ((totalValue - invested) / invested / years) * 100;
    }
  }

  return {
    ...scheme,
    type,
    monthlyDeposit,
    lumpDeposit,
    months,
    invested,
    totalValue,
    effectiveAnnualPct,
  };
}

/** A short, chart-friendly name — acronym if the title carries one,
 * otherwise the first two words with "Scheme" dropped. */
export function shortLabel(scheme) {
  const acronymMatch = scheme.title.match(/\(([A-Z]{2,6})\)/);
  if (acronymMatch) return acronymMatch[1];
  return scheme.title
    .replace(/\s*Scheme$/i, "")
    .split(" ")
    .slice(0, 2)
    .join(" ");
}

export function rankSchemes(schemesList) {
  return schemesList.map(parseSchemeMetrics);
}

/** Highest effective-annual-yield scheme among the given records (nulls skipped). */
export function pickBestValue(records) {
  return records.reduce(
    (best, record) =>
      record.effectiveAnnualPct != null && (!best || record.effectiveAnnualPct > best.effectiveAnnualPct)
        ? record
        : best,
    null
  );
}

/** Whether a member's stated budgets can actually start this scheme. */
export function fitsBudget(record, { monthlyBudget, lumpSum }) {
  if (record.type === "monthly") {
    if (monthlyBudget == null || record.monthlyDeposit == null) return null;
    return monthlyBudget >= record.monthlyDeposit;
  }
  if (lumpSum == null || record.lumpDeposit == null) return null;
  return lumpSum >= record.lumpDeposit;
}
