"use client";

import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { useState } from "react";
import { sendContactMessage, type ContactField } from "./actions";
import { CONTACT_TOPICS } from "./topics";

const input =
  "h-12 w-full rounded-lg border border-ink/25 bg-white px-4 text-base outline-none transition focus:border-green focus:ring-1 focus:ring-green xl1:h-[3.25rem] xl1:px-[1.125rem] xl1:text-[1.05rem] xl2:h-14 xl3:px-5 xl3:text-lg xl4:h-[3.75rem]";
const labelCls = "mb-1.5 block text-sm font-semibold xl1:mb-2 xl1:text-base xl3:text-lg";

const EMPTY = { name: "", email: "", phone: "", topic: "fabric", orderNumber: "", message: "", website: "" };

function Field({
  label,
  htmlFor,
  optional,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1 text-sm text-danger xl1:text-base">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const set =
    (key: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const a11y = (key: ContactField) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setErrors({});
    setFormError(null);
    const res = await sendContactMessage(values).catch(() => ({
      ok: false as const,
      error: "Something went wrong. Please try again.",
    }));
    setSending(false);
    if (res.ok) {
      setSentTo(values.name.trim().split(/\s+/)[0] ?? "");
      setValues(EMPTY);
      return;
    }
    setErrors(("fieldErrors" in res && res.fieldErrors) || {});
    setFormError(res.error ?? null);
  }

  if (sentTo !== null) {
    return (
      <div className="py-10 text-center xl1:py-16" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-green text-white xl1:size-16">
          <Check className="size-6 xl1:size-7" />
        </span>
        <h2 className="mt-6 text-2xl font-bold xl1:text-3xl xl3:text-4xl">Thank you{sentTo ? `, ${sentTo}` : ""}</h2>
        <p className="mx-auto mt-3 max-w-sm text-muted xl1:max-w-md xl1:text-lg xl3:text-xl">
          Your message is with us. We&apos;ll reply to the email address you gave.
        </p>
        <Button variant="outline" className="mt-8" onClick={() => setSentTo(null)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 xl1:gap-6 xl3:gap-7">
      {formError && (
        <p role="alert" className="rounded-lg border border-danger/40 bg-danger/5 p-4 text-danger xl1:p-5 xl1:text-lg">
          {formError}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl1:gap-6 xl3:gap-7">
        <Field label="Your name" htmlFor="name" error={errors.name}>
          <input id="name" autoComplete="name" value={values.name} onChange={set("name")} className={input} {...a11y("name")} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} className={input} {...a11y("email")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl1:gap-6 xl3:gap-7">
        <Field label="Phone" htmlFor="phone" optional error={errors.phone}>
          <input id="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} className={input} {...a11y("phone")} />
        </Field>
        <Field label="I'm writing about" htmlFor="topic" error={errors.topic}>
          <select id="topic" value={values.topic} onChange={set("topic")} className={input} {...a11y("topic")}>
            {Object.entries(CONTACT_TOPICS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {values.topic === "order" && (
        <Field label="Order number" htmlFor="orderNumber" optional error={errors.orderNumber}>
          <input
            id="orderNumber"
            placeholder="ANK-20260928-00124"
            value={values.orderNumber}
            onChange={set("orderNumber")}
            className={input}
            {...a11y("orderNumber")}
          />
        </Field>
      )}

      <Field label="Message" htmlFor="message" error={errors.message}>
        <textarea
          id="message"
          rows={6}
          value={values.message}
          onChange={set("message")}
          className={`${input} h-auto resize-y py-3 xl1:py-3.5`}
          {...a11y("message")}
        />
      </Field>

      {/* Spam trap: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
      </div>

      <Button type="submit" size="lg" disabled={sending} className="w-full sm:w-auto sm:justify-self-start">
        {sending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
