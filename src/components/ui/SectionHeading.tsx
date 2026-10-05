import Link from "next/link";
import { cn } from "@/lib/cn";

interface Props {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeading({ title, description, href, linkLabel, className }: Props) {
  return (
    <div className={cn("mb-8 flex items-end justify-between gap-6 border-t border-ink pt-5 xl1:mb-12 xl1:pt-6 xl2:mb-14 xl3:pt-7 xl4:mb-16 xl4:pt-8", className)}>
      <div>
        <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight md:text-4xl xl1:text-[2.6rem] xl2:text-[2.8rem] xl3:text-5xl xl4:text-[3.4rem]">{title}</h2>
        {description && <p className="mt-2 max-w-xl text-muted xl1:text-lg xl2:max-w-2xl xl3:mt-3 xl3:text-xl xl4:max-w-3xl">{description}</p>}
      </div>
      {href && linkLabel && (
        <Link href={href} className="shrink-0 text-[0.95rem] font-semibold underline decoration-green decoration-2 underline-offset-4 hover:text-green-dark xl1:text-base xl3:text-lg">{linkLabel}</Link>
      )}
    </div>
  );
}
