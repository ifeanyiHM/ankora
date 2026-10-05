import { orderNumberExists } from "@/lib/db/orders";

/** Human-readable and unique: ANK-20260928-00124 */
export function generateOrderNumber(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  for (let attempt = 0; attempt < 8; attempt++) {
    const rand = String(Math.floor(Math.random() * 100_000)).padStart(5, "0");
    const candidate = `ANK-${datePart}-${rand}`;
    if (!orderNumberExists(candidate)) return candidate;
  }
  throw new Error("Could not generate a unique order number, please try again");
}
