import { cn } from "@/lib/cn";
import { ORDER_STATUS_LABELS, TRACKING_STEPS, type OrderStatus } from "@/types";
import { Check } from "lucide-react";

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-danger xl1:px-5 xl1:py-4 xl1:text-lg xl3:px-6 xl3:py-5">
        <p className="font-semibold">This order was cancelled.</p>
      </div>
    );
  }

  const currentIndex = TRACKING_STEPS.indexOf(status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-lg xl1:min-w-160 xl3:min-w-184">
        {/* Circles and connecting lines */}
        <div className="flex">
          {TRACKING_STEPS.map((step, i) => {
            const done = i < activeIndex;
            const current = i === activeIndex;
            const isLast = i === TRACKING_STEPS.length - 1;

            return (
              <div
                key={step}
                className="flex min-w-0 flex-1 flex-col items-center"
              >
                {/* Circle row: its height equals the circle, so top-1/2 is the circle's center */}
                <div className="relative flex w-full justify-center">
                  {!isLast && (
                    <span
                      className={cn(
                        "absolute left-1/2 top-1/2 h-0.5 w-full -translate-y-1/2 xl3:h-1",
                        done ? "bg-green" : "bg-line",
                      )}
                    />
                  )}

                  <span
                    className={cn(
                      "relative z-10 grid size-8 place-items-center rounded-full border-2 text-xs font-bold xl1:size-9 xl1:text-sm xl3:size-11 xl3:text-base xl4:size-12",
                      done
                        ? "border-green bg-green text-white"
                        : current
                          ? "border-green bg-white text-green"
                          : "border-line bg-white text-muted",
                    )}
                  >
                    {done ? <Check className="size-4 xl3:size-5" /> : i + 1}
                  </span>
                </div>

                {/* Label centered under its circle */}
                <span
                  className={cn(
                    "mt-2 w-full px-0.5 text-center text-xs leading-tight xl1:mt-3 xl1:text-sm xl3:text-base xl4:text-[0.95rem]",
                    current
                      ? "font-bold text-ink"
                      : done
                        ? "font-medium text-ink"
                        : "text-muted",
                  )}
                >
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
