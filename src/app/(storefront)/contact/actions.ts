"use server";

import { SITE } from "@/config/site";
import { trySendMail } from "@/lib/mail";
import { headers } from "next/headers";
import { z } from "zod";
import { CONTACT_TOPICS } from "./topics";

export type ContactField = "name" | "email" | "phone" | "topic" | "orderNumber" | "message";

export interface ContactResult {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
}

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80, "Keep your name under 80 characters"),
  email: z.string().trim().email("Enter a valid email address").max(120),
  phone: z
    .string()
    .trim()
    .max(20, "That phone number is too long")
    .regex(/^(\+?[\d\s-]{7,20})?$/, "Enter a valid phone number"),
  topic: z.enum(["fabric", "bulk", "order", "other"], { message: "Choose a topic" }),
  orderNumber: z.string().trim().max(40, "That order number is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters)")
    .max(2000, "Keep your message under 2,000 characters"),
});

// Best-effort limit per visitor. On serverless hosts each instance keeps its own count, which is
// still enough to stop a single browser or script from flooding the inbox.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function tooMany(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const esc = (value: string): string =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendContactMessage(input: Record<string, string>): Promise<ContactResult> {
  // Hidden field real visitors never see. Bots fill it in. Pretend it worked so they don't adapt.
  if (input.website) return { ok: true };

  const parsed = schema.safeParse({
    name: input.name ?? "",
    email: input.email ?? "",
    phone: input.phone ?? "",
    topic: input.topic ?? "",
    orderNumber: input.orderNumber ?? "",
    message: input.message ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: ContactResult["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (tooMany(ip)) {
    return { ok: false, error: "You've sent several messages in a short time. Please wait a few minutes and try again." };
  }

  const { name, email, phone, topic, orderNumber, message } = parsed.data;
  const topicLabel = CONTACT_TOPICS[topic];

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "Not given"],
    ["About", topicLabel],
    ["Order number", orderNumber || "Not given"],
  ];

  const sent = await trySendMail({
    to: SITE.email,
    replyTo: `${name.replace(/[<>",]/g, "")} <${email}>`,
    subject: `Website enquiry: ${topicLabel} (${name})`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${message}`,
    html: `<table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">${rows
      .map(([k, v]) => `<tr><td style="padding:2px 16px 2px 0;color:#666">${k}</td><td>${esc(v)}</td></tr>`)
      .join("")}</table><p style="font-family:sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap;margin-top:20px">${esc(message)}</p>`,
  });

  if (!sent) {
    return {
      ok: false,
      error: `We couldn't send your message just now. Please email us at ${SITE.email}${SITE.whatsapp ? " or message us on WhatsApp" : ""} instead.`,
    };
  }

  return { ok: true };
}
