import { useMemo, useState } from "react";
import type { Service } from "../lib/booking";
import { formatPrice, formatDuration } from "../lib/booking";

const CATEGORIES = ["All", "Massage", "Hair", "Nails", "Body", "Family"] as const;
type Cat = (typeof CATEGORIES)[number];

type Props = {
  services: Service[];
  selectedSlugs: Set<string>;
  onToggle: (slug: string) => void;
};

export function ServicesSection({ services, selectedSlugs, onToggle }: Props) {
  const [cat, setCat] = useState<Cat>("All");

  const filtered = useMemo(
    () => (cat === "All" ? services : services.filter((s) => s.category === cat)),
    [services, cat]
  );

  return (
    <section id="services">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Service menu</div>
          <h2>Build a single treatment or a full villa spa day</h2>
          <p>
            Tap to add services to your booking. You can combine massage, hair,
            nails, body rituals, and childcare in one request.
          </p>
        </div>

        <div className="filters" role="tablist" aria-label="Filter services by category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              className={`btn-ghost ${cat === c ? "active" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="cards">
          {filtered.map((s) => {
            const selected = selectedSlugs.has(s.slug);
            return (
              <article key={s.slug} className={`card ${selected ? "selected" : ""}`}>
                {selected && <span className="selected-pill">Selected</span>}
                <span className="cat">{s.category}</span>
                <h3>{s.name}</h3>
                <p className="desc">{s.description}</p>
                <div className="meta">
                  <div>
                    <div className="price">
                      {s.priceLabel ?? formatPrice(s.priceUSD)}
                    </div>
                    <div className="duration">
                      {s.durationLabel ?? formatDuration(s.durationMinutes)}
                    </div>
                  </div>
                  <button
                    className="select-btn"
                    onClick={() => onToggle(s.slug)}
                    aria-pressed={selected}
                  >
                    {selected ? "✓ Added" : "Add to booking"}
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
