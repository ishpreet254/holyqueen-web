import { site } from "@/content/site";
import { ratesEffectiveFrom } from "@/content/rates";

export default function Disclaimer({ children }) {
  return (
    <p className="disclaimer" role="note">
      {children || site.disclaimer}
      {ratesEffectiveFrom ? ` Rates effective from ${ratesEffectiveFrom}.` : ""}
    </p>
  );
}
