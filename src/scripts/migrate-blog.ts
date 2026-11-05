/**
 * Creates the blog_posts table. Safe to run more than once.
 * Run with: npm run db:migrate-blog
 *
 * Or paste the SQL below into the Neon SQL editor.
 */
import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env.local" });

const DDL = `
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  content JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  reading_minutes INTEGER NOT NULL DEFAULT 1,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published
  ON blog_posts (status, published_at DESC);
`;

async function main() {
  const connectionString =
    process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Set DATABASE_URL (or DATABASE_URL_UNPOOLED) in .env.local.");
  }

  const sql = postgres(connectionString, { max: 1, connect_timeout: 15, prepare: false });

  try {
    await sql.unsafe(DDL);
    console.log("blog_posts table is ready.");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("Blog migration failed:", error.message);
  process.exitCode = 1;
});
