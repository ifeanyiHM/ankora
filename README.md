# Ankora

Online store for Nigerian and African traditional fabrics. Next.js (App Router), TypeScript, Tailwind CSS 4, Postgres (Neon), Paystack.

## Run it

```bash
npm install
cp .env.example .env.local        # fill in DATABASE_URL and ADMIN_SESSION_SECRET at minimum, and your Paystack key
npx tsx src/scripts/test-db-connection.ts   # optional: checks that .env.local can reach your Neon database
npm run db:seed                   # adds the 14 categories, 75 products, and the first admin login to the database
npm run db:migrate-blog           # creates the blog_posts table (safe to re-run; needed once per database)
npm run dev                       # http://localhost:3000
npm run build && npm start        # production
```

The database is Postgres, hosted on [Neon](https://neon.tech). Create a Neon project, copy its connection
string into `DATABASE_URL` in `.env.local`, and make sure the tables exist before seeding. The seed script only
inserts rows; it does not create tables. The Postgres table definitions are in
`src/scripts/migrate-sqlite-to-neon.cjs`, and `src/lib/db/schema.sql` is the old SQLite schema, kept for reference.

The seed script prints the admin email it created (from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local`,
or the defaults in `.env.example` if you don't set them). Sign in at `/admin/login` and change that password
before going live. There's no in-app "change password" screen yet: set `ADMIN_EMAIL` and a new `ADMIN_PASSWORD`
(at least 12 characters) in `.env.local`, then run `npx tsx src/scripts/update-admin.ts`. If there is more than
one admin, also set `ADMIN_CURRENT_EMAIL` to the account you are changing.

### Environment variables

| Variable                                                        | Needed for                                                                                      |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                  | Neon connection string (pooled). Required.                                                      |
| `DATABASE_URL_UNPOOLED`                                         | Optional direct (non-pooled) Neon connection string, preferred by the scripts in `src/scripts/` |
| `ADMIN_SESSION_SECRET`                                          | Signing the admin login cookie. Required.                                                       |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`                                 | The first admin account, used by `db:seed` and `update-admin.ts`                                |
| `PAYSTACK_SECRET_KEY`                                           | Paystack payments and webhook signature check                                                   |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Sending email (see Email below)                                                                 |
| `NEXT_PUBLIC_SITE_URL`                                          | Public site address, used for links and the sitemap                                             |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`                                   | Shows the footer WhatsApp link when set (digits only, with country code)                        |
| `NEXT_PUBLIC_IMAGE_BASE_URL`                                    | Optional base URL for short image keys (see Images)                                             |

## Where things live

| What                                                               | Where                                                                                                                |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Database (Postgres on Neon)                                        | `src/lib/db/` — `client.ts` (connection), and `categories.ts` / `products.ts` / `orders.ts` / `admin.ts` / `blog.ts` |
| Seed data (14 categories, 75 products) — used once by `db:seed`    | `src/data/categories.ts`, `src/data/products.ts`                                                                     |
| Store settings: free-delivery threshold, dispatch time             | `src/config/site.ts`                                                                                                 |
| Delivery zones and fees                                            | `src/lib/delivery.ts`                                                                                                |
| Allowed image hosts                                                | `src/config/image-hosts.ts`                                                                                          |
| Colours, fonts, breakpoints (xl1–xl4)                              | `src/app/globals.css`                                                                                                |
| Cart state (persisted in the browser, self-contained)              | `src/store/cart.ts`                                                                                                  |
| Order pricing (server re-checks price, unit and stock from the DB) | `src/lib/pricing.ts`                                                                                                 |
| Order numbers (`ANK-20260928-00124`)                               | `src/lib/order-number.ts`                                                                                            |
| Paystack calls, webhook signature check                            | `src/lib/paystack.ts`                                                                                                |
| Payment confirmation (stock, email, idempotent)                    | `src/lib/orders.ts`                                                                                                  |
| Admin session (JWT cookie), password hashing                       | `src/lib/auth-session.ts`, `src/lib/auth-password.ts`, `src/lib/admin-auth.ts`                                       |
| Route protection for `/admin/*`                                    | `src/proxy.ts` (Next's middleware, renamed in Next 16)                                                               |
| Email sending + templates                                          | `src/lib/mail.ts`, `src/lib/email-templates.ts`                                                                      |

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
- **Blogs** (`/admin/blogs`) — write, edit, publish/unpublish and delete posts with a Tiptap rich-text editor
  (headings, bold/italic/underline/strike, lists, quotes, links, images by URL). Drafts are only visible here.
  Published posts appear at `/blogs` and `/blogs/<slug>`, in the latest-posts section above the homepage footer,
  and in the sitemap. The only public link to the blog is in the footer. Images are added by URL, like products;
  a post's cover image must come from a host listed in `src/config/image-hosts.ts`.
- **Orders** (`/admin/orders`) — filter by status, search by order number/name/email/phone, open an
  order to see its items, customer and shipping details, and update its status, tracking number and
  courier. Paid customers are emailed automatically when the status changes.

## Email

`src/lib/mail.ts` sends through any SMTP provider via Nodemailer. Without `SMTP_HOST` etc. set, it
logs what it would have sent instead of failing — so checkout and admin actions work in development
without a mail server. Emails sent: order confirmation (on payment), and a status update whenever the
admin changes a paid order's status (shipped, delivered, etc.).

## Deployment note: Neon Postgres

The database is a hosted Neon Postgres database, reached through the `postgres` package in
`src/lib/db/client.ts` using `DATABASE_URL`. Because the data lives outside the app server, the app works on
serverless hosts such as Vercel as well as on a normal Node server. Set the same environment variables
(see the table above) on your host.

Run each one-off script against the right database: `db:seed` and `db:migrate-blog` use the `DATABASE_URL`
in your local `.env.local`, so check which Neon branch that points at before running them. Don't run
`db:seed` against a populated production database unless you mean to add any missing categories and products.
Neon's free-tier databases can pause when idle, so the first request after a quiet period may be slower.

The app moved from SQLite to Postgres. `src/scripts/migrate-sqlite-to-neon.cjs` is the one-off script that copied
the old SQLite data across, and `backup/db-modules/` holds the old SQLite versions of the `src/lib/db/` files.
Neither is used by the running app.

## Images

Set a product's `mainImage` / gallery URLs from its edit page in the admin dashboard, or a category's
image from its edit page. A value can be a full `https://` URL, or — if you set
`NEXT_PUBLIC_IMAGE_BASE_URL` — a short key like `aso-oke/gold.jpg` resolved against it. Leave it blank
and Ankora shows a generated fabric swatch instead, which is also the fallback if a photo fails to load.
Remember to add any new image host to `src/config/image-hosts.ts`.
