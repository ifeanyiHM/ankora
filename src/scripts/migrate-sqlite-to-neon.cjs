const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");
const postgres = require("postgres");

function readEnv(name) {
  const content = fs.readFileSync(".env.local", "utf8");
  const line = content
    .split(/\r?\n/)
    .find((item) => new RegExp(`^\\s*${name}\\s*=`).test(item));

  if (!line) throw new Error(`${name} is missing from .env.local`);

  return line
    .slice(line.indexOf("=") + 1)
    .trim()
    .replace(/^(['"])(.*)\1$/, "$2");
}

const dbPath = path.resolve(readEnv("DATABASE_FILE"));
const connectionString = readEnv("DATABASE_URL");

if (!fs.existsSync(dbPath)) {
  throw new Error(`SQLite database not found: ${dbPath}`);
}

const sqlite = new Database(dbPath, { readonly: true });
const sql = postgres(connectionString, {
  connect_timeout: 10,
  max: 1,
});

const schema = `
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  origin TEXT NOT NULL,
  uses TEXT NOT NULL,
  material TEXT NOT NULL,
  width TEXT NOT NULL,
  care TEXT NOT NULL,
  pattern TEXT NOT NULL,
  unit_name TEXT NOT NULL,
  unit_plural TEXT NOT NULL,
  unit_min INTEGER NOT NULL,
  unit_max INTEGER NOT NULL,
  unit_default INTEGER NOT NULL,
  image TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id),
  price INTEGER NOT NULL,
  colors TEXT NOT NULL,
  description TEXT NOT NULL,
  badge TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  main_image TEXT,
  gallery TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
);

CREATE INDEX idx_products_category ON products(category_id);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  full_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  notes TEXT,
  subtotal INTEGER NOT NULL,
  delivery INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
  payment_status TEXT NOT NULL DEFAULT 'PENDING',
  paystack_ref TEXT UNIQUE,
  tracking_number TEXT,
  courier TEXT,
  stock_decremented INTEGER NOT NULL DEFAULT 0,
  confirmation_email_sent_at TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
);

CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  unit_label TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

CREATE TABLE order_status_events (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
);

CREATE INDEX idx_status_events_order ON order_status_events(order_id);

CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
);
`;

const tables = [
  "categories",
  "products",
  "orders",
  "order_items",
  "order_status_events",
  "admin_users",
];

async function main() {
  try {
    // Confirm Neon is still empty before migrating.
    const existing = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    `;

    if (existing.length !== 0) {
      throw new Error(
        "Neon is no longer empty. Migration stopped to protect existing data.",
      );
    }

    const counts = {};

    for (const table of tables) {
      counts[table] = sqlite
        .prepare(`SELECT COUNT(*) AS count FROM "${table}"`)
        .get().count;
    }

    await sql.begin(async (tx) => {
      // Run each CREATE TABLE / CREATE INDEX statement.
      for (const statement of schema
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)) {
        await tx.unsafe(statement);
      }

      // Copy actual SQLite rows, preserving IDs and relationships.
      for (const table of tables) {
        const rows = sqlite.prepare(`SELECT * FROM "${table}"`).all();

        for (const row of rows) {
          const columns = Object.keys(row);
          const quotedColumns = columns
            .map((column) => `"${column}"`)
            .join(", ");
          const placeholders = columns
            .map((_, index) => `$${index + 1}`)
            .join(", ");

          await tx.unsafe(
            `INSERT INTO "${table}" (${quotedColumns}) VALUES (${placeholders})`,
            columns.map((column) => row[column]),
          );
        }
      }

      // Verify every migrated table before the transaction commits.
      for (const table of tables) {
        const result = await tx.unsafe(
          `SELECT COUNT(*)::int AS count FROM "${table}"`,
        );

        if (result[0].count !== counts[table]) {
          throw new Error(
            `${table}: expected ${counts[table]} rows, found ${result[0].count}`,
          );
        }
      }
    });

    console.log("\nMigration successful. Verified row counts:");

    for (const table of tables) {
      console.log(`${table}: ${counts[table]}`);
    }

    console.log("\nYour SQLite database was not modified.");
  } catch (error) {
    console.error("\nMigration failed:", error.message);
    console.error("The Neon transaction was rolled back if it had started.");
    process.exitCode = 1;
  } finally {
    sqlite.close();
    await sql.end({ timeout: 5 });
  }
}

main();
