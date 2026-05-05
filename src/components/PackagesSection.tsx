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
          <div className="eyebrow">Packages</div>
          <h2>Premium shortcuts</h2>
          <p>Curated combinations for the moments worth marking.</p>
        </div>

        <div className="cards">
          {packages.map((p) => {
            const selected = selectedSlugs.has(p.slug);
            return (
              <article key={p.slug} className={`package-card ${selected ? "selected" : ""}`}>
                {selected && <span className="selected-pill">Selected</span>}
                <h3>{p.name}</h3>
                <div className="price">
                  {p.priceLabel ?? formatPrice(p.priceUSD)}
                </div>
                <ul>
                  {p.includes.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
                <p className="desc">{p.description}</p>
                <div className="card-actions">
                  <button
                    className="select-btn"
                    onClick={() => onToggle(p.slug)}
                    aria-pressed={selected}
                  >
                    {selected ? "✓ Added" : p.isCustomQuote ? "Request quote" : "Add package"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
