"use server";

import { setAdminSessionCookie } from "@/lib/admin-auth";
import { verifyPassword } from "@/lib/auth-password";
import { getAdminByEmail } from "@/lib/db/admin";

export interface LoginResult {
  ok: boolean;
  error?: string;
}

export async function loginAction(
  email: string,
  password: string,
): Promise<LoginResult> {
  const admin = getAdminByEmail(email);
  if (!admin) return { ok: false, error: "Incorrect email or password." };
  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return { ok: false, error: "Incorrect email or password." };
  await setAdminSessionCookie({
    sub: admin.id,
    email: admin.email,
    name: admin.name,
  });
  return { ok: true };
}
