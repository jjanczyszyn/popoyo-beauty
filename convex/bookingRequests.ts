import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    location: v.string(),
    preferredDate: v.string(),
    preferredTime: v.string(),
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
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("bookingRequests", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
    return { id };
  },
});
