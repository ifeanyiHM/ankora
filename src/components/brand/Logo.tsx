import { cn } from "@/lib/cn";

/** Ankora mark: an "A" whose apex carries an anchor ring and whose crossbar is a line of stitches. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#008751" />
      <circle cx="20" cy="9.6" r="2.6" fill="none" stroke="#fff" strokeWidth="1.8" />
      <path d="M11.5 31 20 13l8.5 18" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.4 24.6h11.2" stroke="#D4A017" strokeWidth="2.4" strokeDasharray="2.4 2" />
    </svg>
  );
}

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className={cn("text-[1.4rem] font-bold leading-none tracking-tight", light ? "text-white" : "text-ink")}>Ankora</span>
    </span>
  );
}
