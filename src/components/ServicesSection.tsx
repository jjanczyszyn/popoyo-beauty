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
          <h2>Services</h2>
        </div>

        <div className="filters" role="tablist">
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
              <button
                key={s.slug}
                type="button"
                className={`card service-card ${selected ? "selected" : ""}`}
                onClick={() => onToggle(s.slug)}
                aria-pressed={selected}
              >
                <div className="row-top">
                  <h3>{s.name}</h3>
                  <span className="price">{s.priceLabel ?? formatPrice(s.priceUSD)}</span>
                </div>
                <div className="row-bot">
                  <span className="duration">{s.durationLabel ?? formatDuration(s.durationMinutes)}</span>
                  <span className="check" aria-hidden="true">{selected ? "✓" : "+"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
