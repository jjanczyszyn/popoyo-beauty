import { useMemo, useState } from "react";
import type { Service, Package, Config, Selection, BookingFields } from "../lib/booking";
import {
  computeTotals,
  formatPrice,
  formatDuration,
  buildWhatsAppMessage,
  buildWhatsAppLink,
} from "../lib/booking";

type Props = {
  services: Service[];
  packages: Package[];
  config: Config;
  selection: Selection;
  setSelection: React.Dispatch<React.SetStateAction<Selection>>;
};

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function BookingSection({
  services, packages, config, selection, setSelection,
}: Props) {
  const [fields, setFields] = useState<BookingFields>({
    name: "", phone: "", location: "", preferredDate: "", preferredTime: "", guestCount: 1,
  });
  const [showOptional, setShowOptional] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const totals = useMemo(
    () => computeTotals(selection, services, packages, config),
    [selection, services, packages, config]
  );

  const childcareSelected = useMemo(() => {
    for (const slug of selection.serviceSlugs) {
      const s = services.find((x) => x.slug === slug);
      if (s?.isChildcare) return true;
    }
    return false;
  }, [selection.serviceSlugs, services]);

  const selectedItems = useMemo(() => {
    const items: Array<{ key: string; name: string; line: string }> = [];
    for (const slug of selection.packageSlugs) {
      const p = packages.find((x) => x.slug === slug);
      if (!p) continue;
      items.push({ key: `pkg-${slug}`, name: p.name, line: p.priceLabel ?? formatPrice(p.priceUSD) });
    }
    for (const slug of selection.serviceSlugs) {
      const s = services.find((x) => x.slug === slug);
      if (!s) continue;
      if (s.isChildcare) {
        const hours = Math.max(config.childcareBaseHours, selection.childcareHours);
        const extra = Math.max(0, hours - config.childcareBaseHours);
        const price = config.childcareBaseUSD + extra * config.childcareExtraHourUSD;
        items.push({ key: `svc-${slug}`, name: `${s.name} (${hours}h)`, line: formatPrice(price) });
      } else {
        items.push({ key: `svc-${slug}`, name: s.name, line: s.priceLabel ?? formatPrice(s.priceUSD) });
      }
    }
    return items;
  }, [selection, services, packages, config]);

  function update<K extends keyof BookingFields>(key: K, value: BookingFields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (selection.serviceSlugs.size === 0 && selection.packageSlugs.size === 0) {
      setError("Pick at least one service.");
      return;
    }
    if (!fields.name.trim() || !fields.phone.trim() || !fields.location.trim()
        || !fields.preferredDate || !fields.preferredTime) {
      setError("Fill in the required fields.");
      return;
    }

    const message = buildWhatsAppMessage(fields, selection, services, packages, totals, config);
    const link = buildWhatsAppLink(message, config.whatsappNumber);
    setSubmitted(true);
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="book">
      <div className="container">
        <div className="section-head">
          <h2>Book</h2>
        </div>

        <div className="booking-grid">
          <form className="form" onSubmit={handleSubmit}>
            <div className="row-2">
              <label>
                Name<span className="req">*</span>
                <input type="text" value={fields.name} onChange={(e) => update("name", e.target.value)} required autoComplete="name" />
              </label>
              <label>
                WhatsApp<span className="req">*</span>
                <input type="tel" value={fields.phone} onChange={(e) => update("phone", e.target.value)} required placeholder="+1 555 123 4567" autoComplete="tel" />
              </label>
            </div>

            <label>
              Location<span className="req">*</span>
              <input type="text" value={fields.location} onChange={(e) => update("location", e.target.value)} required placeholder="Villa name or Google Maps link" />
            </label>

            <div className="row-2">
              <label>
                Date<span className="req">*</span>
                <input type="date" value={fields.preferredDate} min={todayISO()} onChange={(e) => update("preferredDate", e.target.value)} required />
              </label>
              <label>
                Time<span className="req">*</span>
                <input type="time" value={fields.preferredTime} onChange={(e) => update("preferredTime", e.target.value)} required />
              </label>
            </div>

            <div className="row-2">
              <label>
                Guests
                <input type="number" min={1} max={20} value={fields.guestCount}
                  onChange={(e) => update("guestCount", Math.max(1, Number(e.target.value) || 1))} />
              </label>
              {childcareSelected && (
                <label>
                  Childcare hours
                  <input type="number" min={config.childcareBaseHours} max={10} value={selection.childcareHours}
                    onChange={(e) => setSelection((s) => ({
                      ...s,
                      childcareHours: Math.max(config.childcareBaseHours, Number(e.target.value) || config.childcareBaseHours),
                    }))} />
                </label>
              )}
            </div>

            <button type="button" className="optional-toggle" onClick={() => setShowOptional((v) => !v)}>
              {showOptional ? "− Hide notes" : "+ Add notes"}
            </button>

            {showOptional && (
              <label>
                Notes
                <textarea value={fields.notes ?? ""} onChange={(e) => update("notes", e.target.value)}
                  placeholder="Allergies, pressure, occasion, anything we should know" />
              </label>
            )}

            {error && <div className="form-error">{error}</div>}
            {submitted && <div className="form-success">Opening WhatsApp — hit send to confirm.</div>}

            <button type="submit" className="btn btn-primary booking-cta-btn">
              Send on WhatsApp
            </button>
          </form>

          <aside className="summary">
            {selectedItems.length === 0 ? (
              <p className="empty">No services selected.</p>
            ) : (
              <>
                <ul className="selected-list">
                  {selectedItems.map((it) => (
                    <li key={it.key}>
                      <span className="name">{it.name}</span>
                      <span className="val">{it.line}</span>
                    </li>
                  ))}
                </ul>
                <div className="totals">
                  <span className="label">Total</span>
                  <span className="v grand">
                    {totals.totalUSD > 0 ? formatPrice(totals.totalUSD) : "—"}
                    {totals.hasCustomQuote && <span style={{ fontSize: "0.65em", marginLeft: 4 }}>+quote</span>}
                  </span>
                  <span className="label">Duration</span>
                  <span className="v">{formatDuration(totals.durationMinutes)}</span>
                  <span className="label">Deposit ({config.depositPercentage}%)</span>
                  <span className="v">{formatPrice(totals.depositUSD)}</span>
                </div>
                {totals.belowMinimum && (
                  <div className="min-warn">Minimum {formatPrice(config.minServiceUSD)}.</div>
                )}
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
