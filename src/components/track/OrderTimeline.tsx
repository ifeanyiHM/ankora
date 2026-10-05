import { Fragment } from "react";
import { Check } from "lucide-react";
import { ORDER_STATUS_LABELS, TRACKING_STEPS, type OrderStatus } from "@/types";
import { cn } from "@/lib/cn";

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
      <div className="flex min-w-[32rem] items-center xl1:min-w-[40rem] xl3:min-w-[46rem]">
        {TRACKING_STEPS.map((step, i) => {
          const done = i < activeIndex;
          const current = i === activeIndex;
          return (
            <Fragment key={step}>
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-full border-2 text-xs font-bold xl1:size-9 xl1:text-sm xl3:size-11 xl3:text-base xl4:size-12", done ? "border-green bg-green text-white" : current ? "border-green text-green" : "border-line text-muted")}>
                {done ? <Check className="size-4 xl3:size-5" /> : i + 1}
              </span>
              {i < TRACKING_STEPS.length - 1 && <span className={cn("h-0.5 flex-1 xl3:h-1", done ? "bg-green" : "bg-line")} />}
            </Fragment>
          );
        })}
      </div>
      <div className="mt-2 flex min-w-[32rem] xl1:mt-3 xl1:min-w-[40rem] xl3:min-w-[46rem]">
        {TRACKING_STEPS.map((step, i) => (
          <span key={step} className={cn("flex-1 shrink-0 basis-8 px-1 text-center text-xs leading-tight xl1:size-9 xl1:text-sm xl3:text-base xl4:text-[0.95rem]", i === activeIndex ? "font-bold text-ink" : i < activeIndex ? "font-medium text-ink" : "text-muted")}>
            {ORDER_STATUS_LABELS[step]}
          </span>
        ))}
      </div>
    </div>
  );
}
