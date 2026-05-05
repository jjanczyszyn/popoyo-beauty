import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Single-row site config the owner can edit without a redeploy.
  config: defineTable({
    businessName: v.string(),
    whatsappNumber: v.string(), // E.164 digits only, no + or spaces, e.g. "50589750052"
    whatsappDisplay: v.string(), // human-readable, e.g. "+505 8975 0052"
    instagramHandle: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    locationShareUrl: v.optional(v.string()),
    depositPercentage: v.number(), // 50
    minServiceUSD: v.number(), // 55
    childcareBaseUSD: v.number(), // 24
    childcareBaseHours: v.number(), // 2
    childcareExtraHourUSD: v.number(), // 12
    cancellationPolicy: v.string(),
    paymentMethods: v.array(
      v.object({
        id: v.string(),
        label: v.string(),
        enabled: v.boolean(),
      })
    ),
    serviceAreas: v.array(v.string()),
  }),

  services: defineTable({
    slug: v.string(),
    category: v.union(
      v.literal("Massage"),
      v.literal("Body"),
      v.literal("Hair"),
      v.literal("Nails"),
      v.literal("Family")
    ),
    name: v.string(),
    description: v.string(),
    priceUSD: v.number(),
    priceLabel: v.optional(v.string()), // e.g. "From $95" overrides plain "$<n>"
    durationMinutes: v.number(),
    durationLabel: v.optional(v.string()), // e.g. "90 minutes or custom"
    sortOrder: v.number(),
    isActive: v.boolean(),
    // Childcare is special — booking flow asks for hours and recomputes the price.
    isChildcare: v.optional(v.boolean()),
  }).index("by_slug", ["slug"]),

  packages: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    priceUSD: v.number(),
    priceLabel: v.optional(v.string()),
    includes: v.array(v.string()),
    sortOrder: v.number(),
    isActive: v.boolean(),
    isCustomQuote: v.optional(v.boolean()),
  }).index("by_slug", ["slug"]),

  // Manual booking requests — submitted alongside the WhatsApp deep-link so the
  // owner has a record even if the customer never hits send in WhatsApp.
  bookingRequests: defineTable({
    name: v.string(),
    phone: v.string(), // free-form; spec doesn't mandate E.164 here
    location: v.string(),
    preferredDate: v.string(), // ISO YYYY-MM-DD
    preferredTime: v.string(), // free-form, e.g. "10:00"
    guestCount: v.number(),
    selectedServiceSlugs: v.array(v.string()),
    selectedPackageSlugs: v.array(v.string()),
    childcareHours: v.optional(v.number()),
    notes: v.optional(v.string()),
    pressurePreference: v.optional(v.string()),
    allergies: v.optional(v.string()),
    pregnancyStatus: v.optional(v.string()),
    childrenAges: v.optional(v.string()),
    accessDetails: v.optional(v.string()),
    specialOccasion: v.optional(v.string()),
    languagePreference: v.optional(v.string()),
    paymentPreference: v.optional(v.string()),
    estimatedTotalUSD: v.number(),
    estimatedDepositUSD: v.number(),
    estimatedDurationMinutes: v.number(),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("confirmed"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),
});
