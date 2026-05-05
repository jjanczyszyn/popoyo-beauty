import { mutation } from "./_generated/server";

// Seed (or re-seed) the config, services, and packages tables from the spec.
// Idempotent: deletes existing rows first so editing seed values is one command.
//
// Run locally: `npx convex run seed:all`
export const all = mutation({
  args: {},
  handler: async (ctx) => {
    for (const table of ["config", "services", "packages"] as const) {
      const rows = await ctx.db.query(table).collect();
      for (const row of rows) await ctx.db.delete(row._id);
    }

    await ctx.db.insert("config", {
      businessName: "Popoyo Beauty",
      // Karen's WhatsApp from the cross-business SPEC.md. Owner can change in DB.
      whatsappNumber: "50589750052",
      whatsappDisplay: "+505 8975 0052",
      instagramHandle: "@popoyobeauty",
      instagramUrl: "https://instagram.com/popoyobeauty",
      locationShareUrl: "https://share.google/IXOC6DlEv7Zk9d18W",
      depositPercentage: 50,
      minServiceUSD: 55,
      childcareBaseUSD: 24,
      childcareBaseHours: 2,
      childcareExtraHourUSD: 12,
      cancellationPolicy:
        "A 50% deposit confirms your appointment. Please cancel or reschedule at least 48 hours in advance. Cancellations within 48 hours may forfeit the deposit.",
      paymentMethods: [
        { id: "cash_usd", label: "Cash USD", enabled: true },
        { id: "cash_nio", label: "Cash córdobas", enabled: true },
        { id: "paypal", label: "PayPal", enabled: true },
        { id: "wise", label: "Wise", enabled: true },
        { id: "revolut", label: "Revolut", enabled: true },
        { id: "venmo", label: "Venmo (if available)", enabled: true },
        { id: "bank_transfer", label: "Bank transfer (details sent by email)", enabled: true },
      ],
      serviceAreas: [
        "Popoyo",
        "Playa Guasacate",
        "Playa Santana",
        "Hacienda Iguana",
        "Las Salinas",
        "Tola area",
        "Nearby villas and retreat centers",
      ],
    });

    const services: Array<{
      slug: string;
      category: "Massage" | "Body" | "Hair" | "Nails" | "Family";
      name: string;
      description: string;
      priceUSD: number;
      priceLabel?: string;
      durationMinutes: number;
      durationLabel?: string;
      isChildcare?: boolean;
    }> = [
      // Massage
      {
        slug: "surf-recovery-massage",
        category: "Massage",
        name: "Surf Recovery Massage",
        description:
          "A focused reset for shoulders, low back, hips, calves, and tired feet after surf, travel, or a long beach day. Pressure customized from relaxing to therapeutic.",
        priceUSD: 55,
        durationMinutes: 60,
      },
      {
        slug: "deep-tissue-massage",
        category: "Massage",
        name: "Deep Tissue Massage",
        description:
          "Slow, specific bodywork for knots, stiffness, and built-up tension. Best for active guests who want real relief.",
        priceUSD: 75,
        durationMinutes: 75,
      },
      {
        slug: "relaxation-massage",
        category: "Massage",
        name: "Relaxation Massage",
        description:
          "A calming full-body massage with slower strokes, nervous-system downshifting, and enough pressure to help the whole body exhale.",
        priceUSD: 60,
        durationMinutes: 75,
      },
      {
        slug: "couples-massage",
        category: "Massage",
        name: "Couples Massage",
        description:
          "Two therapists arrive together so both guests can drop into rest at the same time. Ideal before sunset dinner, anniversaries, or honeymoon stays.",
        priceUSD: 120,
        durationMinutes: 60,
      },
      {
        slug: "prenatal-massage",
        category: "Massage",
        name: "Prenatal Massage",
        description:
          "A gentle, supportive massage for pregnancy comfort, with positioning adapted for safety and ease. Please share pregnancy stage and any medical considerations before confirmation.",
        priceUSD: 65,
        durationMinutes: 60,
      },

      // Body
      {
        slug: "after-sun-aloe-ritual",
        category: "Body",
        name: "After-Sun Aloe Ritual",
        description:
          "A cooling, skin-softening body ritual with gentle exfoliation, aloe hydration, and calming massage for sun-kissed skin.",
        priceUSD: 80,
        durationMinutes: 75,
      },
      {
        slug: "coconut-body-scrub",
        category: "Body",
        name: "Coconut Body Scrub",
        description:
          "A tropical body polish using coconut-inspired ingredients to smooth dry skin, support circulation, and leave the body soft before a beach evening.",
        priceUSD: 65,
        durationMinutes: 60,
      },
      {
        slug: "cacao-glow-ritual",
        category: "Body",
        name: "Cacao Glow Ritual",
        description:
          "A luxurious body treatment inspired by Nicaraguan cacao, combining gentle exfoliation, nourishing hydration, and slow relaxation.",
        priceUSD: 85,
        durationMinutes: 90,
      },

      // Hair
      {
        slug: "beach-blowout",
        category: "Hair",
        name: "Beach Blowout and Scalp Ritual",
        description:
          "Fresh, polished hair without losing the relaxed Popoyo feel. Includes a scalp ritual and soft styling for dinner, photos, or a special night out.",
        priceUSD: 45,
        durationMinutes: 50,
      },
      {
        slug: "event-hair-styling",
        category: "Hair",
        name: "Event Hair Styling",
        description:
          "Soft waves, clean buns, half-up styles, or beach-glam hair for weddings, birthdays, retreats, and elevated nights out.",
        priceUSD: 75,
        durationMinutes: 75,
      },
      {
        slug: "surf-braids",
        category: "Hair",
        name: "Surf Braids",
        description:
          "Pretty, practical braids that keep hair secure for beach days, boat days, yoga, and surf sessions.",
        priceUSD: 35,
        durationMinutes: 35,
      },
      {
        slug: "bridal-photoshoot-hair",
        category: "Hair",
        name: "Bridal or Photoshoot Hair",
        description:
          "A polished, camera-ready style for brides, elopements, engagement shoots, or brand photos. Final quote depends on the look, timing, and location.",
        priceUSD: 95,
        priceLabel: "From $95",
        durationMinutes: 90,
        durationLabel: "90 minutes or custom",
      },

      // Nails
      {
        slug: "classic-manicure",
        category: "Nails",
        name: "Clean Classic Manicure",
        description:
          "Shape, cuticle care, light hand massage, and polish or natural buff. Minimal, clean, and villa-ready.",
        priceUSD: 25,
        durationMinutes: 45,
      },
      {
        slug: "spa-pedicure",
        category: "Nails",
        name: "Spa Pedicure",
        description:
          "Foot soak, shaping, cuticle care, smoothing, massage, and polish. Built for barefoot beach life and sandal season.",
        priceUSD: 35,
        durationMinutes: 60,
      },
      {
        slug: "gel-manicure",
        category: "Nails",
        name: "Gel Manicure",
        description:
          "A longer-lasting gel finish for guests who want clean nails through saltwater, sand, surf, and travel days.",
        priceUSD: 45,
        durationMinutes: 60,
      },
      {
        slug: "gel-pedicure",
        category: "Nails",
        name: "Gel Pedicure",
        description:
          "A durable pedicure for beach weeks, weddings, and longer stays. Includes shaping, cuticle care, smoothing, massage, and gel polish.",
        priceUSD: 50,
        durationMinutes: 75,
      },
      {
        slug: "gel-mani-pedi",
        category: "Nails",
        name: "Gel Mani-Pedi",
        description:
          "The full hands-and-feet polish refresh with gel durability. Best before retreats, weddings, or a week of vacation photos.",
        priceUSD: 85,
        durationMinutes: 120,
      },

      // Family
      {
        slug: "childcare-add-on",
        category: "Family",
        name: "Childcare Add-On",
        description:
          "A calm, trusted helper keeps children nearby and cared for while parents receive services. Parent or guardian must remain on the property. Add-on only — not a full-day nanny service.",
        priceUSD: 24, // base for first 2 hours
        priceLabel: "$24 / 2 hr",
        durationMinutes: 120,
        durationLabel: "2 hour minimum",
        isChildcare: true,
      },
    ];

    for (let i = 0; i < services.length; i++) {
      const s = services[i];
      await ctx.db.insert("services", {
        ...s,
        sortOrder: (i + 1) * 10,
        isActive: true,
      });
    }

    const packages: Array<{
      slug: string;
      name: string;
      description: string;
      priceUSD: number;
      priceLabel?: string;
      includes: string[];
      isCustomQuote?: boolean;
    }> = [
      {
        slug: "villa-reset",
        name: "The Villa Reset",
        description:
          "For the guest who has surfed, traveled, unpacked, and needs to feel human again.",
        priceUSD: 95,
        includes: ["60 min Surf Recovery Massage", "Spa Pedicure"],
      },
      {
        slug: "sunset-polish",
        name: "The Sunset Polish",
        description:
          "A fresh, elevated look before dinner, photos, a celebration, or a night out.",
        priceUSD: 125,
        includes: [
          "Beach Blowout and Scalp Ritual",
          "Gel Manicure",
          "Spa Pedicure",
        ],
      },
      {
        slug: "couples-quiet-hour",
        name: "The Couple's Quiet Hour",
        description: "For couples who want to arrive back in their bodies together.",
        priceUSD: 140,
        includes: [
          "Couples Massage",
          "Tea or water setup",
          "Extra rest time after treatment",
        ],
      },
      {
        slug: "family-ease",
        name: "The Family Ease",
        description:
          "For parents who want care without coordinating a sitter separately.",
        priceUSD: 145,
        includes: [
          "60 min Relaxation Massage",
          "Clean Classic Manicure",
          "2 hours childcare",
        ],
      },
      {
        slug: "retreat-host",
        name: "Retreat Host Package",
        description:
          "A coordinated beauty and wellness day for retreats, weddings, surf groups, and family gatherings.",
        priceUSD: 0,
        priceLabel: "Custom quote",
        isCustomQuote: true,
        includes: [
          "Group massage",
          "Nails",
          "Hair styling",
          "Optional childcare support",
          "Custom schedule by villa or retreat center",
        ],
      },
    ];

    for (let i = 0; i < packages.length; i++) {
      const p = packages[i];
      await ctx.db.insert("packages", {
        ...p,
        sortOrder: (i + 1) * 10,
        isActive: true,
      });
    }

    return {
      config: 1,
      services: services.length,
      packages: packages.length,
    };
  },
});
