/** Store-wide settings. Edit policy values here. They are placeholders until you confirm them. */
export const SITE = {
  name: "Ankora",
  tagline: "Nigerian and African fabrics, delivered",
  description:
    "Shop Aso Oke, Adire, Akwete, Ankara, Lace, Kente and more. Traditional Nigerian and African fabrics by the yard, piece or set, delivered across Nigeria.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hello@ankora.ng",
  currency: "NGN" as const,
  /** Orders with a subtotal at or above this get free delivery (₦) */
  freeDeliveryThreshold: 150_000,
  /** Working days between payment and dispatch */
  dispatchDays: "2 to 3",
} as const;
