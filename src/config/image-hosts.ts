/**
 * Remote hosts allowed for product images (used by next.config.ts and by <ProductImage>).
 * When you move to cloud storage, make sure its host is listed here.
 * Wildcards: "**.example.com" matches any sub-domain depth.
 */
const extra = (() => {
  try {
    const base = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    return base ? [new URL(base).hostname] : [];
  } catch {
    return [];
  }
})();

export const IMAGE_HOSTS: string[] = [
  "i.pinimg.com", // Pinterest (temporary placeholders)
  "res.cloudinary.com",
  "**.imagekit.io",
  "**.amazonaws.com",
  "storage.googleapis.com",
  "firebasestorage.googleapis.com",
  "**.r2.dev",
  "**.supabase.co",
  "**.public.blob.vercel-storage.com",
  ...extra,
];

export function isAllowedImageHost(hostname: string): boolean {
  return IMAGE_HOSTS.some((pattern) => {
    if (pattern.startsWith("**.")) return hostname.endsWith(pattern.slice(2));
    return hostname === pattern;
  });
}
