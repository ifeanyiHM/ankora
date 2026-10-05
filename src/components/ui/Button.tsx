import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "bg-green text-white hover:bg-green-dark",
  dark: "bg-ink text-white hover:bg-ink-soft/85",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white",
  ghost: "text-ink hover:bg-surface-2",
};
// Each size keeps stepping up at xl1/xl2/xl3/xl4, the same way it already grows from sm to lg,
// so a button on a 1920px screen doesn't look identical to the same button at 1280px.
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm xl1:h-[2.375rem] xl1:px-[1.125rem] xl2:h-10 xl3:px-5 xl4:h-[2.625rem] xl4:text-[0.9rem]",
  md: "h-11 px-6 text-[0.95rem] xl1:h-12 xl1:px-7 xl2:h-[3.125rem] xl2:text-base xl3:px-8 xl4:h-[3.25rem] xl4:text-[1.02rem]",
  lg: "h-12 px-7 text-base xl1:h-14 xl1:px-9 xl1:text-[1.05rem] xl2:h-[3.625rem] xl2:text-[1.1rem] xl3:px-10 xl3:h-[3.75rem] xl4:h-16 xl4:px-11 xl4:text-[1.2rem]",
};

export const buttonClasses = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(base, variants[variant], sizes[size], className);

interface CommonProps { variant?: Variant; size?: Size; className?: string; children: React.ReactNode }

export function Button({ variant, size, className, children, ...rest }: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={buttonClasses(variant, size, className)} {...rest}>{children}</button>;
}

export function ButtonLink({ variant, size, className, children, ...rest }: CommonProps & React.ComponentProps<typeof Link>) {
  return <Link className={buttonClasses(variant, size, className)} {...rest}>{children}</Link>;
}
