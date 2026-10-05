# Ankora

Online store for Nigerian and African traditional fabrics. Next.js (App Router), TypeScript, Tailwind CSS 4, SQLite, Paystack.

## Run it

```bash
npm install
cp .env.example .env.local        # fill in ADMIN_SESSION_SECRET at minimum, and your Paystack key
npm run db:seed                   # creates the database, the 14 categories, 75 products, and the first admin login
npm run dev                       # http://localhost:3000
npm run build && npm start        # production
```

The seed script prints the admin email/password it created (from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local`,
or the defaults in `.env.example` if you don't set them). Sign in at `/admin/login` and change that password's
source before going live — there's no in-app "change password" screen yet, so update `ADMIN_PASSWORD` and
re-run a small script, or edit the `admin_users` table directly.

## Where things live

| What | Where |
| --- | --- |
| Database (SQLite, one file) | `src/lib/db/` — `schema.sql`, `client.ts`, and `categories.ts` / `products.ts` / `orders.ts` / `admin.ts` |
| Seed data (14 categories, 75 products) — used once by `db:seed` | `src/data/categories.ts`, `src/data/products.ts` |
| Store settings: free-delivery threshold, dispatch time | `src/config/site.ts` |
| Delivery zones and fees | `src/lib/delivery.ts` |
| Allowed image hosts | `src/config/image-hosts.ts` |
| Colours, fonts, breakpoints (xl1–xl4) | `src/app/globals.css` |
| Cart state (persisted in the browser, self-contained) | `src/store/cart.ts` |
| Order pricing (server re-checks price, unit and stock from the DB) | `src/lib/pricing.ts` |
| Order numbers (`ANK-20260928-00124`) | `src/lib/order-number.ts` |
| Paystack calls, webhook signature check | `src/lib/paystack.ts` |
| Payment confirmation (stock, email, idempotent) | `src/lib/orders.ts` |
| Admin session (JWT cookie), password hashing | `src/lib/auth-session.ts`, `src/lib/auth-password.ts`, `src/lib/admin-auth.ts` |
| Route protection for `/admin/*` | `src/proxy.ts` (Next's middleware, renamed in Next 16) |
| Email sending + templates | `src/lib/mail.ts`, `src/lib/email-templates.ts` |

## How the storefront works

No account or sign-in is required to buy. The cart lives in the browser (`localStorage`, via
`zustand`); each cart line carries its own name, price and image so the cart never needs to
re-query the catalogue. At checkout, the **server** re-reads price, selling unit and stock from
the database and prices the order itself — the browser's numbers are never trusted for billing.

Every paid order gets a unique, human-readable order number: `ANK-YYYYMMDD-#####`. Customers can
look up any order at `/track-order` using the order number **plus** the email or phone number used
at checkout — that pairing is required before any order details are shown.

Order status is a fixed sequence: Pending payment → Payment confirmed → Processing → Ready for
dispatch → Shipped → Out for delivery → Delivered (or Cancelled at any point). Payment status
(Pending / Paid / Failed) is separate and is only ever set by Paystack, never by the admin.

## How payments work

1. Checkout posts the cart to `/api/checkout`. The server prices it from the database, creates the
   `Order` row (status `PENDING_PAYMENT`), and starts a Paystack transaction using the order number
   as the reference.
2. The customer pays on Paystack's page and returns to `/checkout/verify`, which confirms the
   payment with Paystack, marks the order paid, decrements stock, and shows the receipt.
3. Paystack also calls `/api/paystack/webhook` (set this URL in your Paystack dashboard: Settings →
   API Keys & Webhooks). Its signature is verified, and it does the same "mark paid" work — whichever
   of the webhook or the return page arrives first does the work; the other is a safe no-op.

## Admin dashboard

`/admin/login` — sign in. `/admin` is protected by `src/proxy.ts` (Next's middleware): unauthenticated
visitors are redirected to the login page, and every admin server action re-checks the session too.

- **Products** (`/admin/products`) — add, edit, delete; set price, stock, colours, images, badge,
  featured flag, and whether it's visible in the store.
- **Categories** (`/admin/categories`) — edit copy, specs and image for the 14 fabric families.
  (Categories aren't added/removed from here, since products depend on them.)
- **Orders** (`/admin/orders`) — filter by status, search by order number/name/email/phone, open an
  order to see its items, customer and shipping details, and update its status, tracking number and
  courier. Paid customers are emailed automatically when the status changes.

## Email

`src/lib/mail.ts` sends through any SMTP provider via Nodemailer. Without `SMTP_HOST` etc. set, it
logs what it would have sent instead of failing — so checkout and admin actions work in development
without a mail server. Emails sent: order confirmation (on payment), and a status update whenever the
admin changes a paid order's status (shipped, delivered, etc.).

## Deployment note: SQLite

The database is one SQLite file (`better-sqlite3`), so there's nothing to provision locally. This
works well on a normal Node server — a VPS, Docker container, Railway, Render with a persistent disk.
It does **not** work on plain serverless functions with an ephemeral filesystem (e.g. Vercel's default
Node runtime), because writes disappear between invocations. If you deploy there, swap `src/lib/db/`
for a client of a hosted database (Postgres on Neon/Supabase, PlanetScale, Turso, etc) — every other
file only talks to `src/lib/db/*`, so the change is contained.

## Images

Set a product's `mainImage` / gallery URLs from its edit page in the admin dashboard, or a category's
image from its edit page. A value can be a full `https://` URL, or — if you set
`NEXT_PUBLIC_IMAGE_BASE_URL` — a short key like `aso-oke/gold.jpg` resolved against it. Leave it blank
and Ankora shows a generated fabric swatch instead, which is also the fallback if a photo fails to load.
Remember to add any new image host to `src/config/image-hosts.ts`.
