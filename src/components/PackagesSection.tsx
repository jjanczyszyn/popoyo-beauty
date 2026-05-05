import type { Package } from "../lib/booking";
import { formatPrice } from "../lib/booking";

type Props = {
  packages: Package[];
  selectedSlugs: Set<string>;
  onToggle: (slug: string) => void;
};

export function PackagesSection({ packages, selectedSlugs, onToggle }: Props) {
  return (
    <section id="packages" className="tinted">
      <div className="container">
        <div className="section-head">
          <h2>Packages</h2>
        </div>

        <div className="cards">
          {packages.map((p) => {
            const selected = selectedSlugs.has(p.slug);
            return (
              <button
                key={p.slug}
                type="button"
                className={`package-card ${selected ? "selected" : ""}`}
                onClick={() => onToggle(p.slug)}
                aria-pressed={selected}
              >
                <div className="row-top">
                  <h3>{p.name}</h3>
                  <span className="price">{p.priceLabel ?? formatPrice(p.priceUSD)}</span>
                </div>
                <ul>
                  {p.includes.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
                <span className="check-bottom" aria-hidden="true">{selected ? "✓ Added" : "+ Add"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
