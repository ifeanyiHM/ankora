"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

/** Copies text to the clipboard. Uses the modern API, then the older textarea trick for browsers or contexts without it. */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the older method
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/**
 * The order number in a prominent card with a Copy button. Tapping the number itself also selects all of it,
 * so it can still be copied by hand if the button can't (very old browsers, locked-down devices).
 * `hint` is the line of guidance under it, e.g. what the customer needs the number for.
 */
export function CopyOrderNumber({ orderNumber, hint }: { orderNumber: string; hint: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function onCopy() {
    const ok = await copyText(orderNumber);
    setState(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2500);
  }

  return (
    <div className="mt-6 rounded-[4px] border border-line bg-surface p-4 xl1:mt-8 xl1:p-5 xl3:mt-10 xl3:p-6">
      <p className="text-sm font-semibold text-muted xl1:text-base xl3:text-lg">Your order number</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 xl1:gap-4">
        <p className="select-all break-all font-mono text-2xl font-bold tracking-wide text-ink xl1:text-3xl xl3:text-4xl">{orderNumber}</p>
        <button type="button" onClick={onCopy} className={buttonClasses(state === "copied" ? "primary" : "outline", "md")}>
          {state === "copied" ? <Check className="size-4 xl1:size-[1.1rem]" /> : <Copy className="size-4 xl1:size-[1.1rem]" />}
          {state === "copied" ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted xl1:mt-4 xl1:text-base xl3:text-lg">{hint}</p>
      <p role="status" aria-live="polite" className={state === "failed" ? "mt-2 text-sm font-semibold text-danger xl1:text-base" : "sr-only"}>
        {state === "copied" && "Order number copied."}
        {state === "failed" && "Could not copy automatically. Tap the number to select it, then copy it."}
      </p>
    </div>
  );
}
