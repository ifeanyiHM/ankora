import { SITE } from "@/config/site";

/** Delivery zones and flat fees (₦). Placeholder rates: edit to match your courier. */
const ZONES = {
  lagos: { label: "Lagos", fee: 2_500, states: ["Lagos"] },
  southWest: { label: "South-West", fee: 3_500, states: ["Ogun", "Oyo", "Osun", "Ondo", "Ekiti"] },
  central: { label: "Abuja and North-Central", fee: 4_500, states: ["FCT Abuja", "Kwara", "Kogi", "Niger", "Benue", "Plateau", "Nasarawa"] },
  south: { label: "South-East and South-South", fee: 4_500, states: ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo", "Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"] },
  north: { label: "North", fee: 5_500, states: ["Adamawa", "Bauchi", "Borno", "Gombe", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Sokoto", "Taraba", "Yobe", "Zamfara"] },
} as const;

export const NIGERIAN_STATES: string[] = Object.values(ZONES).flatMap((z) => [...z.states]).sort((a, b) => a.localeCompare(b));

export const DELIVERY_ZONES = Object.values(ZONES);

export function getDeliveryFee(state: string, subtotal: number): number {
  if (subtotal >= SITE.freeDeliveryThreshold) return 0;
  const zone = Object.values(ZONES).find((z) => (z.states as readonly string[]).includes(state));
  return zone ? zone.fee : ZONES.north.fee;
}
