"use server";

import { clearAdminSessionCookie } from "@/lib/admin-auth";

export async function logoutAction(): Promise<void> {
  await clearAdminSessionCookie();
}
