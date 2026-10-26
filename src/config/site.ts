/** Store-wide settings. Edit policy values here. They are placeholders until you confirm them. */
export const SITE = {
  name: "Ankora",
  tagline: "Nigerian and African fabrics, delivered",
  description:
    "Shop Aso Oke, Adire, Akwete, Ankara and Lace fabrics by the yard, piece or set. Delivered across Nigeria.",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ankorastore.xyz",
  email: "ankora60@gmail.com",
  /** Digits only, with country code (e.g. 2348012345678). The footer link shows only when this is set. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  currency: "NGN" as const,
  /** Orders with a subtotal at or above this get free delivery (₦) */
  freeDeliveryThreshold: 150_000,
  /** Working days between payment and dispatch */
  dispatchDays: "2 to 3",
} as const;
