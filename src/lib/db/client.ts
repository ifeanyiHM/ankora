import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

/**
 * SQLite is used here so the whole project runs with zero external services.
 * It works well on a normal Node server (a VPS, Docker, Railway, Render with a persistent disk).
 * It does NOT work on serverless platforms with an ephemeral filesystem (e.g. plain Vercel functions),
 * because writes disappear between invocations. For that kind of deployment, swap this file for a
 * client of a hosted database (Postgres on Neon/Supabase/RDS, PlanetScale, Turso, etc). Every other
 * file in src/lib/db talks to this module only, so the swap is contained here.
 */
const dbPath = process.env.DATABASE_FILE ?? path.join(process.cwd(), "data", "ankora.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const globalForDb = globalThis as unknown as { __ankoraDb?: Database.Database };

export const db: Database.Database =
  globalForDb.__ankoraDb ??
  (() => {
    const instance = new Database(dbPath);
    instance.pragma("journal_mode = WAL");
    instance.pragma("foreign_keys = ON");
    instance.exec(fs.readFileSync(path.join(process.cwd(), "src/lib/db/schema.sql"), "utf-8"));
    return instance;
  })();

if (process.env.NODE_ENV !== "production") globalForDb.__ankoraDb = db;

export const newId = (): string => crypto.randomUUID();
export const nowIso = (): string => new Date().toISOString();
