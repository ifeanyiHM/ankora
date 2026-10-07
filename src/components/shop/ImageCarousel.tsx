"use client";

import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Props {
  images: string[];
  alt: string;
  sizes: string;
  className?: string;
  /** How long each slide holds before advancing. */
  intervalMs?: number;
}

/**
 * Auto-advancing photo carousel: a plain crossfade between slides, nothing else moves.
 * Pauses on hover/focus and when the tab isn't visible, and doesn't auto-advance at all
 * under prefers-reduced-motion (manual controls still work). Every slide stays mounted and
 * is only ever faded by opacity, so looping back to an earlier photo never causes a network
 * refetch or a flash.
 */
export function ImageCarousel({
  images,
  alt,
  sizes,
  className,
  intervalMs = 5000,
}: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (images.length <= 1 || paused || reduceMotionRef.current) return;
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      intervalMs,
    );
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [images.length, paused, intervalMs]);

  if (!images.length) return null;

  const go = (i: number) =>
    setIndex(((i % images.length) + images.length) % images.length);

  return (
    <div
      className={cn("group relative overflow-hidden", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label={alt}
    >
      {images.map((src, i) => (
        <div
          key={src + i}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1100 ease-[cubic-bezier(0.22,1,0.36,1)]",
            i === index ? "z-10 opacity-100" : "z-0 opacity-0",
          )}
        >
          <Image
            src={src}
            alt={i === index ? alt : ""}
            fill
            sizes={sizes}
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}

      {images.length > 1 && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-linear-to-t from-black/35 to-transparent xl1:h-28" />

          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 z-30 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 xl1:size-9 xl1:left-3"
          >
            <ChevronLeft className="size-4 xl1:size-[1.1rem]" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 z-30 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 xl1:size-9 xl1:right-3"
          >
            <ChevronRight className="size-4 xl1:size-[1.1rem]" />
          </button>

          <div className="absolute inset-x-0 bottom-3 z-30 flex justify-center gap-1.5 xl1:bottom-4 xl1:gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === index
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/55 hover:bg-white/85",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
