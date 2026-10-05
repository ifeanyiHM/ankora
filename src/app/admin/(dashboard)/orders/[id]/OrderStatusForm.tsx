"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ORDER_STATUS_LABELS, ORDER_STATUSES, type OrderRecord } from "@/types";
import { updateOrderAction } from "../actions";

const input = "h-11 w-full rounded-lg border border-ink/25 bg-white px-3.5 text-[0.95rem] outline-none transition focus:border-green focus:ring-1 focus:ring-green xl1:h-12 xl1:px-4 xl1:text-base xl3:h-14 xl3:text-lg";
const label = "mb-1.5 block text-sm font-semibold xl1:mb-2 xl1:text-base xl3:text-lg";

export function OrderStatusForm({ order }: { order: OrderRecord }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [courier, setCourier] = useState(order.courier ?? "");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    const res = await updateOrderAction(order.id, { status, trackingNumber, courier, note });
    setSaving(false);
    if (!res.ok) { setError(res.error ?? "Something went wrong."); return; }
    setSaved(true);
    setNote("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-[4px] border border-line bg-white p-5 xl1:gap-5 xl1:p-6 xl3:gap-6 xl3:p-7">
      <h2 className="text-lg font-bold xl1:text-xl xl3:text-2xl">Update order</h2>
      <div>
        <label className={label} htmlFor="status">Order status</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={input}>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl1:gap-5">
        <div><label className={label} htmlFor="tracking">Tracking number</label><input id="tracking" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className={input} placeholder="e.g. GIG-0234871" /></div>
        <div><label className={label} htmlFor="courier">Courier</label><input id="courier" value={courier} onChange={(e) => setCourier(e.target.value)} className={input} placeholder="e.g. GIG Logistics" /></div>
      </div>
      <div><label className={label} htmlFor="note">Internal note (optional)</label><textarea id="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} className={`${input} h-auto py-2.5 xl1:py-3`} /></div>
      {error && <p role="alert" className="rounded-lg border border-danger/40 bg-danger/5 p-3 text-sm text-danger xl1:p-4 xl1:text-base">{error}</p>}
      {saved && <p className="rounded-lg border border-green/30 bg-green-tint p-3 text-sm text-green-dark xl1:p-4 xl1:text-base">Order updated{order.paymentStatus === "PAID" ? " and the customer has been emailed." : "."}</p>}
      <Button type="submit" disabled={saving} className="w-fit">{saving ? "Saving..." : "Update order"}</Button>
    </form>
  );
}
