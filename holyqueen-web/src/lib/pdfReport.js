/* ============================================================
   HOLY QUEEN — PDF REPORT ENGINE
   Turns a calculator result into a premium, branded, multi-page
   PDF: cover, key figures, a real chart, a scheme comparison,
   a "why Holy Queen" section and a branch/contact card.

   Built on jsPDF only (vector drawing — no server, no
   screenshots), so it works fully client-side and stays crisp
   at any zoom or print size.
   ============================================================ */

import { jsPDF } from "jspdf";
import { site, strengths, assurances, trustChips } from "@/content/site";

/* ---------- brand palette (mirrors src/styles/tokens.css) ---------- */
const C = {
  navy: "#10233b",
  midnight: "#06111f",
  royal: "#1d3557",
  ink: "#0e2137",
  gold: "#f6c967",
  goldDeep: "#a9761c",
  goldStrong: "#d79b31",
  champagne: "#fff0bd",
  ivory: "#fffaf0",
  paper: "#fbf8f2",
  sand: "#f4efe4",
  white: "#ffffff",
  muted: "#55677c",
  mutedLight: "#8b98a8",
  line: "rgba(14,33,55,0.14)",
  border: "#e4dcc8",
};

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 15;
const CONTENT_W = PAGE_W - MARGIN * 2;

const inr = (value) => `Rs. ${Math.round(value).toLocaleString("en-IN")}`;

/* Content strings from src/content use the ₹ glyph, which the standard
   PDF fonts (Helvetica/Times) don't carry — swap it for plain text so
   every figure renders instead of showing a missing-glyph box. */
const pdfSafe = (str) => String(str).replace(/₹/g, "Rs. ").replace(/\s+/g, " ").trim();

/* ---------- small colour + drawing helpers ---------- */

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function lerpColor(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/** Fills a rect with a smooth vertical gradient by stacking thin strips. */
function verticalGradient(doc, x, y, w, h, topHex, bottomHex, steps = 60) {
  const stepH = h / steps;
  for (let i = 0; i < steps; i += 1) {
    const t = i / (steps - 1);
    const [r, g, b] = lerpColor(topHex, bottomHex, t);
    doc.setFillColor(r, g, b);
    // slight overlap so no hairline seams show between strips
    doc.rect(x, y + i * stepH, w, stepH + 0.3, "F");
  }
}

function paperBackground(doc) {
  doc.setFillColor(C.paper);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
}

function addNewPage(doc) {
  doc.addPage();
  paperBackground(doc);
}

/** Adds a page if the remaining space is under `needed` mm; returns cursor y. */
function ensureSpace(doc, y, needed) {
  if (y + needed > PAGE_H - 24) {
    addNewPage(doc);
    return MARGIN + 8;
  }
  return y;
}

function refId(prefix) {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(
    d.getHours()
  )}${pad(d.getMinutes())}`;
  return `HQ-${prefix}-${stamp}`;
}

async function loadLogoDataUrl() {
  try {
    const res = await fetch("/logo/holy-queen-logo.png");
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/* ---------- cover band ---------- */

function drawCover(doc, { title, subtitle, refCode, logoDataUrl }) {
  const bandH = 96;
  verticalGradient(doc, 0, 0, PAGE_W, bandH, C.royal, C.midnight);

  // gold corner ticks — a restrained "certificate" touch
  doc.setDrawColor(C.gold);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, 9, MARGIN + 9, 9);
  doc.line(MARGIN, 9, MARGIN, 18);
  doc.line(PAGE_W - MARGIN, 9, PAGE_W - MARGIN - 9, 9);
  doc.line(PAGE_W - MARGIN, 9, PAGE_W - MARGIN, 18);

  // logo mark
  if (logoDataUrl) {
    try {
      const w = 24;
      const h = 24 * (439 / 568);
      doc.addImage(logoDataUrl, "PNG", MARGIN, 16, w, h);
    } catch {
      /* fall through silently — the crest text still carries the brand */
    }
  }

  doc.setFont("times", "bold");
  doc.setFontSize(16.5);
  doc.setTextColor(C.ivory);
  const nameLines = doc.splitTextToSize(site.legalName, 130);
  doc.text(nameLines, MARGIN + 30, 24);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(C.gold);
  doc.text(site.tagline, MARGIN + 30, 24 + nameLines.length * 5.6 + 2);

  doc.setDrawColor(C.gold);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, 46, PAGE_W - MARGIN, 46);

  doc.setFont("times", "bold");
  doc.setFontSize(23);
  doc.setTextColor(C.champagne);
  const titleLines = doc.splitTextToSize(title, PAGE_W - MARGIN * 2);
  doc.text(titleLines, MARGIN, 60);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor("#cdd8e4");
  const subtitleY = 60 + (titleLines.length - 1) * 8.5 + 9;
  doc.text(subtitle, MARGIN, subtitleY);

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#9fb0c2");
  doc.text(`Report ref: ${refCode}`, MARGIN, bandH - 8);
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, PAGE_W - MARGIN, bandH - 8, { align: "right" });

  return bandH;
}

function sectionTitle(doc, x, y, text) {
  doc.setFillColor(C.goldDeep);
  doc.rect(x, y - 4.2, 2, 5.6, "F");
  doc.setFont("times", "bold");
  doc.setFontSize(13.5);
  doc.setTextColor(C.ink);
  doc.text(text, x + 5, y);
  return y;
}

/* ---------- key figures / highlight card ---------- */

function drawHighlightCard(doc, x, y, w, { label, value, chips }) {
  const h = 40;
  doc.setFillColor(C.white);
  doc.setDrawColor(C.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, 4, 4, "FD");
  doc.setFillColor(C.goldDeep);
  doc.roundedRect(x, y, 2.2, h, 1, 1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(C.goldDeep);
  doc.text(label.toUpperCase(), x + 10, y + 11, { charSpace: 0.4 });

  doc.setFont("times", "bold");
  doc.setFontSize(25);
  doc.setTextColor(C.navy);
  doc.text(value, x + 10, y + 25);

  const chipsY = y + 32;
  let cx = x + 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.7);
  chips.forEach((chip, i) => {
    const txt = `${chip.label}: ${chip.value}`;
    doc.setTextColor(C.muted);
    doc.text(txt, cx, chipsY);
    cx += doc.getTextWidth(txt) + 6;
    if (i < chips.length - 1) {
      doc.setTextColor(C.mutedLight);
      doc.text("|", cx - 3, chipsY);
    }
  });

  return y + h;
}

/* ---------- key/value input table ---------- */

function drawKVRows(doc, x, y, w, rows) {
  let cursorY = y;
  rows.forEach((row, i) => {
    const rowH = 9;
    if (i % 2 === 0) {
      doc.setFillColor(C.sand);
      doc.rect(x, cursorY, w, rowH, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(C.muted);
    doc.text(row[0], x + 4, cursorY + 6.2);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(C.ink);
    doc.text(String(row[1]), x + w - 4, cursorY + 6.2, { align: "right" });
    cursorY += rowH;
  });
  doc.setDrawColor(C.border);
  doc.setLineWidth(0.25);
  doc.rect(x, y, w, cursorY - y, "S");
  return cursorY;
}

/* ---------- grouped bar chart ---------- */

/**
 * groups: [{ label, bars: [{ value, colorHex, format }], ribbon? }]
 * legend: [{ label, colorHex }] optional
 */
function drawGroupedBarChart(doc, x, y, w, h, groups, legend) {
  doc.setFillColor(C.white);
  doc.setDrawColor(C.border);
  doc.roundedRect(x, y, w, h, 3, 3, "FD");

  const padTop = legend ? 16 : 11;
  const padBottom = 12;
  const padSide = 6;
  const chartX = x + padSide;
  const chartW = w - padSide * 2;
  const chartH = h - padTop - padBottom;
  const baseline = y + padTop + chartH;

  const maxVal = Math.max(
    1,
    ...groups.flatMap((g) => g.bars.map((b) => b.value))
  );

  if (legend) {
    let lx = x + padSide;
    const ly = y + 9;
    doc.setFontSize(7.6);
    legend.forEach((item) => {
      doc.setFillColor(item.colorHex);
      doc.roundedRect(lx, ly - 3, 3.4, 3.4, 0.6, 0.6, "F");
      doc.setFont("helvetica", "normal");
      doc.setTextColor(C.muted);
      doc.text(item.label, lx + 5, ly);
      lx += doc.getTextWidth(item.label) + 14;
    });
  }

  const groupW = chartW / groups.length;
  groups.forEach((group, gi) => {
    const gx = chartX + gi * groupW;
    const barsN = group.bars.length;
    const barGap = 1.6;
    const barW = Math.min(14, (groupW * 0.62 - barGap * (barsN - 1)) / barsN);
    const groupBarsW = barW * barsN + barGap * (barsN - 1);
    const startX = gx + (groupW - groupBarsW) / 2;

    let tallest = 0;
    group.bars.forEach((bar, bi) => {
      const barH = Math.max(1.2, (bar.value / maxVal) * chartH);
      const barX = startX + bi * (barW + barGap);
      const barY = baseline - barH;
      doc.setFillColor(bar.colorHex);
      doc.roundedRect(barX, barY, barW, barH, 1, 1, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.6);
      doc.setTextColor(C.ink);
      const label = bar.format ? bar.format(bar.value) : String(Math.round(bar.value));
      doc.text(label, barX + barW / 2, barY - 1.6, { align: "center" });
      tallest = Math.max(tallest, barH);
    });

    if (group.ribbon) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.2);
      const rw = doc.getTextWidth(group.ribbon) + 6;
      const rx = gx + groupW / 2 - rw / 2;
      const ry = baseline - tallest - 9.5;
      doc.setFillColor(C.goldDeep);
      doc.roundedRect(rx, ry, rw, 5, 2.4, 2.4, "F");
      doc.setTextColor(C.white);
      doc.text(group.ribbon, gx + groupW / 2, ry + 3.5, { align: "center" });
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(C.muted);
    doc.text(group.label, gx + groupW / 2, baseline + 6, { align: "center" });
  });

  doc.setDrawColor(C.border);
  doc.setLineWidth(0.3);
  doc.line(chartX, baseline, chartX + chartW, baseline);

  return y + h;
}

/* ---------- growth math (kept in sync with the calculators) ---------- */

function fdGrowthSeries({ principal, ratePercent, years, compoundingN, points = 6 }) {
  return Array.from({ length: points }, (_, i) => {
    const t = (years / (points - 1)) * i;
    const value =
      compoundingN === 0
        ? principal * (1 + (ratePercent / 100) * t)
        : principal * Math.pow(1 + ratePercent / 100 / compoundingN, compoundingN * t);
    const label = i === 0 ? "Start" : i === points - 1 ? "Maturity" : `${Math.round((t / years) * 100)}%`;
    return { label, value };
  });
}

function rdGrowthSeries({ monthly, months, annualRatePercent, points = 5 }) {
  const i = annualRatePercent / 100 / 12;
  const checkpoints = Array.from({ length: points }, (_, idx) =>
    Math.max(1, Math.round((months / (points - 1)) * idx))
  );
  const unique = Array.from(new Set(checkpoints));
  return unique.map((k, idx) => {
    const invested = monthly * k;
    const value = i === 0 ? monthly * k : monthly * ((Math.pow(1 + i, k) - 1) / i) * (1 + i);
    const label = idx === 0 ? "Month 1" : idx === unique.length - 1 ? "Maturity" : `Mo. ${k}`;
    return { label, invested, value };
  });
}

/* ---------- scheme comparison table ---------- */

function parseTotalValue(returnsText) {
  const matches = returnsText.match(/₹[\d,]+/g) || [];
  return matches.reduce((sum, m) => sum + (Number(m.replace(/[^\d]/g, "")) || 0), 0);
}

function parseMonths(tenureText) {
  const m = tenureText.match(/(\d+)\s*month/i);
  if (m) return Number(m[1]);
  const y = tenureText.match(/(\d+)\s*year/i);
  if (y) return Number(y[1]) * 12;
  return null;
}

function parseMonthlyDeposit(depositText) {
  if (!depositText.includes("per month")) return null;
  return Number(depositText.replace(/[^\d]/g, "")) || 0;
}

/** Computes an effective annualised value score so tenures of different
 * lengths can be compared fairly, then marks the strongest one. */
function rankSchemesByValue(schemeList) {
  return schemeList.map((scheme) => {
    const months = parseMonths(scheme.tenure);
    const monthlyDeposit = parseMonthlyDeposit(scheme.deposit);
    const totalValue = parseTotalValue(scheme.returns);
    let invested = null;
    let effectiveAnnualPct = null;
    if (monthlyDeposit && months) {
      invested = monthlyDeposit * months;
      const years = months / 12;
      if (invested > 0 && years > 0) {
        effectiveAnnualPct = ((totalValue - invested) / invested / years) * 100;
      }
    }
    return { ...scheme, months, monthlyDeposit, invested, totalValue, effectiveAnnualPct };
  });
}

function drawSchemeTable(doc, x, y, w, schemesRanked, { capacity, bestSlug } = {}) {
  let cursorY = y;
  const rowH = 17.5;
  schemesRanked.forEach((s, i) => {
    cursorY = ensureSpace(doc, cursorY, rowH + 4);
    const isBest = s.slug === bestSlug;
    const fits =
      capacity != null && s.monthlyDeposit != null ? capacity >= s.monthlyDeposit : null;

    doc.setFillColor(isBest ? "#fdf3dd" : i % 2 === 0 ? C.white : C.sand);
    doc.roundedRect(x, cursorY, w, rowH, 2, 2, "F");
    doc.setDrawColor(isBest ? C.goldDeep : C.border);
    doc.setLineWidth(isBest ? 0.5 : 0.25);
    doc.roundedRect(x, cursorY, w, rowH, 2, 2, "S");
    doc.setFillColor(isBest ? C.goldDeep : C.royal);
    doc.rect(x, cursorY, 1.6, rowH, "F");

    doc.setFont("times", "bold");
    doc.setFontSize(10.2);
    doc.setTextColor(C.ink);
    doc.text(s.title, x + 6, cursorY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(C.muted);
    doc.text(pdfSafe(`${s.deposit}  ·  ${s.tenure}`), x + 6, cursorY + 12.3);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.3);
    doc.setTextColor(C.navy);
    doc.text(pdfSafe(s.returns), x + w - 6, cursorY + 7, { align: "right" });

    const badgeY = cursorY + 13.2;
    let badgeText;
    let badgeColor = C.mutedLight;
    if (isBest) {
      badgeText = "Best value for your money";
      badgeColor = C.goldDeep;
    } else if (s.monthlyDeposit == null) {
      badgeText = "One-time deposit scheme";
    } else if (fits === true) {
      badgeText = "Within your monthly budget";
      badgeColor = C.muted;
    } else if (fits === false) {
      badgeText = `Needs ${inr(s.monthlyDeposit)}/month`;
    } else {
      badgeText = "Recurring monthly scheme";
    }
    doc.setFont("helvetica", isBest ? "bold" : "normal");
    doc.setFontSize(7.4);
    doc.setTextColor(badgeColor);
    doc.text(badgeText, x + w - 6, badgeY, { align: "right" });

    cursorY += rowH + 3;
  });
  return cursorY;
}

/* ---------- "why Holy Queen" + branch sections ---------- */

function drawWhyHolyQueen(doc, x, y, w) {
  let cursorY = sectionTitle(doc, x, y, "Why Members Choose Holy Queen") + 6;
  const colW = w / 2 - 3;
  strengths.slice(0, 4).forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const bx = x + col * (colW + 6);
    const by = cursorY + row * 20;
    doc.setFillColor(C.goldDeep);
    doc.circle(bx + 1.4, by + 1.3, 1.4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.3);
    doc.setTextColor(C.ink);
    doc.text(s.title, bx + 5.5, by + 2.2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(C.muted);
    const lines = doc.splitTextToSize(s.body, colW - 6);
    doc.text(lines, bx + 5.5, by + 6.6);
  });
  cursorY += Math.ceil(Math.min(strengths.length, 4) / 2) * 20 + 4;

  let chipX = x;
  let chipY = cursorY;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  trustChips.forEach((chip) => {
    const cw = doc.getTextWidth(chip) + 7;
    if (chipX + cw > x + w) {
      chipX = x;
      chipY += 8;
    }
    doc.setFillColor(C.sand);
    doc.setDrawColor(C.border);
    doc.roundedRect(chipX, chipY, cw, 6.4, 3.2, 3.2, "FD");
    doc.setTextColor(C.goldDeep);
    doc.text(chip, chipX + cw / 2, chipY + 4.3, { align: "center" });
    chipX += cw + 3;
  });
  chipY += 10;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.6);
  doc.setTextColor(C.mutedLight);
  const assureLine = assurances.join("   ·   ");
  const aLines = doc.splitTextToSize(assureLine, w);
  doc.text(aLines, x, chipY);
  return chipY + aLines.length * 3.6 + 4;
}

function drawBranchSection(doc, x, y, w) {
  let cursorY = sectionTitle(doc, x, y, "Visit or Call Your Branch") + 6;
  const h = 34;
  doc.setFillColor(C.white);
  doc.setDrawColor(C.border);
  doc.roundedRect(x, cursorY, w, h, 3, 3, "FD");
  doc.setFillColor(C.royal);
  doc.roundedRect(x, cursorY, 2.2, h, 1, 1, "F");

  doc.setFont("times", "bold");
  doc.setFontSize(10.8);
  doc.setTextColor(C.navy);
  doc.text(site.branch.label, x + 9, cursorY + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.6);
  doc.setTextColor(C.muted);
  doc.text(site.branch.line1, x + 9, cursorY + 14.5);
  doc.text(site.branch.line2, x + 9, cursorY + 19);

  const contactY = cursorY + 26;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(C.goldDeep);
  const phoneLabel = `Call: ${site.phoneDisplay}`;
  doc.text(phoneLabel, x + 9, contactY);
  doc.link(x + 9, contactY - 3.4, doc.getTextWidth(phoneLabel), 4.4, {
    url: `tel:${site.phone}`,
  });

  const waLabel = "WhatsApp the branch";
  const waX = x + 9 + doc.getTextWidth(phoneLabel) + 8;
  doc.text(waLabel, waX, contactY);
  doc.link(waX, contactY - 3.4, doc.getTextWidth(waLabel), 4.4, {
    url: `https://wa.me/${site.whatsapp}`,
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.setTextColor(C.muted);
  const emailX = x + w - 9;
  doc.text(site.email, emailX, contactY, { align: "right" });
  const emailW = doc.getTextWidth(site.email);
  doc.link(emailX - emailW, contactY - 3.4, emailW, 4.4, { url: `mailto:${site.email}` });

  return cursorY + h;
}

function drawDisclaimer(doc, x, y, w) {
  doc.setDrawColor(C.border);
  doc.setLineWidth(0.2);
  doc.line(x, y, x + w, y);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.3);
  doc.setTextColor(C.mutedLight);
  const lines = doc.splitTextToSize(site.disclaimer, w);
  doc.text(lines, x, y + 4.5);
  return y + 4.5 + lines.length * 3.2;
}

function stampFooters(doc, refCode) {
  const total = doc.internal.getNumberOfPages();
  for (let p = 1; p <= total; p += 1) {
    doc.setPage(p);
    doc.setDrawColor(C.border);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, PAGE_H - 14, PAGE_W - MARGIN, PAGE_H - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(C.mutedLight);
    doc.text(site.legalName, MARGIN, PAGE_H - 9);
    doc.text(`Page ${p} of ${total}  ·  ${refCode}`, PAGE_W - MARGIN, PAGE_H - 9, {
      align: "right",
    });
  }
}

/* ============================================================
   PUBLIC BUILDERS — one per calculator
   ============================================================ */

export async function downloadFdReport({
  amount,
  slabLabel,
  frequencyLabel,
  rate,
  years,
  compoundingN,
  maturity,
  interest,
  senior,
  usedUplift,
  schemesList,
  filename,
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const code = refId("FD");
  const logo = await loadLogoDataUrl();
  paperBackground(doc);

  let y = drawCover(doc, {
    title: "Fixed Deposit Growth Report",
    subtitle: `Prepared for your enquiry · ${slabLabel} at ${rate}% p.a.`,
    refCode: code,
    logoDataUrl: logo,
  });
  y += 12;

  y = drawHighlightCard(doc, MARGIN, y, CONTENT_W, {
    label: "Estimated maturity value",
    value: inr(maturity),
    chips: [
      { label: "Deposit", value: inr(amount) },
      { label: "Interest earned", value: inr(interest) },
      { label: "Rate applied", value: `${rate}% p.a.` },
    ],
  });
  y += 12;

  y = sectionTitle(doc, MARGIN, y, "Your Deposit Details") + 6;
  y = drawKVRows(doc, MARGIN, y, CONTENT_W, [
    ["Deposit amount", inr(amount)],
    ["Tenure slab", slabLabel],
    ["Interest payout", frequencyLabel],
    ["Rate applied", `${rate}% p.a.`],
    ["Reserved-category rate applied", senior ? (usedUplift ? "Yes" : "No — tenure too short") : "Not requested"],
  ]);
  y += 12;

  y = ensureSpace(doc, y, 82);
  y = sectionTitle(doc, MARGIN, y, "How Your Deposit Grows") + 6;
  const series = fdGrowthSeries({ principal: amount, ratePercent: rate, years, compoundingN });
  y = drawGroupedBarChart(
    doc,
    MARGIN,
    y,
    CONTENT_W,
    62,
    series.map((pt) => ({ label: pt.label, bars: [{ value: pt.value, colorHex: C.goldDeep, format: inr }] })),
    null
  );
  y += 10;

  y = ensureSpace(doc, y, 60);
  y = sectionTitle(doc, MARGIN, y, "Explore Our Other Schemes") + 6;
  const ranked = rankSchemesByValue(schemesList);
  y = drawSchemeTable(doc, MARGIN, y, CONTENT_W, ranked, {});
  y += 6;

  y = ensureSpace(doc, y, 90);
  y = drawWhyHolyQueen(doc, MARGIN, y, CONTENT_W) + 6;

  y = ensureSpace(doc, y, 55);
  y = drawBranchSection(doc, MARGIN, y, CONTENT_W) + 8;

  y = ensureSpace(doc, y, 18);
  drawDisclaimer(doc, MARGIN, y, CONTENT_W);

  stampFooters(doc, code);
  doc.save(filename);
}

export async function downloadRdReport({
  installment,
  months,
  rate,
  maturity,
  invested,
  interest,
  schemesList,
  filename,
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const code = refId("RD");
  const logo = await loadLogoDataUrl();
  paperBackground(doc);

  let y = drawCover(doc, {
    title: "Recurring Deposit Growth Report",
    subtitle: `Prepared for your enquiry · ${inr(installment)}/month for ${months} months`,
    refCode: code,
    logoDataUrl: logo,
  });
  y += 12;

  y = drawHighlightCard(doc, MARGIN, y, CONTENT_W, {
    label: "Estimated maturity value",
    value: inr(maturity),
    chips: [
      { label: "Total invested", value: inr(invested) },
      { label: "Interest earned", value: inr(interest) },
      { label: "Rate applied", value: `${rate}% p.a.` },
    ],
  });
  y += 12;

  y = sectionTitle(doc, MARGIN, y, "Your Instalment Details") + 6;
  y = drawKVRows(doc, MARGIN, y, CONTENT_W, [
    ["Monthly instalment", inr(installment)],
    ["Tenure", `${months} months`],
    ["Rate applied", `${rate}% p.a.`],
    ["Total invested", inr(invested)],
  ]);
  y += 12;

  y = ensureSpace(doc, y, 82);
  y = sectionTitle(doc, MARGIN, y, "Invested vs. Growing Value") + 6;
  const series = rdGrowthSeries({ monthly: installment, months, annualRatePercent: rate });
  y = drawGroupedBarChart(
    doc,
    MARGIN,
    y,
    CONTENT_W,
    62,
    series.map((pt) => ({
      label: pt.label,
      bars: [
        { value: pt.invested, colorHex: C.royal, format: inr },
        { value: pt.value, colorHex: C.goldDeep, format: inr },
      ],
    })),
    [
      { label: "Amount invested", colorHex: C.royal },
      { label: "Growing value", colorHex: C.goldDeep },
    ]
  );
  y += 10;

  y = ensureSpace(doc, y, 60);
  y = sectionTitle(doc, MARGIN, y, "Explore Our Other Schemes") + 6;
  const ranked = rankSchemesByValue(schemesList);
  y = drawSchemeTable(doc, MARGIN, y, CONTENT_W, ranked, {});
  y += 6;

  y = ensureSpace(doc, y, 90);
  y = drawWhyHolyQueen(doc, MARGIN, y, CONTENT_W) + 6;

  y = ensureSpace(doc, y, 55);
  y = drawBranchSection(doc, MARGIN, y, CONTENT_W) + 8;

  y = ensureSpace(doc, y, 18);
  drawDisclaimer(doc, MARGIN, y, CONTENT_W);

  stampFooters(doc, code);
  doc.save(filename);
}

export async function downloadCompareReport({ capacity, schemesList, filename }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const code = refId("CMP");
  const logo = await loadLogoDataUrl();
  paperBackground(doc);

  const ranked = rankSchemesByValue(schemesList);
  const monthly = ranked.filter((s) => s.monthlyDeposit != null);
  const best = monthly.reduce(
    (top, s) =>
      s.effectiveAnnualPct != null && (!top || s.effectiveAnnualPct > top.effectiveAnnualPct) ? s : top,
    null
  );
  const affordable = monthly.filter((s) => s.monthlyDeposit <= capacity);
  const bestAffordable = affordable.reduce(
    (top, s) =>
      s.effectiveAnnualPct != null && (!top || s.effectiveAnnualPct > top.effectiveAnnualPct) ? s : top,
    null
  );
  const recommended = bestAffordable || best;

  let y = drawCover(doc, {
    title: "Scheme Comparison Report",
    subtitle: `Prepared for your enquiry · Monthly capacity ${inr(capacity)}`,
    refCode: code,
    logoDataUrl: logo,
  });
  y += 12;

  y = drawHighlightCard(doc, MARGIN, y, CONTENT_W, {
    label: "Recommended for you",
    value: recommended ? recommended.title : "—",
    chips: recommended
      ? [
          { label: "Returns", value: pdfSafe(recommended.returns) },
          { label: "Commitment", value: pdfSafe(`${recommended.deposit}, ${recommended.tenure}`) },
          {
            label: recommended === bestAffordable ? "Fits your budget" : "Best long-term value",
            value: recommended === bestAffordable ? "Yes" : `needs ${inr(recommended.monthlyDeposit)}/mo`,
          },
        ]
      : [{ label: "Monthly capacity", value: inr(capacity) }],
  });
  y += 12;

  y = ensureSpace(doc, y, 84);
  y = sectionTitle(doc, MARGIN, y, "Value Comparison — Invested vs. Total Return") + 6;
  y = drawGroupedBarChart(
    doc,
    MARGIN,
    y,
    CONTENT_W,
    64,
    monthly.map((s) => ({
      label: s.title.replace(" Scheme", ""),
      bars: [
        { value: s.invested, colorHex: C.royal, format: inr },
        { value: s.totalValue, colorHex: C.goldDeep, format: inr },
      ],
      ribbon: best && s.slug === best.slug ? "Best value" : null,
    })),
    [
      { label: "Total invested", colorHex: C.royal },
      { label: "Total value", colorHex: C.goldDeep },
    ]
  );
  y += 10;

  y = ensureSpace(doc, y, 60);
  y = sectionTitle(doc, MARGIN, y, "Every Scheme, Side by Side") + 6;
  y = drawSchemeTable(doc, MARGIN, y, CONTENT_W, ranked, {
    capacity,
    bestSlug: best ? best.slug : null,
  });
  y += 6;

  y = ensureSpace(doc, y, 90);
  y = drawWhyHolyQueen(doc, MARGIN, y, CONTENT_W) + 6;

  y = ensureSpace(doc, y, 55);
  y = drawBranchSection(doc, MARGIN, y, CONTENT_W) + 8;

  y = ensureSpace(doc, y, 18);
  drawDisclaimer(doc, MARGIN, y, CONTENT_W);

  stampFooters(doc, code);
  doc.save(filename);
}
