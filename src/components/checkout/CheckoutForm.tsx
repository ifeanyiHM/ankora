"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { SwatchImage } from "@/components/shop/SwatchImage";
import { Button, buttonClasses } from "@/components/ui/Button";
import { SITE } from "@/config/site";
import { NIGERIAN_STATES, getDeliveryFee } from "@/lib/delivery";
import { unitLabel } from "@/lib/catalog-utils";
import { cartSubtotal } from "@/lib/cart-helpers";
import { formatNaira } from "@/lib/format";
import { useMounted } from "@/lib/use-mounted";
import { customerSchema } from "@/lib/validation";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/cn";

type Fields = "fullName" | "email" | "phone" | "address" | "city" | "state" | "notes";
const EMPTY: Record<Fields, string> = { fullName: "", email: "", phone: "", address: "", city: "", state: "", notes: "" };

const input = "h-12 w-full rounded-lg border border-ink/25 bg-white px-4 text-base outline-none transition focus:border-green focus:ring-1 focus:ring-green xl1:h-[3.25rem] xl1:px-[1.125rem] xl1:text-[1.05rem] xl2:h-14 xl3:px-5 xl3:text-lg xl4:h-[3.75rem]";

function Field({ label, error, children, htmlFor }: { label: string; error?: string; children: React.ReactNode; htmlFor: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold xl1:mb-2 xl1:text-base xl3:text-lg">{label}</label>
      {children}
      {error && <p id={`${htmlFor}-error`} className="mt-1 text-sm text-danger xl1:text-base">{error}</p>}
    </div>
  );
}

export function CheckoutForm({ cancelled }: { cancelled?: boolean }) {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(cancelled ? "Payment was cancelled. Your cart is still here, so you can try again." : null);

  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const delivery = values.state ? getDeliveryFee(values.state, subtotal) : null;
  const total = subtotal + (delivery ?? 0);

  if (!mounted) return <div className="h-64" aria-busy="true" />;

  if (!items.length) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-muted">Add a fabric before checking out.</p>
        <Link href="/shop" className={buttonClasses("primary", "lg", "mt-6")}>Browse fabrics</Link>
      </div>
    );
  }

  const set = (k: Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };
  const a11y = (k: Fields) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-error` : undefined });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const parsed = customerSchema.safeParse({ ...values, notes: values.notes || undefined });
    if (!parsed.success) {
      const next: Partial<Record<Fields, string>> = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as Fields] ??= issue.message;
      setErrors(next);
      document.getElementById(Object.keys(next)[0])?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: parsed.data, items: items.map(({ slug, quantity }) => ({ slug, quantity })) }),
      });
      const data = (await res.json()) as { authorizationUrl?: string; error?: string };
      if (!res.ok || !data.authorizationUrl) throw new Error(data.error ?? "We could not start your payment.");
      window.location.assign(data.authorizationUrl);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_26rem] xl1:grid-cols-[1fr_30rem] xl1:gap-16 xl2:gap-20 xl3:grid-cols-[1fr_34rem] xl3:gap-24 xl4:gap-28">
      <div>
        {serverError && <p role="alert" className="mb-6 rounded-lg border border-danger/40 bg-danger/5 p-4 text-danger xl1:p-5 xl1:text-lg">{serverError}</p>}
        <fieldset className="grid gap-5 sm:grid-cols-2 xl1:gap-6 xl3:gap-7">
          <legend className="mb-4 text-xl font-bold xl1:mb-5 xl1:text-2xl xl3:text-3xl">Contact and delivery</legend>
          <Field label="Full name" htmlFor="fullName" error={errors.fullName}><input id="fullName" autoComplete="name" value={values.fullName} onChange={set("fullName")} className={input} {...a11y("fullName")} /></Field>
          <Field label="Phone number" htmlFor="phone" error={errors.phone}><input id="phone" type="tel" autoComplete="tel" placeholder="0803 123 4567" value={values.phone} onChange={set("phone")} className={input} {...a11y("phone")} /></Field>
          <div className="sm:col-span-2"><Field label="Email" htmlFor="email" error={errors.email}><input id="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} className={input} {...a11y("email")} /></Field></div>
          <div className="sm:col-span-2"><Field label="Delivery address" htmlFor="address" error={errors.address}><input id="address" autoComplete="street-address" value={values.address} onChange={set("address")} className={input} {...a11y("address")} /></Field></div>
          <Field label="City or town" htmlFor="city" error={errors.city}><input id="city" autoComplete="address-level2" value={values.city} onChange={set("city")} className={input} {...a11y("city")} /></Field>
          <Field label="State" htmlFor="state" error={errors.state}>
            <select id="state" autoComplete="address-level1" value={values.state} onChange={set("state")} className={cn(input, !values.state && "text-muted")} {...a11y("state")}>
              <option value="">Choose your state</option>
              {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <div className="sm:col-span-2"><Field label="Order notes (optional)" htmlFor="notes" error={errors.notes}><textarea id="notes" rows={3} value={values.notes} onChange={set("notes")} className={cn(input, "h-auto py-3 xl1:py-3.5")} placeholder="Landmarks, preferred delivery time, cutting instructions" {...a11y("notes")} /></Field></div>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-44 lg:self-start">
        <ul className="mb-4 divide-y divide-line border-y border-line xl1:mb-5 xl3:mb-6">
          {items.map((item) => (
            <li key={item.slug} className="flex items-center gap-3 py-3 xl1:gap-4 xl1:py-4 xl3:py-5">
              <SwatchImage src={item.image} pattern={item.pattern} colors={item.colors} alt={item.name} sizes="56px" className="h-[4.5rem] w-14 shrink-0 rounded-[4px] xl1:h-20 xl1:w-16 xl3:h-24 xl3:w-[4.8rem]" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold xl1:text-lg">{item.name}</p>
                <p className="text-sm text-muted xl1:text-base">{item.quantity} {unitLabel(item.unit, item.quantity)}</p>
              </div>
              <p className="font-semibold xl1:text-lg">{formatNaira(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <OrderSummary subtotal={subtotal} delivery={delivery} total={total}>
          {!values.state && <p className="mt-2 text-sm text-muted xl1:text-base">Choose your state to see the delivery fee.</p>}
          <Button type="submit" size="lg" className="mt-5 w-full" disabled={submitting}>
            <Lock className="size-4" /> {submitting ? "Opening Paystack..." : `Pay ${formatNaira(total)}`}
          </Button>
          <p className="mt-3 text-center text-xs text-muted xl1:text-sm xl3:text-[0.95rem]">You will pay on Paystack&apos;s secure page. Ankora never sees your card details. Orders over {formatNaira(SITE.freeDeliveryThreshold)} ship free.</p>
        </OrderSummary>
      </aside>
    </form>
  );
}
