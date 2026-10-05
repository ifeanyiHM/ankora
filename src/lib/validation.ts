import { z } from "zod";
import { NIGERIAN_STATES } from "@/lib/delivery";

export const customerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?234|0)[789][01]\d{8}$/, "Enter a Nigerian phone number, like 0803 123 4567"),
  address: z.string().trim().min(6, "Enter your delivery address"),
  city: z.string().trim().min(2, "Enter your city or town"),
  state: z.string().refine((s) => NIGERIAN_STATES.includes(s), "Choose your state"),
  notes: z.string().trim().max(300, "Keep notes under 300 characters").optional(),
});

export const checkoutSchema = z.object({
  customer: customerSchema,
  items: z
    .array(z.object({ slug: z.string(), quantity: z.number().int().positive() }))
    .min(1, "Your cart is empty")
    .max(50),
});

export type CheckoutPayload = z.infer<typeof checkoutSchema>;
