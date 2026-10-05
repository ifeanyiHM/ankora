export function StockBadge({ stock, className = "" }: { stock: number; className?: string }) {
  if (stock <= 0) return <span className={`rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white ${className}`}>Sold out</span>;
  if (stock <= 3) return <span className={`rounded-full bg-gold-tint px-2.5 py-1 text-xs font-semibold text-gold-dark ${className}`}>Only {stock} left</span>;
  return null;
}
