# Popoyo Beauty

Single-page site for **Popoyo Beauty** — in-home spa services in Popoyo, Nicaragua.

- Frontend: Vite + React 18 + TypeScript (static build → GitHub Pages)
- Backend / DB: [Convex](https://convex.dev) (services, packages, config, booking requests)
- Live domain: **beauty.popoyo.co** (GitHub Pages custom domain)

The site reads its services, packages, payment methods, WhatsApp number, and
service areas from Convex so the owner can edit them in the dashboard without
a redeploy.

---

## Local development

```bash
npm install

# 1. Start Convex (first run will prompt to log in and create a dev deployment)
npx convex dev
# → leave this running

# 2. Seed the dev DB with services, packages, and config
npx convex run seed:all

# 3. Start the Vite dev server (in another terminal)
npm run dev
```

Open http://localhost:5174.

`convex dev` writes `.env.local` with `VITE_CONVEX_URL=...` pointing at your
dev deployment, which the frontend reads automatically.

## Editing site content

All editable content lives in Convex tables:

| Table              | What it controls                                           |
|--------------------|------------------------------------------------------------|
| `config`           | WhatsApp number, deposit %, min, payment methods, areas   |
| `services`         | Service menu (price, duration, category, description)      |
| `packages`         | Package shortcuts                                          |
| `bookingRequests`  | Booking submissions captured from the form                 |

Edit rows in the Convex dashboard. The site picks up changes on next page load
(or instantly via Convex's reactive queries).

To re-seed everything from `convex/seed.ts` (wipes existing rows in those
three tables):

```bash
npx convex run seed:all
```

## Production deployment

### 1. Create the Convex prod deployment

```bash
npx convex deploy            # creates a prod deployment + prints its URL
npx convex run seed:all --prod   # seed prod once
```

Note the prod URL (looks like `https://your-name-123.convex.cloud`) and the
`CONVEX_DEPLOY_KEY` from the Convex dashboard → Settings → Deploy keys.

### 2. Create the GitHub repo

```bash
gh repo create popoyo-beauty --public --source=. --remote=origin --push
```

(Or create it in the GitHub UI and push manually.)

### 3. Set repo secrets and variables

In **Settings → Secrets and variables → Actions**:

- **Secret** `CONVEX_DEPLOY_KEY` — from Convex prod deploy keys
- **Variable** `VITE_CONVEX_URL` — your prod Convex URL

### 4. Enable GitHub Pages

In **Settings → Pages**, set **Source** to *GitHub Actions*. The workflow at
`.github/workflows/deploy.yml` will run on every push to `main`.

### 5. Configure the custom domain

`public/CNAME` already contains `beauty.popoyo.co`, which Pages will
honor. Add this DNS record at the `popoyo.co` registrar:

```
beauty   CNAME   <your-github-username>.github.io.
```

Wait for DNS to propagate, then in **Settings → Pages** verify the custom
domain and check **Enforce HTTPS**.

## Launch checklist

The owner should review/replace:

- [ ] WhatsApp number (`config.whatsappNumber` + `whatsappDisplay`)
- [ ] Instagram handle/URL (`config.instagramHandle`/`instagramUrl`)
- [ ] Final service area list (`config.serviceAreas`)
- [ ] Final payment methods (`config.paymentMethods`)
- [ ] Cancellation policy text (`config.cancellationPolicy`)
- [ ] Service prices/durations (`services` table)
- [ ] Package contents/prices (`packages` table)
- [ ] Whether massage table is included, hair washing availability,
      gel polish supplies, childcare vetting standards (FAQ copy in
      `src/components/Faq.tsx`)

## File map

```
convex/
  schema.ts            tables: config, services, packages, bookingRequests
  config.ts            query: get
  services.ts          query: list
  packages.ts          query: list
  bookingRequests.ts   mutation: submit
  seed.ts              mutation: all  (seed-from-spec)
src/
  main.tsx             ConvexProvider bootstrap
  App.tsx              page composition + selection state
  styles.css           full design system (warm beach-spa palette)
  lib/booking.ts       totals, deposit, WhatsApp deep-link
  components/          Header, Hero, TrustStrip, ServicesSection,
                       PackagesSection, HowItWorks, BookingSection,
                       ServiceArea, Faq, Footer
public/
  CNAME                beauty.popoyo.co
  favicon.svg
.github/workflows/
  deploy.yml           build + push to GitHub Pages
```

## Spec sources

- `popoyo_beauty_claude_spec.md` — full product spec (services, packages, copy)
- `SPEC.md` — cross-business primitives (WhatsApp, maps, conventions)
