import { formatNaira } from "@/lib/format";

interface Props {
  subtotal: number;
  delivery?: number | null;
  total?: number;
  children?: React.ReactNode;
}

export function OrderSummary({ subtotal, delivery, total, children }: Props) {
  const row = "flex items-center justify-between py-1.5 xl1:py-2 xl3:text-lg";
  return (
    <div className="rounded-[4px] bg-surface p-5 xl1:p-7 xl2:p-8 xl3:p-9">
      <h2 className="mb-3 text-lg font-bold xl1:mb-4 xl1:text-xl xl3:text-2xl">Order summary</h2>
      <div className={row}><span className="text-muted">Subtotal</span><span className="font-medium">{formatNaira(subtotal)}</span></div>
      <div className={row}>
        <span className="text-muted">Delivery</span>
        <span className="font-medium">{delivery == null ? "Set at checkout" : delivery === 0 ? "Free" : formatNaira(delivery)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-ink/20 pt-3 text-lg font-bold xl1:pt-4 xl1:text-xl xl3:text-2xl">
        <span>Total</span><span>{formatNaira(total ?? subtotal)}</span>
      </div>
      {children}
    </div>
  );
}
