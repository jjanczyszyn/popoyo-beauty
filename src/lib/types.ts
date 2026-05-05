// Frontend-side types decoupled from Convex codegen so the static build works
// even before a Convex deployment is wired up. When a Convex deployment is
// configured (VITE_CONVEX_URL), the queries return rows that match these.

export type ServiceCategory = "Massage" | "Body" | "Hair" | "Nails" | "Family";

export type Service = {
  slug: string;
  category: ServiceCategory;
  name: string;
  description: string;
  priceUSD: number;
  priceLabel?: string;
  durationMinutes: number;
  durationLabel?: string;
  sortOrder: number;
  isActive: boolean;
  isChildcare?: boolean;
};

export type Package = {
  slug: string;
  name: string;
  description: string;
  priceUSD: number;
  priceLabel?: string;
  includes: string[];
  sortOrder: number;
  isActive: boolean;
  isCustomQuote?: boolean;
};

export type PaymentMethod = {
  id: string;
  label: string;
  enabled: boolean;
};

export type Config = {
  businessName: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  instagramHandle?: string;
  instagramUrl?: string;
  locationShareUrl?: string;
  depositPercentage: number;
  minServiceUSD: number;
  childcareBaseUSD: number;
  childcareBaseHours: number;
  childcareExtraHourUSD: number;
  cancellationPolicy: string;
  paymentMethods: PaymentMethod[];
  serviceAreas: string[];
};
