import "./globals.css";
import Nav from "@/components/global/Nav";
import Footer from "@/components/global/Footer";
import IntroOverlay from "@/components/global/IntroOverlay";
import Interactions from "@/components/global/Interactions";

export const metadata = {
  title: "Holy Queen Credit Souhardha Co-operative Society",
  description:
    "Holy Queen Credit Souhardha Co-operative Society premium digital banking and investment experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="progress" aria-hidden="true"></div>
        <div className="cursor-glow" aria-hidden="true"></div>
        <audio
          id="ambient-audio"
          src="/audio/ambient.mp3"
          preload="none"
          loop
          data-volume="0.12"
        ></audio>

        <IntroOverlay />

        <Nav />

        <main id="home">{children}</main>

        <Footer />

        <Interactions />
      </body>
    </html>
  );
}
