import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
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
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export function BookingSection({
  services,
  packages,
  config,
  selection,
  setSelection,
}: Props) {
  const submit = useMutation(api.bookingRequests.submit);

  const [fields, setFields] = useState<BookingFields>({
    name: "",
    phone: "",
    location: "",
    preferredDate: "",
    preferredTime: "",
    guestCount: 1,
  });
  const [showOptional, setShowOptional] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      items.push({
        key: `pkg-${slug}`,
        name: `Pkg · ${p.name}`,
        line: p.priceLabel ?? formatPrice(p.priceUSD),
      });
    }
    for (const slug of selection.serviceSlugs) {
      const s = services.find((x) => x.slug === slug);
      if (!s) continue;
      if (s.isChildcare) {
        const hours = Math.max(config.childcareBaseHours, selection.childcareHours);
        const extra = Math.max(0, hours - config.childcareBaseHours);
        const price = config.childcareBaseUSD + extra * config.childcareExtraHourUSD;
        items.push({
          key: `svc-${slug}`,
          name: `${s.name} · ${hours} hr`,
          line: formatPrice(price),
        });
      } else {
        items.push({
          key: `svc-${slug}`,
          name: s.name,
          line: s.priceLabel ?? formatPrice(s.priceUSD),
        });
      }
    }
    return items;
  }, [selection, services, packages, config]);

  function update<K extends keyof BookingFields>(key: K, value: BookingFields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (selection.serviceSlugs.size === 0 && selection.packageSlugs.size === 0) {
      setError("Please select at least one service or package above.");
      return;
    }
    if (!fields.name.trim() || !fields.phone.trim() || !fields.location.trim()
        || !fields.preferredDate || !fields.preferredTime || fields.guestCount < 1) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await submit({
        name: fields.name.trim(),
        phone: fields.phone.trim(),
        location: fields.location.trim(),
        preferredDate: fields.preferredDate,
        preferredTime: fields.preferredTime,
        guestCount: fields.guestCount,
        selectedServiceSlugs: Array.from(selection.serviceSlugs),
        selectedPackageSlugs: Array.from(selection.packageSlugs),
        childcareHours: childcareSelected ? selection.childcareHours : undefined,
        notes: fields.notes?.trim() || undefined,
        pressurePreference: fields.pressurePreference?.trim() || undefined,
        allergies: fields.allergies?.trim() || undefined,
        pregnancyStatus: fields.pregnancyStatus?.trim() || undefined,
        childrenAges: fields.childrenAges?.trim() || undefined,
        accessDetails: fields.accessDetails?.trim() || undefined,
        specialOccasion: fields.specialOccasion?.trim() || undefined,
        languagePreference: fields.languagePreference?.trim() || undefined,
        paymentPreference: fields.paymentPreference?.trim() || undefined,
        estimatedTotalUSD: totals.totalUSD,
        estimatedDepositUSD: totals.depositUSD,
        estimatedDurationMinutes: totals.durationMinutes,
      });

      const message = buildWhatsAppMessage(
        fields, selection, services, packages, totals, config
      );
      const link = buildWhatsAppLink(message, config.whatsappNumber);
      setSubmitted(true);
      window.open(link, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or contact us directly on WhatsApp."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function clearSelection() {
    setSelection((s) => ({ ...s, serviceSlugs: new Set(), packageSlugs: new Set() }));
  }

  return (
    <section id="book">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Booking request</div>
          <h2>Build your appointment</h2>
          <p>
            Send a request and we'll confirm by WhatsApp. Your appointment is
            not confirmed until we reply with provider availability, travel
            timing, and the final total.
          </p>
        </div>

        <div className="booking-grid">
          <form className="form" onSubmit={handleSubmit}>
            <div className="row-2">
              <label>
                Name <span className="req">*</span>
                <input
                  type="text"
                  value={fields.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  autoComplete="name"
                />
              </label>
              <label>
                WhatsApp number <span className="req">*</span>
                <input
                  type="tel"
                  value={fields.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  required
                  placeholder="+1 555 123 4567"
                  autoComplete="tel"
                />
              </label>
            </div>

            <label>
              Location or accommodation <span className="req">*</span>
              <input
                type="text"
                value={fields.location}
                onChange={(e) => update("location", e.target.value)}
                required
                placeholder="Buena Vista Surf Club, Guasacate — or Google Maps link"
              />
            </label>

            <div className="row-2">
              <label>
                Preferred date <span className="req">*</span>
                <input
                  type="date"
                  value={fields.preferredDate}
                  min={todayISO()}
                  onChange={(e) => update("preferredDate", e.target.value)}
                  required
                />
              </label>
              <label>
                Preferred time <span className="req">*</span>
                <input
                  type="time"
                  value={fields.preferredTime}
                  onChange={(e) => update("preferredTime", e.target.value)}
                  required
                />
              </label>
            </div>

            <label>
              Number of guests <span className="req">*</span>
              <input
                type="number"
                min={1}
                max={20}
                value={fields.guestCount}
                onChange={(e) => update("guestCount", Math.max(1, Number(e.target.value) || 1))}
                required
              />
            </label>

            {childcareSelected && (
              <label>
                Childcare hours (minimum {config.childcareBaseHours})
                <input
                  type="number"
                  min={config.childcareBaseHours}
                  max={10}
                  value={selection.childcareHours}
                  onChange={(e) =>
                    setSelection((s) => ({
                      ...s,
                      childcareHours: Math.max(
                        config.childcareBaseHours,
                        Number(e.target.value) || config.childcareBaseHours
                      ),
                    }))
                  }
                />
              </label>
            )}

            <button
              type="button"
              className="optional-toggle"
              onClick={() => setShowOptional((v) => !v)}
            >
              {showOptional ? "− Hide optional details" : "+ Add optional details (allergies, pressure, occasion…)"}
            </button>

            {showOptional && (
              <>
                <div className="row-2">
                  <label>
                    Pressure preference
                    <select
                      value={fields.pressurePreference ?? ""}
                      onChange={(e) => update("pressurePreference", e.target.value)}
                    >
                      <option value="">No preference</option>
                      <option value="Light">Light</option>
                      <option value="Medium">Medium</option>
                      <option value="Firm">Firm</option>
                      <option value="Deep">Deep</option>
                    </select>
                  </label>
                  <label>
                    Special occasion
                    <input
                      type="text"
                      value={fields.specialOccasion ?? ""}
                      onChange={(e) => update("specialOccasion", e.target.value)}
                      placeholder="Birthday, honeymoon, retreat…"
                    />
                  </label>
                </div>
                <div className="row-2">
                  <label>
                    Allergies
                    <input
                      type="text"
                      value={fields.allergies ?? ""}
                      onChange={(e) => update("allergies", e.target.value)}
                      placeholder="Nut, fragrance, latex…"
                    />
                  </label>
                  <label>
                    Pregnancy status
                    <input
                      type="text"
                      value={fields.pregnancyStatus ?? ""}
                      onChange={(e) => update("pregnancyStatus", e.target.value)}
                      placeholder="Trimester, considerations"
                    />
                  </label>
                </div>
                <div className="row-2">
                  <label>
                    Children's ages
                    <input
                      type="text"
                      value={fields.childrenAges ?? ""}
                      onChange={(e) => update("childrenAges", e.target.value)}
                      placeholder="2 kids, 4 and 7"
                    />
                  </label>
                  <label>
                    Parking / access
                    <input
                      type="text"
                      value={fields.accessDetails ?? ""}
                      onChange={(e) => update("accessDetails", e.target.value)}
                      placeholder="Gate code, dirt road, parking spot…"
                    />
                  </label>
                </div>
                <div className="row-2">
                  <label>
                    Language preference
                    <select
                      value={fields.languagePreference ?? ""}
                      onChange={(e) => update("languagePreference", e.target.value)}
                    >
                      <option value="">Either</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </label>
                  <label>
                    Preferred payment
                    <select
                      value={fields.paymentPreference ?? ""}
                      onChange={(e) => update("paymentPreference", e.target.value)}
                    >
                      <option value="">No preference</option>
                      {config.paymentMethods.filter((m) => m.enabled).map((m) => (
                        <option key={m.id} value={m.label}>{m.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Notes for the team
                  <textarea
                    value={fields.notes ?? ""}
                    onChange={(e) => update("notes", e.target.value)}
                    placeholder="Anything else we should know — sunburn, injuries, vibe, music…"
                  />
                </label>
              </>
            )}

            {error && <div className="form-error">{error}</div>}
            {submitted && (
              <div className="form-success">
                Request received. We've opened WhatsApp in a new tab — please
                hit send so we can confirm your appointment.
              </div>
            )}

            <div className="booking-cta">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Request booking on WhatsApp"}
              </button>
              <p className="form-note">
                Travel may be included in central Popoyo and nearby areas. A
                small travel fee may apply for harder-to-reach villas, remote
                roads, or appointments outside the normal service area.
              </p>
              <p className="form-note">
                Your appointment is not confirmed until we reply on WhatsApp.
                We confirm provider availability, travel timing, and final
                total before taking the deposit.
              </p>
            </div>
          </form>

          <aside className="summary" aria-label="Booking summary">
            <h3>Your selection</h3>
            {selectedItems.length === 0 ? (
              <p className="empty">
                Add services or packages above to see your estimated total.
              </p>
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
                  <span className="label">Estimated total</span>
                  <span className="v grand">
                    {totals.totalUSD > 0 ? formatPrice(totals.totalUSD) : "—"}
                    {totals.hasCustomQuote && <span style={{ fontSize: "0.7em", marginLeft: 6 }}> + quote</span>}
                  </span>
                  <span className="label">Estimated duration</span>
                  <span className="v">{formatDuration(totals.durationMinutes)}</span>
                  <span className="label">Deposit ({config.depositPercentage}%)</span>
                  <span className="v">{formatPrice(totals.depositUSD)}</span>
                  <span className="label">Balance after service</span>
                  <span className="v">{formatPrice(totals.balanceUSD)}</span>
                </div>
                {totals.belowMinimum && (
                  <div className="min-warn">
                    Minimum service total for an in-home visit is{" "}
                    {formatPrice(config.minServiceUSD)}. Add another service
                    or contact us to discuss.
                  </div>
                )}
                <div style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={clearSelection}
                    style={{ fontSize: "0.85rem" }}
                  >
                    Clear selection
                  </button>
                </div>
              </>
            )}
            <p className="form-note" style={{ marginTop: 18 }}>
              {config.cancellationPolicy}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
