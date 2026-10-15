export function StockBadge({
  stock,
  className = "",
}: {
  stock: number;
  className?: string;
}) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold leading-none tracking-wide shadow-sm backdrop-blur-sm xl1:px-3 xl1:py-1.5 xl1:text-xs";

  if (stock <= 0) {
    return (
      <span
        className={`${base} border-green/10 bg-green/95 text-white ${className}`}
      >
        Sold out
      </span>
    );
  }

  if (stock <= 3) {
    return (
      <span
        className={`${base} border-gold/25 bg-[#FBF3D9]/95 text-[#765600] ${className}`}
      >
        Only {stock} left
      </span>
    );
  }

  return null;
}
