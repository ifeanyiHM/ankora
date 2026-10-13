import postgres from "postgres";
import "server-only";

const connectionString =
  process.env.DATABASE_URL ?? process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  throw new Error(
    "Missing DATABASE_URL or DATABASE_URL_UNPOOLED environment variable.",
  );
}

type DatabaseClient = ReturnType<typeof postgres>;

const globalForDb = globalThis as typeof globalThis & {
  __ankoraSql?: DatabaseClient;
};

export const sql: DatabaseClient =
  globalForDb.__ankoraSql ??
  postgres(connectionString, {
    max: 1,
    prepare: false,
    connect_timeout: 20,
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__ankoraSql = sql;
}

export const newId = (): string => crypto.randomUUID();

export const nowIso = (): string => new Date().toISOString();
