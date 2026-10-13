import type { AdminUser } from "@/types";
import { newId, sql } from "./client";

interface AdminRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
}

export async function getAdminByEmail(
  email: string,
): Promise<(AdminUser & { passwordHash: string }) | null> {
  const rows = await sql<AdminRow[]>`
    SELECT id, email, password_hash, name
    FROM admin_users
    WHERE email = ${email.trim().toLowerCase()}
    LIMIT 1
  `;

  const row = rows[0];

  return row
    ? {
        id: row.id,
        email: row.email,
        name: row.name,
        passwordHash: row.password_hash,
      }
    : null;
}

export async function getAdminById(id: string): Promise<AdminUser | null> {
  const rows = await sql<AdminRow[]>`
    SELECT id, email, password_hash, name
    FROM admin_users
    WHERE id = ${id}
    LIMIT 1
  `;

  const row = rows[0];

  return row ? { id: row.id, email: row.email, name: row.name } : null;
}

export async function countAdmins(): Promise<number> {
  const rows = await sql<{ n: number }[]>`
    SELECT COUNT(*)::int AS n FROM admin_users
  `;

  return rows[0].n;
}

export async function createAdmin(
  email: string,
  passwordHash: string,
  name: string,
): Promise<string> {
  const id = newId();

  await sql`
    INSERT INTO admin_users (id, email, password_hash, name)
    VALUES (
      ${id},
      ${email.trim().toLowerCase()},
      ${passwordHash},
      ${name}
    )
  `;

  return id;
}
