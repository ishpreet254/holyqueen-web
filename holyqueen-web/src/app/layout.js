import "../styles/fonts.css";
import "./globals.css";
import "../styles/components.css";
import "../styles/theme-light.css";
import Nav from "@/components/global/Nav";
import Footer from "@/components/global/Footer";
import MotionProvider from "@/components/global/MotionProvider";
import ThemeScript from "@/components/global/ThemeScript";
import { site } from "@/content/site";

export const metadata = {
  metadataBase: new URL("https://holyqueen.example"),
  title: {
    default: `${site.legalName} — Mysuru`,
    template: `%s — ${site.shortName}`,
  },
  description:
    "Holy Queen Credit Souhardha Co-operative Society, Saraswathipuram, Mysuru — fixed deposits, recurring deposits, special savings schemes, member credit and branch services.",
  openGraph: {
    title: site.legalName,
    description: `${site.positioning}. ${site.tagline}`,
    locale: "en_IN",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f2" },
    { media: "(prefers-color-scheme: dark)", color: "#06111f" },
  ],
};

const organisation = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: site.legalName,
  alternateName: site.shortName,
  telephone: site.phone,
  email: site.email,
  slogan: site.tagline,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.branch.line1,
    addressLocality: "Mysuru",
    addressRegion: "Karnataka",
    postalCode: "570009",
    addressCountry: "IN",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/plus-jakarta-sans-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/plus-jakarta-sans-latin-600-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/cormorant-garamond-latin-500-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <div className="progress" aria-hidden="true"></div>

        <Nav />

        <main id="content">{children}</main>

        <Footer />

        <MotionProvider />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }}
        />
      </body>
    </html>
  );
}
