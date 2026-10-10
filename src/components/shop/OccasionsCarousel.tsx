// "use client";

// import { Container } from "@/components/ui/Container";
// import { cn } from "@/lib/cn";
// import { createSchedule, type SlideTiming } from "@/lib/slide-scheduler";
// // import type { Occasion } from "@/types";
// import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { Occasion } from "../../app/(storefront)/page";

// const CARD_SIZES =
//   "(min-width:1680px) 28vw, (min-width:1024px) 34vw, (min-width:640px) 46vw, 82vw";

// /**
//  * Slide timing. Every card has its own hold time (1st card, 2nd card, ...; the list repeats if there are
//  * more than six), so the cards run at different speeds. A shared scheduler also keeps at least
//  * `minGapMs` between any two cards changing, so two cards never switch images together. In practice
//  * the first four cards settle at roughly 6s, 8s, 10s and 7s per slide. Edit `holds` to speed a card
//  * up or slow it down; if you add many more cards, raise the holds or lower `minGapMs`, because the
//  * gap rule delays cards when too many want to change at once.
//  */
// const TIMING: SlideTiming = {
//   holds: [5000, 7000, 9000, 6000, 8000, 6500],
//   jitterMs: 600,
//   minGapMs: 1200,
//   staggerMs: 900,
// };

// /** One card: a slideshow through the occasion's own images/videos, with the text and fabric links over it. */
// function OccasionCard({
//   occasion,
//   position,
//   total,
//   index,
//   reduceMotion,
// }: {
//   occasion: Occasion;
//   position: number;
//   total: number;
//   index: number;
//   reduceMotion: boolean;
// }) {
//   const { media } = occasion;
//   const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
//   const alt = `${occasion.title}: ${occasion.fabrics.map((f) => f).join(", ")}`;

//   // Only the active slide's video plays, always from the start.
//   useEffect(() => {
//     media.forEach((m, i) => {
//       const video = videoRefs.current[i];
//       if (!video) return;
//       if (i === index && !reduceMotion) {
//         video.currentTime = 0;
//         void video.play().catch(() => {});
//       } else {
//         video.pause();
//       }
//     });
//   }, [index, media, reduceMotion]);

//   return (
//     <article className="group relative isolate flex aspect-4/5 flex-col justify-between overflow-hidden rounded-sm bg-adire-deep">
//       {media.map((url, i) => (
//         <div
//           key={url + i}
//           aria-hidden={i !== index}
//           className={cn(
//             "absolute inset-0 transition-opacity duration-1400 ease-in-out",
//             i === index ? "opacity-100" : "opacity-0",
//           )}
//         >
//           <Image
//             src={url}
//             alt={i === index ? alt : ""}
//             fill
//             sizes={CARD_SIZES}
//             className="object-cover object-[center_20%]"
//           />
//         </div>
//       ))}
//       {/* <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10 transition-colors duration-500 group-hover:from-black/90" /> */}
//       <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/0 transition-colors duration-500 group-hover:from-black/90" />

//       <div className="relative z-10 p-4 xl1:p-5 xl3:p-6">
//         {media.length > 1 && (
//           <div
//             className="mb-3 flex gap-1 xl1:mb-4 xl1:gap-1.5"
//             aria-hidden="true"
//           >
//             {media.map((url, i) => (
//               <span
//                 key={url + i}
//                 className={cn(
//                   "h-0.5 flex-1 rounded-full transition-colors duration-500 xl3:h-1",
//                   i === index ? "bg-white" : "bg-white/30",
//                 )}
//               />
//             ))}
//           </div>
//         )}
//         <span className="inline-block rounded-full bg-black/30 px-3 py-1 text-xs font-semibold tracking-wider backdrop-blur-sm xl1:text-sm xl3:px-4 xl3:py-1.5 xl3:text-base">
//           {String(position + 1).padStart(2, "0")} /{" "}
//           {String(total).padStart(2, "0")}
//         </span>
//       </div>

//       <div className="relative z-10 p-4 xl1:p-5 xl3:p-6 xl4:p-8">
//         <h3 className="text-2xl font-bold leading-tight tracking-tight xl1:text-[1.7rem] xl3:text-4xl xl4:text-[2.6rem]">
//           {occasion.title}
//         </h3>
//         {/* <p className="mt-2 line-clamp-3 max-w-md text-[0.95rem] leading-relaxed text-white/80 xl1:mt-3 xl1:text-base xl3:text-lg xl4:text-xl">
//           {occasion.note}
//         </p> */}
//         <ul className="mt-4 flex flex-wrap gap-2 xl1:mt-5 xl1:gap-2.5 xl3:mt-6">
//           {occasion.fabrics.map((f) => (
//             <li key={f}>
//               <Link
//                 href={`/category/${f}`}
//                 className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-gold hover:text-ink xl1:px-4 xl1:py-2 xl1:text-[0.95rem] xl3:px-5 xl3:text-base"
//               >
//                 {f}
//                 <ArrowUpRight className="size-3.5 xl1:size-4" />
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </article>
//   );
// }

// export function OccasionsCarousel({ occasions }: { occasions: Occasion[] }) {
//   const trackRef = useRef<HTMLDivElement>(null);
//   const [canPrev, setCanPrev] = useState(false);
//   const [canNext, setCanNext] = useState(true);
//   const [thumb, setThumb] = useState({ width: 100, left: 0 });
//   const [indexes, setIndexes] = useState<number[]>(() =>
//     occasions.map(() => 0),
//   );
//   const [reduceMotion, setReduceMotion] = useState(false);

//   useEffect(() => {
//     setReduceMotion(
//       window.matchMedia("(prefers-reduced-motion: reduce)").matches,
//     );
//   }, []);

//   // One scheduler drives every card's slides (see slide-scheduler.ts).
//   useEffect(() => {
//     if (reduceMotion) return;
//     const counts = occasions.map((o) => o.media.length);
//     const schedule = createSchedule(
//       counts.map((c) => c > 1),
//       TIMING,
//     );
//     const startedAt = performance.now();
//     let timer: ReturnType<typeof setTimeout> | undefined;
//     const run = () => {
//       const { card, at } = schedule.peek();
//       if (!Number.isFinite(at)) return;
//       timer = setTimeout(
//         () => {
//           setIndexes((prev) =>
//             prev.map((v, i) => (i === card ? (v + 1) % counts[i] : v)),
//           );
//           schedule.commit(card, at);
//           run();
//         },
//         Math.max(0, at - (performance.now() - startedAt)),
//       );
//     };
//     run();
//     return () => clearTimeout(timer);
//   }, [occasions, reduceMotion]);

//   const update = useCallback(() => {
//     const el = trackRef.current;
//     if (!el) return;
//     const max = el.scrollWidth - el.clientWidth;
//     const width = Math.min(100, (el.clientWidth / el.scrollWidth) * 100);
//     setCanPrev(el.scrollLeft > 4);
//     setCanNext(el.scrollLeft < max - 4);
//     setThumb({
//       width,
//       left: max > 0 ? (el.scrollLeft / max) * (100 - width) : 0,
//     });
//   }, []);

//   useEffect(() => {
//     const el = trackRef.current;
//     if (!el) return;
//     update();
//     el.addEventListener("scroll", update, { passive: true });
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     return () => {
//       el.removeEventListener("scroll", update);
//       ro.disconnect();
//     };
//   }, [update]);

//   const scrollByCard = (dir: 1 | -1) => {
//     const el = trackRef.current;
//     if (!el) return;
//     const items = el.firstElementChild?.children;
//     const first = items?.[0] as HTMLElement | undefined;
//     const second = items?.[1] as HTMLElement | undefined;
//     const step =
//       first && second
//         ? second.offsetLeft - first.offsetLeft
//         : el.clientWidth * 0.8;
//     el.scrollBy({ left: dir * step, behavior: "smooth" });
//   };

//   const btn =
//     "grid size-11 place-items-center rounded-full border border-white/30 text-white transition hover:border-gold hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/30 disabled:hover:bg-transparent disabled:hover:text-white xl1:size-12 xl2:size-[3.25rem] xl3:size-14";

//   return (
//     <section
//       aria-label="Shop by occasion"
//       className="bg-occasions mt-20 overflow-hidden text-white xl1:mt-28 xl2:mt-32 xl3:mt-36 xl4:mt-44"
//     >
//       <Container className="py-14 xl1:py-20 xl2:py-24 xl3:py-28 xl4:py-32">
//         <div className="flex flex-wrap items-end justify-between gap-6 xl3:gap-8">
//           <div>
//             <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold xl1:text-sm xl3:text-base">
//               <span
//                 aria-hidden="true"
//                 className="h-px w-8 bg-gold xl1:w-10 xl3:w-12"
//               />
//               Shop by occasion
//             </p>
//             <h2 className="mt-3 max-w-2xl text-[1.75rem] font-bold leading-tight tracking-tight md:text-4xl xl1:mt-4 xl1:text-[2.6rem] xl2:max-w-3xl xl3:text-5xl xl4:max-w-4xl xl4:text-[3.4rem]">
//               What are you dressing for?
//             </h2>
//           </div>
//           <div className="flex items-center gap-2 xl1:gap-3">
//             <button
//               type="button"
//               onClick={() => scrollByCard(-1)}
//               disabled={!canPrev}
//               aria-label="Previous occasions"
//               className={btn}
//             >
//               <ChevronLeft className="size-5 xl3:size-6" />
//             </button>
//             <button
//               type="button"
//               onClick={() => scrollByCard(1)}
//               disabled={!canNext}
//               aria-label="Next occasions"
//               className={btn}
//             >
//               <ChevronRight className="size-5 xl3:size-6" />
//             </button>
//           </div>
//         </div>

//         {/* Scroll track: bleeds out to the container's outer edges (matching Container's padding at each breakpoint) so the next card peeks in. */}
//         <div
//           ref={trackRef}
//           role="region"
//           aria-roledescription="carousel"
//           aria-label="Occasions"
//           className={cn(
//             "no-scrollbar mt-8 -mx-4 snap-x snap-mandatory overflow-x-auto scroll-smooth px-4 pb-1 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10",
//             "scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-10 xl1:-mx-12 xl1:mt-12 xl1:px-12 xl1:scroll-pl-12 xl2:-mx-14 xl2:px-14 xl2:scroll-pl-14 xl3:-mx-16 xl3:mt-14 xl3:px-16 xl3:scroll-pl-16 xl4:-mx-20 xl4:mt-16 xl4:px-20 xl4:scroll-pl-20",
//           )}
//         >
//           <ul className="flex gap-3 after:w-px after:shrink-0 sm:gap-4 lg:after:w-6 xl1:gap-5 xl1:after:w-8 xl2:gap-6 xl3:gap-7 xl3:after:w-10 xl4:gap-8">
//             {occasions.map((o, i) => (
//               <li
//                 key={i}
//                 className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[34%] xl2:w-[31%] xl3:w-[28%]"
//               >
//                 <OccasionCard
//                   occasion={o}
//                   position={i}
//                   total={occasions.length}
//                   index={indexes[i] ?? 0}
//                   reduceMotion={reduceMotion}
//                 />
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div
//           className="mt-6 h-0.5 w-full max-w-xs bg-white/20 xl1:mt-8 xl1:max-w-sm xl3:mt-10 xl3:max-w-md"
//           aria-hidden="true"
//         >
//           <div className="relative h-full">
//             <div
//               className="absolute top-0 h-full bg-gold transition-[left,width] duration-150"
//               style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
//             />
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// }

"use client";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
// import type { Occasion } from "@/types";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Occasion } from "../../app/(storefront)/page";

const CARD_SIZES =
  "(min-width:1680px) 28vw, (min-width:1024px) 34vw, (min-width:640px) 46vw, 82vw";
/** How long an image holds. Videos advance when they end; this is the cap for very long clips. */
const IMAGE_MS = 4800;
const VIDEO_MAX_MS = 15000;

/** One card: a slideshow through the occasion's own images/videos, with the text and fabric links over it. */
function OccasionCard({
  occasion,
  position,
  total,
}: {
  occasion: Occasion;
  position: number;
  total: number;
}) {
  const { media } = occasion;
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const firstRun = useRef(true);
  const alt = `${occasion.title}: ${occasion.fabrics.map((f) => f).join(", ")}`;

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % media.length),
    [media.length],
  );

  // Advance after the current slide's hold time. The very first hold is staggered per card so the row doesn't change in lockstep.
  useEffect(() => {
    if (media.length <= 1 || reduceMotion) return;
    const hold = IMAGE_MS;
    const stagger = firstRun.current ? position * 900 : 0;
    firstRun.current = false;
    const timer = setTimeout(next, hold + stagger);
    return () => clearTimeout(timer);
  }, [index, media, reduceMotion, position, next]);

  // Only the active slide's video plays, always from the start.
  useEffect(() => {
    media.forEach((m, i) => {
      const video = videoRefs.current[i];
      if (!video) return;
      if (i === index && !reduceMotion) {
        video.currentTime = 0;
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [index, media, reduceMotion]);

  return (
    <article className="group relative isolate flex aspect-4/5 flex-col justify-between overflow-hidden rounded-sm bg-green-dark">
      {media.map((url, i) => (
        <div
          key={url + i}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1400 ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={url}
            alt={i === index ? alt : ""}
            fill
            sizes={CARD_SIZES}
            className="object-cover object-[center_20%]"
          />
        </div>
      ))}
      {/* <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10 transition-colors duration-500 group-hover:from-black/90" /> */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/0 transition-colors duration-500 group-hover:from-black/90" />

      <div className="relative z-10 p-4 xl1:p-5 xl3:p-6">
        {media.length > 1 && (
          <div
            className="mb-3 flex gap-1 xl1:mb-4 xl1:gap-1.5"
            aria-hidden="true"
          >
            {media.map((url, i) => (
              <span
                key={url + i}
                className={cn(
                  "h-0.5 flex-1 rounded-full transition-colors duration-500 xl3:h-1",
                  i === index ? "bg-white" : "bg-white/30",
                )}
              />
            ))}
          </div>
        )}
        <span className="inline-block rounded-full bg-black/30 px-3 py-1 text-xs font-semibold tracking-wider backdrop-blur-sm xl1:text-sm xl3:px-4 xl3:py-1.5 xl3:text-base">
          {String(position + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="relative z-10 p-4 xl1:p-5 xl3:p-6 xl4:p-8">
        <h3 className="text-2xl font-bold leading-tight tracking-tight xl1:text-[1.7rem] xl3:text-4xl xl4:text-[2.6rem]">
          {occasion.title}
        </h3>
        {/* <p className="mt-2 line-clamp-3 max-w-md text-[0.95rem] leading-relaxed text-white/80 xl1:mt-3 xl1:text-base xl3:text-lg xl4:text-xl">
          {occasion.note}
        </p> */}
        <ul className="mt-4 flex flex-wrap gap-2 xl1:mt-5 xl1:gap-2.5 xl3:mt-6">
          {occasion.fabrics.map((f) => (
            <li key={f}>
              <Link
                href={`/category/${f}`}
                className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-green-dark xl1:px-4 xl1:py-2 xl1:text-[0.95rem] xl3:px-5 xl3:text-base"
              >
                {f}
                <ArrowUpRight className="size-3.5 xl1:size-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function OccasionsCarousel({ occasions }: { occasions: Occasion[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [thumb, setThumb] = useState({ width: 100, left: 0 });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const width = Math.min(100, (el.clientWidth / el.scrollWidth) * 100);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
    setThumb({
      width,
      left: max > 0 ? (el.scrollLeft / max) * (100 - width) : 0,
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const items = el.firstElementChild?.children;
    const first = items?.[0] as HTMLElement | undefined;
    const second = items?.[1] as HTMLElement | undefined;
    const step =
      first && second
        ? second.offsetLeft - first.offsetLeft
        : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const btn =
    "grid size-11 place-items-center rounded-full border border-white/40 text-white transition hover:bg-white hover:text-green-dark disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white xl1:size-12 xl2:size-[3.25rem] xl3:size-14";

  return (
    <section
      aria-label="Shop by occasion"
      className="mt-20 overflow-hidden bg-green text-white xl1:mt-28 xl2:mt-32 xl3:mt-36 xl4:mt-44"
    >
      <Container className="py-14 xl1:py-20 xl2:py-24 xl3:py-28 xl4:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6 xl3:gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 xl1:text-sm xl3:text-base">
              Shop by occasion
            </p>
            <h2 className="mt-3 max-w-2xl text-[1.75rem] font-bold leading-tight tracking-tight md:text-4xl xl1:mt-4 xl1:text-[2.6rem] xl2:max-w-3xl xl3:text-5xl xl4:max-w-4xl xl4:text-[3.4rem]">
              What are you dressing for?
            </h2>
          </div>
          <div className="flex items-center gap-2 xl1:gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous occasions"
              className={btn}
            >
              <ChevronLeft className="size-5 xl3:size-6" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next occasions"
              className={btn}
            >
              <ChevronRight className="size-5 xl3:size-6" />
            </button>
          </div>
        </div>

        {/* Scroll track: bleeds out to the container's outer edges (matching Container's padding at each breakpoint) so the next card peeks in. */}
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Occasions"
          className={cn(
            "no-scrollbar mt-8 -mx-4 snap-x snap-mandatory overflow-x-auto scroll-smooth px-4 pb-1 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10",
            "scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-10 xl1:-mx-12 xl1:mt-12 xl1:px-12 xl1:scroll-pl-12 xl2:-mx-14 xl2:px-14 xl2:scroll-pl-14 xl3:-mx-16 xl3:mt-14 xl3:px-16 xl3:scroll-pl-16 xl4:-mx-20 xl4:mt-16 xl4:px-20 xl4:scroll-pl-20",
          )}
        >
          <ul className="flex gap-3 after:w-px after:shrink-0 sm:gap-4 lg:after:w-6 xl1:gap-5 xl1:after:w-8 xl2:gap-6 xl3:gap-7 xl3:after:w-10 xl4:gap-8">
            {occasions.map((o, i) => (
              <li
                key={i}
                className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[34%] xl2:w-[31%] xl3:w-[28%]"
              >
                <OccasionCard
                  occasion={o}
                  position={i}
                  total={occasions.length}
                />
              </li>
            ))}
          </ul>
        </div>

        <div
          className="mt-6 h-0.5 w-full max-w-xs bg-white/25 xl1:mt-8 xl1:max-w-sm xl3:mt-10 xl3:max-w-md"
          aria-hidden="true"
        >
          <div className="relative h-full">
            <div
              className="absolute top-0 h-full bg-white transition-[left,width] duration-150"
              style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
