export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://holyqueen.example/sitemap.xml",
  };
}
