"use client";

import { useMemo, useState } from "react";
import { fdLadder, seniorUplift, recurringDeposit } from "@/content/rates";
import { schemes } from "@/content/schemes";
import { site } from "@/content/site";
import { downloadFdReport, downloadRdReport, downloadCompareReport } from "@/lib/pdfReport";
import { rankSchemes, pickBestValue, fitsBudget } from "@/lib/schemeMath";

const inr = (value) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

const COMPOUNDING = [
  { value: "4", label: "Quarterly (recommended)" },
  { value: "12", label: "Monthly" },
  { value: "1", label: "Annually" },
  { value: "0", label: "Simple interest" },
];

const RD_TENURES = [
  { value: "12", label: "12 months (Recurring Deposit)" },
  { value: "36", label: "36 months" },
  { value: "60", label: "60 months" },
];

function FixedCalculator() {
  const [amount, setAmount] = useState(100000);
  const [ladderIndex, setLadderIndex] = useState(5);
  const [senior, setSenior] = useState(false);
  const [frequency, setFrequency] = useState("4");

  const result = useMemo(() => {
    const slab = fdLadder[ladderIndex];
    const useUplift = senior && slab.days >= 366;
    const rate = useUplift ? seniorUplift.rate : slab.rate;
    const principal = Math.max(0, Number(amount) || 0);
    const years = slab.days / 365;
    const n = Number(frequency);

    const maturity =
      n === 0
        ? principal * (1 + (rate / 100) * years)
        : principal * Math.pow(1 + rate / 100 / n, n * years);

    const steps = Math.max(2, Math.min(8, Math.ceil(years) + 1));
    const series = Array.from({ length: steps }, (_, index) => {
      const t = (years / (steps - 1)) * index;
      return n === 0
        ? principal * (1 + (rate / 100) * t)
        : principal * Math.pow(1 + rate / 100 / n, n * t);
    });
    const max = Math.max(...series);

    return {
      rate,
      slab,
      useUplift,
      maturity,
      interest: maturity - principal,
      years,
      n,
      bars: series.map((value, index) => ({
        key: index,
        height: Math.max(8, (value / max) * 100),
        title: inr(value),
      })),
    };
  }, [amount, ladderIndex, senior, frequency]);

  const allSlabs = useMemo(() => {
    const principal = Math.max(0, Number(amount) || 0);
    const n = Number(frequency);
    return fdLadder.map((slab, index) => {
      const useUplift = senior && slab.days >= 366;
      const rate = useUplift ? seniorUplift.rate : slab.rate;
      const years = slab.days / 365;
      const maturity =
        n === 0
          ? principal * (1 + (rate / 100) * years)
          : principal * Math.pow(1 + rate / 100 / n, n * years);
      return { index, slab, rate, maturity };
    });
  }, [amount, senior, frequency]);

  const frequencyLabel =
    COMPOUNDING.find((option) => option.value === frequency)?.label ?? frequency;

  return (
    <div className="calculator-shell">
      <div className="calc-controls">
        <label>
          Deposit amount
          <input
            type="number"
            inputMode="numeric"
            min="500"
            step="500"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <label>
          Tenure
          <select
            value={ladderIndex}
            onChange={(event) => setLadderIndex(Number(event.target.value))}
          >
            {fdLadder.map((slab, index) => (
              <option key={slab.label} value={index}>
                {slab.label} — {slab.rate}%
              </option>
            ))}
          </select>
        </label>
        <label>
          Interest payout
          <select
            value={frequency}
            onChange={(event) => setFrequency(event.target.value)}
          >
            {COMPOUNDING.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="calc-check">
          <input
            type="checkbox"
            checked={senior}
            onChange={(event) => setSenior(event.target.checked)}
          />
          Senior citizen / reserved category
        </label>
        <p className="calc-note">
          Tenures come from the society&apos;s own rate ladder, so the
          calculator can only ever use a rate we actually offer.
        </p>
      </div>

      <div className="calc-result">
        <div className="result-top">
          <p>Estimated maturity</p>
          <strong>{inr(result.maturity)}</strong>
        </div>
        <div className="result-row">
          <span>Estimated interest</span>
          <strong>{inr(result.interest)}</strong>
        </div>
        <div className="result-row">
          <span>Rate applied</span>
          <strong>{result.rate}% p.a.</strong>
        </div>
        <div className="result-row">
          <span>Period</span>
          <strong>{result.slab.label}</strong>
        </div>
        {senior && !result.useUplift && (
          <p className="calc-note">
            The reserved-category rate applies to deposits of 366 days and
            above, so this tenure uses the standard rate.
          </p>
        )}
        <div className="chart" aria-hidden="true">
          {result.bars.map((bar) => (
            <span
              key={bar.key}
              className="bar"
              title={bar.title}
              style={{ height: `${bar.height}%` }}
            ></span>
          ))}
        </div>
        <p className="calc-note calc-note-heading">
          Compare across tenures for the same deposit amount
        </p>
        <ul className="tenure-compare">
          {allSlabs.map((row) => (
            <li
              key={row.slab.label}
              className={row.index === ladderIndex ? "current" : undefined}
            >
              <button
                type="button"
                className="tenure-compare-select"
                onClick={() => setLadderIndex(row.index)}
              >
                <strong>{row.slab.label}</strong>
                <span>{row.rate}% p.a.</span>
              </button>
              <span className="tenure-compare-value">{inr(row.maturity)}</span>
            </li>
          ))}
        </ul>
        <ResultActions
          title="Fixed Deposit — estimate"
          waLines={[
            `Deposit: ${inr(Number(amount) || 0)}`,
            `Tenure: ${result.slab.label}`,
            `Interest payout: ${frequencyLabel}`,
            `Rate: ${result.rate}% p.a.`,
            `Estimated interest: ${inr(result.interest)}`,
            `Estimated maturity: ${inr(result.maturity)}`,
          ]}
          buildPdf={() =>
            downloadFdReport({
              amount: Number(amount) || 0,
              slabLabel: result.slab.label,
              frequencyLabel,
              rate: result.rate,
              years: result.years,
              compoundingN: result.n,
              maturity: result.maturity,
              interest: result.interest,
              senior,
              usedUplift: result.useUplift,
              schemesList: schemes,
              filename: "holy-queen-fd-report.pdf",
            })
          }
        />
      </div>
    </div>
  );
}

function RecurringCalculator() {
  const [installment, setInstallment] = useState(500);
  const [months, setMonths] = useState("12");

  const result = useMemo(() => {
    const monthly = Math.max(0, Number(installment) || 0);
    const count = Number(months);
    const rate = Number(recurringDeposit.headline.replace("%", ""));
    const i = rate / 100 / 12;
    const maturity =
      i === 0 ? monthly * count : monthly * ((Math.pow(1 + i, count) - 1) / i) * (1 + i);
    const invested = monthly * count;
    return { maturity, invested, interest: maturity - invested, rate, count };
  }, [installment, months]);

  const allTenures = useMemo(() => {
    const monthly = Math.max(0, Number(installment) || 0);
    const rate = Number(recurringDeposit.headline.replace("%", ""));
    const i = rate / 100 / 12;
    return RD_TENURES.map((option) => {
      const count = Number(option.value);
      const maturity =
        i === 0 ? monthly * count : monthly * ((Math.pow(1 + i, count) - 1) / i) * (1 + i);
      return { option, maturity, invested: monthly * count };
    });
  }, [installment]);

  return (
    <div className="calculator-shell">
      <div className="calc-controls">
        <label>
          Monthly instalment
          <input
            type="number"
            inputMode="numeric"
            min="500"
            step="100"
            value={installment}
            onChange={(event) => setInstallment(event.target.value)}
          />
        </label>
        <label>
          Tenure
          <select value={months} onChange={(event) => setMonths(event.target.value)}>
            {RD_TENURES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="calc-note">
          Minimum ₹500 per month, minimum 12 months, {recurringDeposit.headline}{" "}
          interest annually. Figures use monthly compounding of each instalment.
        </p>
      </div>

      <div className="calc-result">
        <div className="result-top">
          <p>Estimated maturity</p>
          <strong>{inr(result.maturity)}</strong>
        </div>
        <div className="result-row">
          <span>Total invested</span>
          <strong>{inr(result.invested)}</strong>
        </div>
        <div className="result-row">
          <span>Interest earned</span>
          <strong>{inr(result.interest)}</strong>
        </div>
        <div className="result-row">
          <span>Rate applied</span>
          <strong>{result.rate}% p.a.</strong>
        </div>
        <p className="calc-note calc-note-heading">
          Compare across tenures for the same monthly instalment
        </p>
        <ul className="tenure-compare">
          {allTenures.map((row) => (
            <li
              key={row.option.value}
              className={row.option.value === months ? "current" : undefined}
            >
              <button
                type="button"
                className="tenure-compare-select"
                onClick={() => setMonths(row.option.value)}
              >
                <strong>{row.option.value} months</strong>
                <span>invested {inr(row.invested)}</span>
              </button>
              <span className="tenure-compare-value">{inr(row.maturity)}</span>
            </li>
          ))}
        </ul>
        <ResultActions
          title="Recurring Deposit — estimate"
          waLines={[
            `Monthly instalment: ${inr(Number(installment) || 0)}`,
            `Tenure: ${result.count} months`,
            `Rate: ${result.rate}% p.a.`,
            `Total invested: ${inr(result.invested)}`,
            `Interest earned: ${inr(result.interest)}`,
            `Estimated maturity: ${inr(result.maturity)}`,
          ]}
          buildPdf={() =>
            downloadRdReport({
              installment: Number(installment) || 0,
              months: result.count,
              rate: result.rate,
              maturity: result.maturity,
              invested: result.invested,
              interest: result.interest,
              schemesList: schemes,
              filename: "holy-queen-rd-report.pdf",
            })
          }
        />
      </div>
    </div>
  );
}

function SchemeComparator() {
  const [monthlyBudget, setMonthlyBudget] = useState(2500);
  const [lumpSum, setLumpSum] = useState(100000);
  const [filter, setFilter] = useState("all"); // all | monthly | lumpsum
  const [sortBy, setSortBy] = useState("value"); // value | returns | tenure | commitment

  const monthlyBudgetNum = Math.max(0, Number(monthlyBudget) || 0);
  const lumpSumNum = Math.max(0, Number(lumpSum) || 0);

  const ranked = useMemo(() => rankSchemes(schemes), []);
  const best = useMemo(() => pickBestValue(ranked), [ranked]);

  const withFit = useMemo(
    () =>
      ranked.map((scheme) => ({
        ...scheme,
        fits: fitsBudget(scheme, { monthlyBudget: monthlyBudgetNum, lumpSum: lumpSumNum }),
      })),
    [ranked, monthlyBudgetNum, lumpSumNum]
  );

  const visible = useMemo(() => {
    const filtered = withFit.filter((s) => filter === "all" || s.type === filter);
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "returns":
          return (b.totalValue ?? 0) - (a.totalValue ?? 0);
        case "tenure":
          return (a.months ?? Infinity) - (b.months ?? Infinity);
        case "commitment":
          return (a.monthlyDeposit ?? a.lumpDeposit ?? Infinity) - (b.monthlyDeposit ?? b.lumpDeposit ?? Infinity);
        case "value":
        default:
          return (b.effectiveAnnualPct ?? -Infinity) - (a.effectiveAnnualPct ?? -Infinity);
      }
    });
    return sorted;
  }, [withFit, filter, sortBy]);

  return (
    <div className="comparator">
      <div className="comparator-inputs">
        <label className="comparator-input">
          Monthly budget
          <input
            type="number"
            inputMode="numeric"
            min="0"
            step="100"
            value={monthlyBudget}
            onChange={(event) => setMonthlyBudget(event.target.value)}
          />
        </label>
        <label className="comparator-input">
          One-time amount available
          <input
            type="number"
            inputMode="numeric"
            min="0"
            step="1000"
            value={lumpSum}
            onChange={(event) => setLumpSum(event.target.value)}
          />
        </label>
      </div>

      <div className="comparator-toolbar">
        <div className="filter-pills" role="tablist" aria-label="Filter schemes">
          {[
            { id: "all", label: "All schemes" },
            { id: "monthly", label: "Monthly plans" },
            { id: "lumpsum", label: "One-time deposits" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              className={filter === option.id ? "active" : undefined}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          aria-label="Sort schemes by"
        >
          <option value="value">Sort: Best value first</option>
          <option value="returns">Sort: Highest total returns</option>
          <option value="tenure">Sort: Shortest tenure first</option>
          <option value="commitment">Sort: Lowest commitment first</option>
        </select>
      </div>

      <ul className="comparator-list">
        {visible.map((scheme) => {
          const isBest = best && scheme.slug === best.slug;
          return (
            <li key={scheme.slug} className={[scheme.fits ? "fits" : null, isBest ? "best" : null].filter(Boolean).join(" ") || undefined}>
              <div>
                <div className="scheme-meta">
                  <strong>{scheme.title}</strong>
                  <span className="scheme-type-pill">
                    {scheme.type === "monthly" ? "Monthly" : "One-time"}
                  </span>
                  {isBest && <span className="best-badge">Best value</span>}
                </div>
                <span>
                  {scheme.deposit} · {scheme.tenure}
                </span>
                {scheme.effectiveAnnualPct != null && (
                  <span className="comparator-yield">
                    Effective yield ~{scheme.effectiveAnnualPct.toFixed(1)}% p.a.
                  </span>
                )}
              </div>
              <div className="comparator-return">
                <strong>{scheme.returns}</strong>
                <span>
                  {scheme.fits === true
                    ? "Within your budget"
                    : scheme.fits === false
                    ? scheme.type === "monthly"
                      ? `Needs ${inr(scheme.monthlyDeposit)}/month`
                      : `Needs ${inr(scheme.lumpDeposit)} one-time`
                    : "—"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="calc-note">
        The Queen Cash Certificate accepts deposits in multiples of ₹1,00,000. Effective
        yield is a simple annualised estimate so schemes of different tenures can be
        compared fairly — final figures are always confirmed at the branch.
      </p>
      <ResultActions
        title="Scheme comparison"
        waLines={[
          `Monthly budget: ${inr(monthlyBudgetNum)}`,
          `One-time amount available: ${inr(lumpSumNum)}`,
          ...ranked.map((scheme) => {
            const fits = fitsBudget(scheme, { monthlyBudget: monthlyBudgetNum, lumpSum: lumpSumNum });
            const need =
              fits === false
                ? scheme.type === "monthly"
                  ? ` — needs ${inr(scheme.monthlyDeposit)}/month`
                  : ` — needs ${inr(scheme.lumpDeposit)} one-time`
                : fits === true
                ? " — within budget"
                : "";
            return `${scheme.title}: ${scheme.deposit}, ${scheme.tenure}, ${scheme.returns}${need}`;
          }),
        ]}
        buildPdf={() =>
          downloadCompareReport({
            monthlyBudget: monthlyBudgetNum,
            lumpSum: lumpSumNum,
            schemesList: schemes,
            filename: "holy-queen-scheme-comparison.pdf",
          })
        }
      />
    </div>
  );
}

function ResultActions({ title, waLines, buildPdf }) {
  const [status, setStatus] = useState("idle"); // idle | working | error
  const text = encodeURIComponent(
    [`Hello ${site.shortName},`, "", "I used the calculator on your website:", ...waLines, "", "Please confirm the exact figures."].join("\n")
  );

  const handleDownload = async () => {
    if (status === "working") return;
    setStatus("working");
    try {
      await buildPdf();
      setStatus("idle");
    } catch (error) {
      console.error(`Could not build the ${title} PDF`, error);
      setStatus("error");
    }
  };

  return (
    <div className="result-actions">
      <a
        className="button primary summary-button"
        href={`https://wa.me/${site.whatsapp}?text=${text}`}
        target="_blank"
        rel="noreferrer"
      >
        Send to the branch on WhatsApp
      </a>
      <button
        type="button"
        className="button secondary summary-button"
        onClick={handleDownload}
        disabled={status === "working"}
      >
        {status === "working" ? "Preparing PDF…" : "Download report"}
      </button>
      {status === "error" && (
        <p className="calc-note" role="alert">
          The PDF could not be created. Please try again.
        </p>
      )}
    </div>
  );
}

const TABS = [
  { id: "fd", label: "Fixed Deposit" },
  { id: "rd", label: "Recurring Deposit" },
  { id: "compare", label: "Compare schemes" },
];

export default function Calculators() {
  const [tab, setTab] = useState("fd");

  return (
    <div className="calc-tabs">
      <div className="tab-strip" role="tablist" aria-label="Calculators">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            className={tab === item.id ? "active" : undefined}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {/* "reveal" lives here, on the one panel node that survives every tab
          switch — putting it on each calculator instead (as before) meant
          switching tabs mounted a brand-new, not-yet-"visible" node with no
          scroll event left to trigger it, so the panel stayed invisible
          until a hard refresh re-ran the initial reveal check. */}
      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="tab-panel reveal"
      >
        {tab === "fd" && <FixedCalculator />}
        {tab === "rd" && <RecurringCalculator />}
        {tab === "compare" && <SchemeComparator />}
      </div>
    </div>
  );
}
