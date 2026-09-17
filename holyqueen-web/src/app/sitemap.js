import { accounts, loans } from "@/content/products";

const BASE = "https://holyqueen.example";

export default function sitemap() {
  const routes = [
    "/",
    "/about",
    "/leadership",
    "/accounts",
    "/deposits",
    "/deposits/fixed",
    "/deposits/recurring",
    "/deposits/special",
    "/deposits/senior-citizen",
    "/deposits/pigmy",
    "/services",
    "/digital",
    "/rates",
    "/calculators",
    "/branch",
    "/contact",
    "/policies",
  ];

  // Gated routes stay out of the sitemap until the society supplies terms.
  accounts
    .filter((account) => account.published)
    .forEach((account) => routes.push(`/accounts/${account.slug}`));
  if (loans.published) routes.push("/loans");

  return routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/rates" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
