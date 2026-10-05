import { db, newId } from "./client";
import type { AdminUser } from "@/types";

interface Row { id: string; email: string; password_hash: string; name: string }

export function getAdminByEmail(email: string): (AdminUser & { passwordHash: string }) | null {
  const row = db.prepare<[string], Row>("SELECT * FROM admin_users WHERE email = ?").get(email.trim().toLowerCase());
  return row ? { id: row.id, email: row.email, name: row.name, passwordHash: row.password_hash } : null;
}

export function getAdminById(id: string): AdminUser | null {
  const row = db.prepare<[string], Row>("SELECT * FROM admin_users WHERE id = ?").get(id);
  return row ? { id: row.id, email: row.email, name: row.name } : null;
}

export function countAdmins(): number {
  return (db.prepare("SELECT COUNT(*) AS n FROM admin_users").get() as { n: number }).n;
}

export function createAdmin(email: string, passwordHash: string, name: string): string {
  const id = newId();
  db.prepare("INSERT INTO admin_users (id, email, password_hash, name) VALUES (?, ?, ?, ?)").run(id, email.trim().toLowerCase(), passwordHash, name);
  return id;
}
