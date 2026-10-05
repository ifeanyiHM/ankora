import { Search } from "lucide-react";

export function SearchForm({ className }: { className?: string }) {
  return (
    <form action="/shop" role="search" className={className}>
      <label htmlFor="site-search" className="sr-only">Search fabrics</label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-[1.1rem] -translate-y-1/2 text-muted" />
        <input
          id="site-search"
          name="q"
          type="search"
          placeholder="Search fabrics, colours or prints"
          className="h-11 w-full rounded-full bg-surface pl-11 pr-4 text-[0.95rem] outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-green xl1:h-12 xl1:pl-12 xl1:text-base xl2:h-[3.25rem] xl3:h-14 xl3:text-[1.05rem] xl4:h-[3.75rem]"
        />
      </div>
    </form>
  );
}
