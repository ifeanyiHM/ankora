"use server";

import { findOrderForTracking } from "@/lib/db/orders";
import type { OrderRecord } from "@/types";

export interface TrackOrderResult {
  ok: boolean;
  error?: string;
  order?: OrderRecord;
}

export async function trackOrderAction(orderNumber: string, contact: string): Promise<TrackOrderResult> {
  const number = orderNumber.trim().toUpperCase();
  const value = contact.trim();
  if (!number) return { ok: false, error: "Enter your order number." };
  if (!value) return { ok: false, error: "Enter the email or phone number used at checkout." };

  const order = findOrderForTracking(number, value);
  if (!order) return { ok: false, error: "We couldn't find an order with those details. Check your order number and try again." };
  return { ok: true, order };
}
