import { isAllowedImageHost } from "@/config/image-hosts";

const BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.replace(/\/$/, "");

/** Turns a URL or storage key into a usable https URL, or null if it can't be shown. Pure: safe on client and server. */
export function resolveImageUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const url = /^https?:\/\//i.test(value) ? value : BASE ? `${BASE}/${value.replace(/^\//, "")}` : null;
  if (!url) return null;
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && isAllowedImageHost(hostname) ? url : null;
  } catch {
    return null;
  }
}
