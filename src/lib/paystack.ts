import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { SITE } from "@/config/site";

const BASE = "https://api.paystack.co";

export class PaystackConfigError extends Error {}

function secret(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new PaystackConfigError("PAYSTACK_SECRET_KEY is not set");
  return key;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: { Authorization: `Bearer ${secret()}`, "Content-Type": "application/json", ...init?.headers },
  });
  const json = (await res.json().catch(() => null)) as { status?: boolean; message?: string; data?: T } | null;
  if (!res.ok || !json?.status || !json.data) throw new Error(json?.message ?? `Paystack request failed (${res.status})`);
  return json.data;
}

export const createReference = (): string => `ANK-PS-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;

export interface OrderMetadata {
  orderNumber: string;
  customer: { fullName: string; phone: string; address: string; city: string; state: string };
  cancel_action: string;
}

export interface PaystackTransaction {
  status: "success" | "failed" | "abandoned" | "pending" | string;
  reference: string;
  amount: number; // kobo
  currency: string;
  paid_at?: string | null;
  customer?: { email?: string };
  metadata?: Partial<OrderMetadata> | null;
}

export const initializeTransaction = (input: { email: string; amountKobo: number; reference: string; metadata: OrderMetadata }) =>
  call<{ authorization_url: string; access_code: string; reference: string }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      currency: SITE.currency,
      reference: input.reference,
      callback_url: `${SITE.url}/checkout/verify`,
      metadata: input.metadata,
    }),
  });

export const verifyTransaction = (reference: string) =>
  call<PaystackTransaction>(`/transaction/verify/${encodeURIComponent(reference)}`);

/** Checks the x-paystack-signature header against the raw request body. */
export function isValidWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = createHmac("sha512", secret()).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
