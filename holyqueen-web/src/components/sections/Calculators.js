"use client";

import { useMemo, useState } from "react";
import { fdLadder, seniorUplift, recurringDeposit } from "@/content/rates";
import { schemes } from "@/content/schemes";
import { site } from "@/content/site";

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
      bars: series.map((value, index) => ({
        key: index,
        height: Math.max(8, (value / max) * 100),
        title: inr(value),
      })),
    };
  }, [amount, ladderIndex, senior, frequency]);

  return (
    <div className="calculator-shell reveal">
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
        <SendToBranch
          lines={[
            `Deposit: ${inr(Number(amount) || 0)}`,
            `Tenure: ${result.slab.label}`,
            `Rate: ${result.rate}%`,
            `Estimated maturity: ${inr(result.maturity)}`,
          ]}
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

  return (
    <div className="calculator-shell reveal">
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
        <SendToBranch
          lines={[
            `Monthly instalment: ${inr(Number(installment) || 0)}`,
            `Tenure: ${result.count} months`,
            `Estimated maturity: ${inr(result.maturity)}`,
          ]}
        />
      </div>
    </div>
  );
}

function SchemeComparator() {
  const [capacity, setCapacity] = useState(2500);
  const value = Math.max(0, Number(capacity) || 0);

  const monthlySchemes = schemes.filter((scheme) =>
    scheme.deposit.includes("per month")
  );

  const parseMonthly = (scheme) =>
    Number(scheme.deposit.replace(/[^0-9]/g, "")) || 0;

  return (
    <div className="comparator reveal">
      <label className="comparator-input">
        What can you set aside each month?
        <input
          type="number"
          inputMode="numeric"
          min="0"
          step="100"
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
        />
      </label>
      <ul className="comparator-list">
        {monthlySchemes.map((scheme) => {
          const needed = parseMonthly(scheme);
          const fits = value >= needed;
          return (
            <li key={scheme.slug} className={fits ? "fits" : undefined}>
              <div>
                <strong>{scheme.title}</strong>
                <span>
                  {scheme.deposit} · {scheme.tenure}
                </span>
              </div>
              <div className="comparator-return">
                <strong>{scheme.returns}</strong>
                <span>{fits ? "Within your budget" : `Needs ${inr(needed)}/month`}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="calc-note">
        The Queen Cash Certificate and Monthly Pension Scheme take a one-time
        deposit rather than a monthly instalment — see the special schemes page.
      </p>
    </div>
  );
}

function SendToBranch({ lines }) {
  const text = encodeURIComponent(
    [`Hello ${site.shortName},`, "", "I used the calculator on your website:", ...lines, "", "Please confirm the exact figures."].join("\n")
  );
  return (
    <a
      className="button primary summary-button"
      href={`https://wa.me/${site.whatsapp}?text=${text}`}
      target="_blank"
      rel="noreferrer"
    >
      Send to the branch on WhatsApp
    </a>
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
      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="tab-panel"
      >
        {tab === "fd" && <FixedCalculator />}
        {tab === "rd" && <RecurringCalculator />}
        {tab === "compare" && <SchemeComparator />}
      </div>
    </div>
  );
}
