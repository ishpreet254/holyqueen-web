"use client";

import { useMemo, useState } from "react";

const SCHEME_OPTIONS = [
  { value: "10", label: "Monthly Pension Scheme" },
  { value: "11", label: "Laksha Sulthan" },
  { value: "12.5", label: "Regular FD 5+ Years" },
  { value: "8.75", label: "Short Term 365 Days" },
];

const formatCurrency = (value) =>
  `Rs.${Math.round(value).toLocaleString("en-IN")}`;

export default function Calculator() {
  const [amount, setAmount] = useState(120000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(3);

  const { maturity, interest, monthly, bars } = useMemo(() => {
    const principal = Number(amount || 0);
    const annualRate = Number(rate);
    const duration = Number(years);
    const result = principal * Math.pow(1 + annualRate / 100, duration);
    const interestValue = result - principal;
    const monthlyValue = (principal * annualRate) / 100 / 12;

    const values = Array.from({ length: duration + 1 }, (_, year) =>
      principal * Math.pow(1 + annualRate / 100, year)
    );
    const max = Math.max(...values);
    const barHeights = values.map((value, index) => ({
      key: index,
      height: Math.max(10, (value / max) * 100),
      title: `Year ${index}: ${formatCurrency(value)}`,
      delay: index * 45,
    }));

    return {
      maturity: formatCurrency(result),
      interest: formatCurrency(interestValue),
      monthly: formatCurrency(monthlyValue),
      bars: barHeights,
    };
  }, [amount, rate, years]);

  const handleSchemeChange = (event) => {
    setRate(Number(event.target.value));
  };

  const handleDownload = () => {
    const text = [
      "Holy Queen Investment Summary",
      `Deposit: ${formatCurrency(Number(amount || 0))}`,
      `Rate: ${rate}%`,
      `Duration: ${years} years`,
      `Estimated maturity: ${maturity}`,
      `Estimated interest: ${interest}`,
      "Final terms must be confirmed at branch.",
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "holy-queen-investment-summary.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <section className="calculator section" id="calculator">
      <div className="section-heading centered reveal">
        <span className="eyebrow">Interest Calculator</span>
        <h2>Visualize your future wealth before you invest.</h2>
      </div>
      <div className="calculator-shell reveal">
        <form className="calc-controls" aria-label="Investment calculator">
          <label>
            Deposit Amount
            <input
              type="number"
              value={amount}
              min="500"
              step="500"
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>
          <label>
            Annual Interest Rate
            <input
              type="range"
              value={rate}
              min="3"
              max="12.5"
              step="0.25"
              onChange={(event) => setRate(Number(event.target.value))}
            />
            <span>{rate}%</span>
          </label>
          <label>
            Duration
            <input
              type="range"
              value={years}
              min="1"
              max="8"
              step="1"
              onChange={(event) => setYears(Number(event.target.value))}
            />
            <span>
              {years} {Number(years) === 1 ? "year" : "years"}
            </span>
          </label>
          <label>
            Compare Scheme
            <select onChange={handleSchemeChange} defaultValue="10">
              {SCHEME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </form>
        <div className="calc-result">
          <div className="result-top">
            <p>Estimated maturity</p>
            <strong>{maturity}</strong>
          </div>
          <div className="result-row">
            <span>Estimated interest</span>
            <strong>{interest}</strong>
          </div>
          <div className="result-row">
            <span>Monthly income preview</span>
            <strong>{monthly}</strong>
          </div>
          <div className="chart" aria-label="Projected growth chart">
            {bars.map((bar) => (
              <span
                key={bar.key}
                className="bar"
                title={bar.title}
                style={{
                  height: `${bar.height}%`,
                  animationDelay: `${bar.delay}ms`,
                }}
              ></span>
            ))}
          </div>
          <button
            className="button primary summary-button"
            type="button"
            onClick={handleDownload}
          >
            Download Summary
          </button>
        </div>
      </div>
    </section>
  );
}
