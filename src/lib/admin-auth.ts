import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
  signAdminSession,
  verifyAdminSession,
  type AdminSession,
} from "@/lib/auth-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  return verifyAdminSession(jar.get(ADMIN_COOKIE_NAME)?.value);
}

/** Call at the top of every admin server action and admin page. Middleware also guards /admin/*, but actions check again in case they are ever reached another way. */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function setAdminSessionCookie(
  session: AdminSession,
): Promise<void> {
  const token = await signAdminSession(session);
  const jar = await cookies();
  jar.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE_NAME);
}
