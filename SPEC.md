# Popoyo Beauty — Pricing & Contact Spec

Shared business primitives for Karen & JJ's businesses in Popoyo, Nicaragua.
This document captures the canonical values used today by the
[moto-rental-1](../moto-rental-1) flow so a sister product (popoyo-beauty)
can reuse the same pricing pattern, the same contact endpoints, and the
same map / WhatsApp deep-links without drift.

Source of truth in moto-rental-1:
- pricing algorithm: [`convex/lib/pricing.ts`](../moto-rental-1/convex/lib/pricing.ts)
  + tests in `pricing.test.ts`
- seeded defaults: [`convex/seed.ts`](../moto-rental-1/convex/seed.ts) (top of `all` mutation)
- visible numbers / links: [`src/screens/Home.tsx`](../moto-rental-1/src/screens/Home.tsx)

If popoyo-beauty later diverges (different pricing tiers, different phone
numbers), copy the relevant section into the popoyo-beauty repo and let
that copy take precedence — don't symlink across repos.

---

## 1. Pricing options

### 1.1 Rate card (default)

| Tier | Price (USD) | Notes |
|---|---|---|
| Daily  | **$20**  | Single day, no commitment |
| Weekly | **$120** | 7-day block — 17 USD per day effective |
| Monthly | **$450** | 30-day block — 15 USD per day effective |
| Refundable deposit | **$100** | Held at delivery, returned on bike return in original condition |

These three are stored on the `config` table as `dailyRate`, `weeklyRate`,
`monthlyRate` plus `deposit`. The frontend reads them via
`useQuery(api.config.get)` so the owner can change them in the admin
without a redeploy.

### 1.2 Optimal-bundle algorithm

Given a number of rental days `n`, the price is the **cheapest** combination
of full months + full weeks + (leftover days at a prorated rate). Concretely:

- **n < 7 days** → `n × daily`. No tier rounding for short rentals.
- **n ≥ 7 days** → search every (m, w, leftover) decomposition where
  `30·m + 7·w + leftover ≥ n`, plus the alternate "m months + leftover at
  monthly per-diem" formula, and take the minimum. Leftover days are billed
  at the **weekly per-diem (`weekly/7`)** when at least one full week is
  bought, or at the **monthly per-diem (`monthly/30`)** when at least one
  full month is bought.

Invariant the tests enforce: the price is **monotonic non-decreasing** in
`n`. A 29-day rental never costs more than a 30-day rental — if the search
finds 4 weeks + 1 prorated day = $497, it falls back to the cheaper "round
up to 1 month" = $450.

### 1.3 Worked examples

| Days | Decomposition | Price |
|---|---|---|
| 1   | 1 × daily                                     | $20  |
| 6   | 6 × daily                                     | $120 |
| 7   | 1 × weekly                                    | $120 |
| 11  | 1 week + 4 × weekly/7                         | ≈ $189 |
| 14  | 2 × weekly                                    | $240 |
| 29  | round up to 1 × monthly                       | $450 |
| 30  | 1 × monthly                                   | $450 |
| 35  | 1 month + 5 × monthly/30                      | $525 |
| 60  | 2 × monthly                                   | $900 |

The TS implementation lives in `convex/lib/pricing.ts` exporting
`computeTotal(n, { daily, weekly, monthly })`.

### 1.4 Delivery window

| Field | Value | Notes |
|---|---|---|
| `deliveryStart` | **7** (07:00) | Earliest hand-off time |
| `deliveryEnd`   | **20** (20:00) | Latest hand-off time |

Same-day rentals additionally lock out any slot less than 2 hours from
"now" — owners need lead time to reach the customer.

### 1.5 Reusing the algorithm in popoyo-beauty

For a beauty / service business, the per-day pattern probably doesn't
apply. Two viable patterns:

- **Per-service flat fee** — store a `services` table with `{ slug, name,
  priceUSD, durationMinutes, description }`. Read via `useQuery(api.services.list)`.
- **Per-service + bundled package discount** — same `services` table, plus
  a `packages` table that bundles N services at a discounted total. Use
  the same min-search idea from `computeTotal` if packages overlap.

If popoyo-beauty inherits the moto-rental's tier structure (e.g. for
multi-day spa packages), copy `convex/lib/pricing.ts` and its test file
into the new repo. The function is pure and dependency-free.

---

## 2. Phone numbers

| Owner | Number | Role |
|---|---|---|
| Karen | **+505 8975 0052** | Primary contact, customer-facing WhatsApp |
| JJ    | **+505 7718 5403** | Secondary local contact |
| JJ (US) | **+1 646 934 0781** | International / overseas customers |

Display format on the home screen: `+505 8975 0052 · +505 7718 5403 · Popoyo, Nicaragua`.

### 2.1 Country-code selection

The booking flow lets the customer pick their own country code from a
dropdown of ~50 countries. Default = `+505` (Nicaragua) unless the
document OCR detected a foreign country, in which case the dropdown
auto-defaults to that country's code (e.g. document says "United States" →
default `+1`). Source: `src/lib/countries.ts`.

Validation uses `libphonenumber-js/min` — see `src/lib/phone.ts`. Numbers
are stored in E.164 (`+CCNNNNNNNNN`) for portability.

---

## 3. WhatsApp

### 3.1 Owner endpoint

```
https://wa.me/50589750052
```

This opens a WhatsApp chat with Karen on every device. Customers tap it
from the homepage "WhatsApp" button.

### 3.2 Prefilled message deep-link

The booking-completion screen opens WhatsApp with a prefilled message so
the customer just hits send:

```
https://wa.me/50589750052?text=<URL-encoded message>
```

Message templates currently used (from `src/screens/Done.tsx`):

```
Cash booking:
  Hi Karen, I just booked KJ-XXXX-NNN.
  Delivery on May 7 at 10:00 am to <address>.
  Waiting for your confirmation!

Non-cash booking (digital payment):
  Hi Karen, I just booked KJ-XXXX-NNN.
  Delivery on May 7 at 10:00 am to <address>.
  I'm sending the payment screenshot.
  Waiting for your confirmation!
```

Implementation pattern:

```ts
const message = [
  `Hi Karen, I just booked ${code}.`,
  `Delivery on ${date} at ${hour} to ${address}.`,
  ...(isCash ? [] : ["I'm sending the payment screenshot."]),
  "Waiting for your confirmation!",
].join(" ");
const href = `https://wa.me/50589750052?text=${encodeURIComponent(message)}`;
```

For popoyo-beauty: keep the same `wa.me/50589750052` endpoint (still
Karen), swap the message body to fit the booking shape (e.g. service +
appointment time + chosen stylist).

---

## 4. Google Maps

### 4.1 "Find us" deep-link

```
https://share.google/IXOC6DlEv7Zk9d18W
```

This is a Google-shortened share link to the business location in Popoyo.
Used as the homepage's "Find us" CTA. The shortened form is opaque on
purpose — Karen / JJ generated it from the Google Business Profile share
button, so it always tracks the canonical location even if the business
moves or rebrands.

### 4.2 Customer delivery address capture

The reservation flow asks the customer for their *own* address as either:
- An accommodation name ("Buena Vista Surf Club, Guasacate"), or
- A Google Maps share link (a `maps.google.com/...` or `goo.gl/...` URL)

Both forms are stored verbatim in `reservations.deliveryAddr` and surface
to the owner's WhatsApp message on booking confirmation. There's no
geocoding step — the owner just opens the link.

Field placeholder: `Accommodation name, Google Maps pin/link`.

---

## 5. Cross-repo conventions

- All times are in `America/Managua` (UTC-6, no DST).
- All prices in **USD**, displayed with a `$` prefix and no decimals.
- All dates stored as ISO `YYYY-MM-DD` strings; displayed in either
  `MMM D` short form (most screens) or `DD-MM-YYYY` (document expiry).
- Phone numbers stored as `{ phoneCC: "+505", phoneNum: "8975 0052" }`
  pair, never as a single concatenated string. E.164 form is
  reconstructed via libphonenumber when needed.
- WhatsApp deep-links always use the `wa.me/<digits-only>` form (no `+`,
  no spaces). Add `?text=...` for prefilled message; the body must be
  `encodeURIComponent`'d.
- Google Maps deep-links always use the canonical `share.google/...` /
  `maps.app.goo.gl/...` short form when sharing a fixed location.
