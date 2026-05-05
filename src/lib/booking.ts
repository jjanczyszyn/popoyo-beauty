import type { Service, Package, Config } from "./types";

export type { Service, Package, Config };

export type Selection = {
  serviceSlugs: Set<string>;
  packageSlugs: Set<string>;
  childcareHours: number; // applied if a service with isChildcare is selected
};

export const emptySelection = (): Selection => ({
  serviceSlugs: new Set(),
  packageSlugs: new Set(),
  childcareHours: 2,
});

export type Totals = {
  totalUSD: number;
  durationMinutes: number;
  depositUSD: number;
  balanceUSD: number;
  childcareIncluded: boolean;
  hasCustomQuote: boolean;
  belowMinimum: boolean;
};

export const formatPrice = (usd: number) =>
  `$${Math.round(usd).toLocaleString("en-US")}`;

export const formatDuration = (minutes: number) => {
  if (minutes <= 0) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
};

export function computeTotals(
  selection: Selection,
  services: Service[],
  packages: Package[],
  config: Config
): Totals {
  let total = 0;
  let duration = 0;
  let childcareIncluded = false;
  let hasCustomQuote = false;

  for (const slug of selection.serviceSlugs) {
    const s = services.find((x) => x.slug === slug);
    if (!s) continue;
    if (s.isChildcare) {
      const hours = Math.max(config.childcareBaseHours, selection.childcareHours);
      const extraHours = Math.max(0, hours - config.childcareBaseHours);
      total += config.childcareBaseUSD + extraHours * config.childcareExtraHourUSD;
      duration += hours * 60;
      childcareIncluded = true;
    } else {
      total += s.priceUSD;
      duration += s.durationMinutes;
    }
  }

  for (const slug of selection.packageSlugs) {
    const p = packages.find((x) => x.slug === slug);
    if (!p) continue;
    if (p.isCustomQuote) {
      hasCustomQuote = true;
      continue;
    }
    total += p.priceUSD;
    duration += 90;
  }

  const deposit = Math.round((total * config.depositPercentage) / 100);
  const balance = total - deposit;
  const belowMinimum =
    total > 0 && total < config.minServiceUSD && !hasCustomQuote;

  return {
    totalUSD: total,
    durationMinutes: duration,
    depositUSD: deposit,
    balanceUSD: balance,
    childcareIncluded,
    hasCustomQuote,
    belowMinimum,
  };
}

export type BookingFields = {
  name: string;
  phone: string;
  location: string;
  preferredDate: string;
  preferredTime: string;
  guestCount: number;
  notes?: string;
  pressurePreference?: string;
  allergies?: string;
  pregnancyStatus?: string;
  childrenAges?: string;
  accessDetails?: string;
  specialOccasion?: string;
  languagePreference?: string;
  paymentPreference?: string;
};

export function buildWhatsAppMessage(
  fields: BookingFields,
  selection: Selection,
  services: Service[],
  packages: Package[],
  totals: Totals,
  config: Config
): string {
  const lines: string[] = [];
  lines.push(`Hi ${config.businessName}! I'd like to request an appointment.`);
  lines.push("");
  lines.push(`Name: ${fields.name}`);
  lines.push(`Phone: ${fields.phone}`);
  lines.push(`Location: ${fields.location}`);
  lines.push(`Preferred date: ${fields.preferredDate}`);
  lines.push(`Preferred time: ${fields.preferredTime}`);
  lines.push(`Guests: ${fields.guestCount}`);

  const pkgNames: string[] = [];
  for (const slug of selection.packageSlugs) {
    const p = packages.find((x) => x.slug === slug);
    if (p) pkgNames.push(`• ${p.name}${p.isCustomQuote ? " (custom quote)" : ` — ${p.priceLabel ?? formatPrice(p.priceUSD)}`}`);
  }
  if (pkgNames.length) {
    lines.push("");
    lines.push("Packages:");
    lines.push(...pkgNames);
  }

  const svcLines: string[] = [];
  for (const slug of selection.serviceSlugs) {
    const s = services.find((x) => x.slug === slug);
    if (!s) continue;
    if (s.isChildcare) {
      const hours = Math.max(config.childcareBaseHours, selection.childcareHours);
      const extra = Math.max(0, hours - config.childcareBaseHours);
      const price =
        config.childcareBaseUSD + extra * config.childcareExtraHourUSD;
      svcLines.push(`• ${s.name} — ${hours} hr — ${formatPrice(price)}`);
    } else {
      svcLines.push(
        `• ${s.name} — ${s.durationLabel ?? formatDuration(s.durationMinutes)} — ${s.priceLabel ?? formatPrice(s.priceUSD)}`
      );
    }
  }
  if (svcLines.length) {
    lines.push("");
    lines.push("Services:");
    lines.push(...svcLines);
  }

  if (totals.totalUSD > 0) {
    lines.push("");
    lines.push(`Estimated total: ${formatPrice(totals.totalUSD)}${totals.hasCustomQuote ? " (+ custom quote)" : ""}`);
    lines.push(`Estimated deposit (${config.depositPercentage}%): ${formatPrice(totals.depositUSD)}`);
    lines.push(`Estimated duration: ${formatDuration(totals.durationMinutes)}`);
  } else if (totals.hasCustomQuote) {
    lines.push("");
    lines.push("Awaiting custom quote.");
  }

  if (fields.specialOccasion) lines.push("", `Occasion: ${fields.specialOccasion}`);
  if (fields.pressurePreference) lines.push(`Pressure: ${fields.pressurePreference}`);
  if (fields.pregnancyStatus) lines.push(`Pregnancy: ${fields.pregnancyStatus}`);
  if (fields.allergies) lines.push(`Allergies: ${fields.allergies}`);
  if (fields.childrenAges) lines.push(`Children: ${fields.childrenAges}`);
  if (fields.accessDetails) lines.push(`Access: ${fields.accessDetails}`);
  if (fields.languagePreference) lines.push(`Language: ${fields.languagePreference}`);
  if (fields.paymentPreference) lines.push(`Preferred payment: ${fields.paymentPreference}`);
  if (fields.notes) lines.push("", `Notes: ${fields.notes}`);

  return lines.join("\n");
}

export function buildWhatsAppLink(message: string, whatsappNumber: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
